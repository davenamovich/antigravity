import { chutes, extractJSON } from "@antigravity/chutes-client";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs/promises";
import { renderAgentSlide } from "./templates/renderer";
import { AGENT_PERSONAS } from "./personas";

export type AgentId =
  | "larrybrain"
  | "maven"
  | "hustle"
  | "idearalph"
  | "nora";

export type ContentType =
  | "game_result"
  | "affiliate_offer"
  | "agent_persona"
  | "leaderboard";

export interface SlideShowJob {
  agentId: AgentId;
  contentType: ContentType;
  context: {
    topic?: string;
    offerName?: string;
    offerUrl?: string;
    gameData?: Record<string, unknown>;
    leaderboardData?: Record<string, unknown>;
  };
}

export interface Slide {
  type: "hook" | "value" | "proof" | "cta";
  headline: string;
  body: string;
  eyebrow?: string;
  cta?: string;
  stat?: string;
}

export interface SlideshowResult {
  agentId: AgentId;
  slides: Slide[];
  imagePaths: string[];
  postizPayload: PostizCarouselPayload;
}

export interface PostizCarouselPayload {
  content: string;
  platforms: string[];
  images: string[];
  tags: string[];
}

// Chutes.ai OpenAI-compatible client (imported from shared package)

export async function generateSlideshow(
  job: SlideShowJob
): Promise<SlideshowResult> {
  const persona = AGENT_PERSONAS[job.agentId];

  // Step 1: LLM generates slide copy
  const slides = await generateSlideCopy(job, persona);

  // Step 2: Render each slide to HTML → PNG
  const imagePaths = await renderSlides(job.agentId, slides);

  // Step 3: Build Postiz carousel payload
  const postizPayload = buildPostizPayload(job, slides, imagePaths, persona);

  return {
    agentId: job.agentId,
    slides,
    imagePaths,
    postizPayload,
  };
}

async function generateSlideCopy(
  job: SlideShowJob,
  persona: (typeof AGENT_PERSONAS)[AgentId]
): Promise<Slide[]> {
  const contextStr = JSON.stringify(job.context, null, 2);

  const systemPrompt = `You are ${persona.name}, ${persona.description}

Your voice: ${persona.voice}
Your audience: ${persona.audience}
Your style rules: ${persona.styleRules.join(", ")}

You are generating carousel slide copy for TikTok/Instagram Reels (9:16 vertical format).
Each slide must be punchy, scroll-stopping, and true to your persona.

RULES:
- Decide how many slides (3-7) based on what the content needs. Never pad.
- Slide types: hook (1, always first), value (1-4), proof (0-1, only if data exists), cta (1, always last)
- Headlines: max 6 words, punchy
- Body: max 20 words, conversational
- CTAs: specific, action-oriented, never "click link in bio" — be creative
- eyebrow: optional 1-3 word label above headline (e.g. "Real talk:", "Week 3:", "Nobody says:")
- stat: optional bold number/stat to display prominently on value slides

Respond ONLY with a valid JSON array of slide objects. No markdown, no explanation.

Schema:
[
  {
    "type": "hook" | "value" | "proof" | "cta",
    "headline": "string",
    "body": "string",
    "eyebrow": "string (optional)",
    "cta": "string (only on cta type)",
    "stat": "string (optional, e.g. '$847/mo', '23K views', '4.2x ROI')"
  }
]`;

  const userPrompt = `Content type: ${job.contentType}
Context: ${contextStr}

Generate the carousel slides now.`;

  const response = await chutes.chat.completions.create({
    model: process.env.CHUTES_MODEL ?? "deepseek-ai/DeepSeek-V3-0324",
    max_tokens: 1500,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const raw = response.choices[0].message.content ?? "";
  return extractJSON<Slide[]>(raw);
}

async function renderSlides(
  agentId: AgentId,
  slides: Slide[]
): Promise<string[]> {
  const outputDir = path.join(process.cwd(), "output", agentId, Date.now().toString());
  await fs.mkdir(outputDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const imagePaths: string[] = [];

  try {
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const html = renderAgentSlide(agentId, slide, i, slides.length);

      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 2 });
      await page.setContent(html, { waitUntil: "networkidle0" });

      // wait for fonts
      await page.evaluateHandle("document.fonts.ready");

      const outputPath = path.join(outputDir, `slide-${i + 1}.png`);
      await page.screenshot({ path: outputPath, type: "png" });
      await page.close();

      imagePaths.push(outputPath);
    }
  } finally {
    await browser.close();
  }

  return imagePaths;
}

function buildPostizPayload(
  job: SlideShowJob,
  slides: Slide[],
  imagePaths: string[],
  persona: (typeof AGENT_PERSONAS)[AgentId]
): PostizCarouselPayload {
  const hookSlide = slides[0];
  const ctaSlide = slides[slides.length - 1];

  // Caption = hook headline + CTA + tags
  const caption = `${hookSlide.headline}\n\n${ctaSlide.cta ?? ""}\n\n${persona.defaultTags.join(" ")}`;

  return {
    content: caption,
    platforms: ["tiktok", "instagram"],
    images: imagePaths,
    tags: persona.defaultTags,
  };
}
