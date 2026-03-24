import { Queue, Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { batchChat, extractJSON } from "@antigravity/chutes-client";
import { PostizClient } from "@antigravity/postiz-client";
import Fastify from "fastify";

// ── Redis connection ─────────────────────────────────────────
const redis = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

const postiz = new PostizClient();

// ── Queue definitions ────────────────────────────────────────
export const ralphQueue = new Queue("ralph-loop", { connection: redis });

export type AgentId = "larrybrain" | "maven" | "hustle" | "idearalph" | "nora";
export type ContentType = "game_result" | "affiliate_offer" | "agent_persona" | "leaderboard";

export interface RalphJob {
  agentId: AgentId;
  runId: string;
  triggeredBy: "heartbeat" | "manual" | "event";
}

// ── ORIENT ───────────────────────────────────────────────────
async function orient(job: RalphJob): Promise<{ topics: string[]; trendContext: string }> {
  console.log(`[ORIENT] ${job.agentId} scanning for topics...`);

  const results = await batchChat([
    {
      id: "trending",
      system: "You are a social media trend analyst. Return JSON only.",
      user: `Find 3 trending topics relevant to crypto affiliate marketing and Web3 income right now.
Return: { "topics": ["topic1","topic2","topic3"], "trendContext": "brief summary" }`,
    },
  ]);

  const data = extractJSON<{ topics: string[]; trendContext: string }>(results[0].content);
  console.log(`[ORIENT] Found ${data.topics.length} topics`);
  return data;
}

// ── DECIDE ───────────────────────────────────────────────────
async function decide(
  job: RalphJob,
  orientData: { topics: string[]; trendContext: string }
): Promise<{ contentType: ContentType; topic: string; offerUrl?: string }> {
  console.log(`[DECIDE] ${job.agentId} picking angle...`);

  const AGENT_OFFERS: Record<AgentId, string> = {
    larrybrain: "https://thevesselprotocol.com/?ref=larrybrain",
    maven: "https://thevesselprotocol.com/?ref=maven",
    hustle: "https://thevesselprotocol.com/?ref=hustle",
    idearalph: "https://thevesselprotocol.com/?ref=idearalph",
    nora: "https://thevesselprotocol.com/?ref=nora",
  };

  const results = await batchChat([
    {
      id: "decide",
      system: `You are ${job.agentId}, an AI agent deciding what content to create. Return JSON only.`,
      user: `Topics available: ${orientData.topics.join(", ")}
Trend context: ${orientData.trendContext}

Pick the best topic and content type for maximum engagement.
Content types: game_result, affiliate_offer, agent_persona, leaderboard

Return: { "contentType": "...", "topic": "..." }`,
    },
  ]);

  const data = extractJSON<{ contentType: ContentType; topic: string }>(results[0].content);
  return { ...data, offerUrl: AGENT_OFFERS[job.agentId] };
}

// ── ACT ──────────────────────────────────────────────────────
async function act(
  job: RalphJob,
  decideData: { contentType: ContentType; topic: string; offerUrl?: string }
): Promise<{ imagePaths: string[]; caption: string; postizPayload: any }> {
  console.log(`[ACT] ${job.agentId} generating content: ${decideData.contentType}`);

  const slideshowUrl = process.env.SLIDESHOW_SERVICE_URL ?? "http://slideshow:3500";

  const res = await fetch(`${slideshowUrl}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      agentId: job.agentId,
      contentType: decideData.contentType,
      context: {
        topic: decideData.topic,
        offerUrl: decideData.offerUrl,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Slideshow service error: ${res.status}`);
  }

  const result = await res.json() as any;
  console.log(`[ACT] Generated ${result.slideCount} slides`);
  return result;
}

// ── SCORE ────────────────────────────────────────────────────
async function score(
  job: RalphJob,
  postizPostId: string
): Promise<{ score: number; metrics: Record<string, number> }> {
  console.log(`[SCORE] ${job.agentId} evaluating post ${postizPostId}...`);

  // In production: poll Postiz analytics API
  // For now: return a placeholder that gets filled in by a delayed job
  return {
    score: 0,
    metrics: {
      views: 0,
      likes: 0,
      shares: 0,
      clicks: 0,
    },
  };
}

