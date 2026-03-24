import OpenAI from "openai";

export const DEFAULT_MODEL = "deepseek-ai/DeepSeek-V3-0324";

// ── Single client singleton ──────────────────────────────────
export const chutes = new OpenAI({
  apiKey: process.env.CHUTES_API_KEY ?? "no-key",
  baseURL: process.env.CHUTES_BASE_URL ?? "https://llm.chutes.ai/v1",
});

// ── Types ────────────────────────────────────────────────────
export interface ChatJob {
  id: string;
  system: string;
  user: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ChatResult {
  id: string;
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// ── Single call ───────────────────────────────────────────────
export async function chat(
  system: string,
  user: string,
  opts?: { model?: string; maxTokens?: number; temperature?: number }
): Promise<string> {
  const res = await chutes.chat.completions.create({
    model: opts?.model ?? DEFAULT_MODEL,
    max_tokens: opts?.maxTokens ?? 1500,
    temperature: opts?.temperature ?? 0.7,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return res.choices[0].message.content ?? "";
}

// ── Batch call — fires N jobs concurrently ────────────────────
// Chutes handles the parallelism on their end via concurrency settings.
// We batch from our side using Promise.allSettled for resilience.
export async function batchChat(jobs: ChatJob[]): Promise<ChatResult[]> {
  const results = await Promise.allSettled(
    jobs.map(async (job) => {
      const res = await chutes.chat.completions.create({
        model: job.model ?? DEFAULT_MODEL,
        max_tokens: job.maxTokens ?? 1500,
        temperature: job.temperature ?? 0.7,
        messages: [
          { role: "system", content: job.system },
          { role: "user", content: job.user },
        ],
      });

      return {
        id: job.id,
        content: res.choices[0].message.content ?? "",
        usage: {
          promptTokens: res.usage?.prompt_tokens ?? 0,
          completionTokens: res.usage?.completion_tokens ?? 0,
          totalTokens: res.usage?.total_tokens ?? 0,
        },
      } satisfies ChatResult;
    })
  );

  // Return successful results; log failures
  return results
    .map((r, i) => {
      if (r.status === "fulfilled") return r.value;
      console.error(`[chutes-batch] Job ${jobs[i].id} failed:`, r.reason);
      return null;
    })
    .filter((r): r is ChatResult => r !== null);
}

// ── Rate-limited batch (for large sets) ──────────────────────
// Splits into chunks of `concurrency` and fires each chunk
export async function batchChatChunked(
  jobs: ChatJob[],
  concurrency = 10
): Promise<ChatResult[]> {
  const results: ChatResult[] = [];

  for (let i = 0; i < jobs.length; i += concurrency) {
    const chunk = jobs.slice(i, i + concurrency);
    const chunkResults = await batchChat(chunk);
    results.push(...chunkResults);

    // Small delay between chunks to respect rate limits
    if (i + concurrency < jobs.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  return results;
}

// ── JSON extraction helper ────────────────────────────────────
export function extractJSON<T>(raw: string): T {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned) as T;
}
