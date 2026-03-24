import Fastify from "fastify";
import { generateSlideshow, SlideShowJob } from "./slideshow.service";

const server = Fastify({ logger: true });

// Health check
server.get("/health", async () => ({ status: "ok", service: "vessel-slideshow" }));

// Generate slideshow carousel
server.post<{ Body: SlideShowJob }>("/generate", async (request, reply) => {
  const job = request.body;

  if (!job.agentId || !job.contentType) {
    return reply.status(400).send({ error: "agentId and contentType required" });
  }

  try {
    const result = await generateSlideshow(job);

    return {
      success: true,
      agentId: result.agentId,
      slideCount: result.slides.length,
      slides: result.slides,
      imagePaths: result.imagePaths,
      postizPayload: result.postizPayload,
    };
  } catch (err) {
    server.log.error(err);
    return reply.status(500).send({ error: "Slideshow generation failed", detail: String(err) });
  }
});

// Preview single slide as HTML (for debugging)
server.get<{
  Params: { agentId: string };
  Querystring: { type?: string; headline?: string; body?: string };
}>("/preview/:agentId", async (request, reply) => {
  const { agentId } = request.params;
  const { type = "hook", headline = "Test Headline Here", body = "Test body copy goes here." } = request.query;

  const { renderAgentSlide } = await import("./templates/renderer");

  const html = renderAgentSlide(agentId as any, {
    type: type as any,
    headline,
    body,
  }, 0, 5);

  return reply.type("text/html").send(html);
});

const start = async () => {
  try {
    await server.listen({ port: 3500, host: "0.0.0.0" });
    console.log("🎨 Vessel Slideshow Service running on port 3500");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
