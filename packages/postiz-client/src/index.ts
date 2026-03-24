export interface PostizPost {
  content: string;
  platforms: PostizPlatform[];
  date?: string; // ISO string, omit for immediate
  tags?: string[];
  media?: PostizMedia[];
}

export type PostizPlatform =
  | "tiktok"
  | "instagram"
  | "twitter"
  | "linkedin"
  | "youtube"
  | "threads"
  | "bluesky";

export interface PostizMedia {
  url?: string;
  path?: string; // local file path — use url for Railway
}

export interface PostizCreateResult {
  id: string;
  status: "pending" | "scheduled" | "published" | "failed";
  platformPostIds?: Record<string, string>;
}

export class PostizClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(
    baseUrl = process.env.POSTIZ_API_URL ?? "",
    apiKey = process.env.POSTIZ_API_KEY ?? ""
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
  }

  private async fetch<T>(
    path: string,
    init: RequestInit = {}
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        ...init.headers,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Postiz ${path} → ${res.status}: ${text}`);
    }

    return res.json() as Promise<T>;
  }

  // ── Schedule a carousel post ─────────────────────────────
  async createPost(post: PostizPost): Promise<PostizCreateResult> {
    return this.fetch<PostizCreateResult>("/posts", {
      method: "POST",
      body: JSON.stringify(post),
    });
  }

  // ── Upload image and get URL back ─────────────────────────
  async uploadMedia(filePath: string): Promise<string> {
    const fs = await import("fs");
    const path = await import("path");
    const FormData = (await import("form-data")).default;

    const form = new FormData();
    form.append("file", fs.createReadStream(filePath), {
      filename: path.basename(filePath),
      contentType: "image/png",
    });

    const res = await fetch(`${this.baseUrl}/media/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        ...form.getHeaders(),
      },
      body: form as unknown as BodyInit,
    });

    if (!res.ok) {
      throw new Error(`Postiz upload failed: ${res.status}`);
    }

    const data = (await res.json()) as { url: string };
    return data.url;
  }

  // ── Upload all slides and create carousel post ────────────
  async publishCarousel(
    imagePaths: string[],
    caption: string,
    platforms: PostizPlatform[],
    scheduledAt?: Date
  ): Promise<PostizCreateResult> {
    // Upload all images
    const mediaUrls = await Promise.all(
      imagePaths.map((p) => this.uploadMedia(p))
    );

    return this.createPost({
      content: caption,
      platforms,
      date: scheduledAt?.toISOString(),
      media: mediaUrls.map((url) => ({ url })),
    });
  }

  // ── Get post status ───────────────────────────────────────
  async getPost(postId: string): Promise<PostizCreateResult> {
    return this.fetch<PostizCreateResult>(`/posts/${postId}`);
  }

  // ── Batch publish multiple carousels ─────────────────────
  async batchPublish(
    posts: Array<{
      imagePaths: string[];
      caption: string;
      platforms: PostizPlatform[];
      scheduledAt?: Date;
    }>
  ): Promise<PostizCreateResult[]> {
    return Promise.all(
      posts.map((p) =>
        this.publishCarousel(p.imagePaths, p.caption, p.platforms, p.scheduledAt)
      )
    );
  }
}

export const postiz = new PostizClient();