// ── LOG ──────────────────────────────────────────────────────
async function log(
  job: RalphJob,
  data: {
    orientData: any;
    decideData: any;
    postizPostId: string;
    scoreData: any;
  }
): Promise<void> {
  console.log(`[LOG] ${job.agentId} run ${job.runId} complete`, {
    topic: data.decideData.topic,
    contentType: data.decideData.contentType,
    postizPostId: data.postizPostId,
    score: data.scoreData.score,
  });
  // TODO: write to Postgres runs table
}

// ── Main worker ──────────────────────────────────────────────
const worker = new Worker<RalphJob>(
  "ralph-loop",
  async (job: Job<RalphJob>) => {
    const { agentId, runId, triggeredBy } = job.data;
    console.log(`\n🔄 Ralph Loop starting — agent: ${agentId} run: ${runId} trigger: ${triggeredBy}`);

    try {
      // 1. ORIENT
      await job.updateProgress(10);
      const orientData = await orient(job.data);

      // 2. DECIDE
      await job.updateProgress(25);
      const decideData = await decide(job.data, orientData);

      // 3. ACT — generate slideshow
      await job.updateProgress(50);
      const actData = await act(job.data, decideData);

      // 4. Publish to Postiz
      await job.updateProgress(70);
      let postizPostId = "dry-run";
      if (process.env.NODE_ENV === "production") {
        const postResult = await postiz.publishCarousel(
          actData.imagePaths,
          actData.postizPayload.content,
          actData.postizPayload.platforms
        );
        postizPostId = postResult.id;
      }
      console.log(`[PUBLISH] Post queued: ${postizPostId}`);

      // 5. SCORE (async — real metrics come later via webhook)
      await job.updateProgress(85);
      const scoreData = await score(job.data, postizPostId);

      // 6. LOG
      await job.updateProgress(95);
      await log(job.data, { orientData, decideData, postizPostId, scoreData });

      await job.updateProgress(100);
      console.log(`✅ Ralph Loop complete — ${agentId} run ${runId}`);

      return { postizPostId, topic: decideData.topic, slides: actData.imagePaths.length };
    } catch (err) {
      console.error(`❌ Ralph Loop failed — ${agentId} run ${runId}:`, err);
      throw err;
    }
  },
  {
    connection: redis,
    concurrency: 5, // run up to 5 agents simultaneously
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});

// ── Fastify health + trigger API ─────────────────────────────
const server = Fastify({ logger: false });

server.get("/health", async () => ({
  status: "ok",
  service: "ralph-loop",
  queueName: "ralph-loop",
}));

// Manual trigger endpoint
server.post<{ Body: { agentId: AgentId; triggeredBy?: string } }>(
  "/trigger",
  async (req, reply) => {
    const { agentId, triggeredBy = "manual" } = req.body;
    const runId = `${agentId}-${Date.now()}`;

    await ralphQueue.add(
      runId,
      { agentId, runId, triggeredBy } as RalphJob,
      { attempts: 2, backoff: { type: "exponential", delay: 5000 } }
    );

    return { queued: true, runId };
  }
);

// Paperclip heartbeat webhook
server.post<{ Body: { agentId: string; taskId: string; taskBody: string } }>(
  "/heartbeat",
  async (req, reply) => {
    const { agentId, taskId, taskBody } = req.body;
    const runId = `heartbeat-${agentId}-${taskId}`;

    await ralphQueue.add(
      runId,
      {
        agentId: agentId as AgentId,
        runId,
        triggeredBy: "heartbeat",
      } as RalphJob,
      { attempts: 2 }
    );

    return { accepted: true, runId };
  }
);

const PORT = parseInt(process.env.RALPH_LOOP_PORT ?? "3600");
server.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
  if (err) throw err;
  console.log(`⚙️  Ralph Loop worker + API running on port ${PORT}`);
});
