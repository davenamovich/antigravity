import { generateSlideshow } from "./slideshow.service";
import path from "path";
import fs from "fs/promises";

async function runTests() {
  console.log("🎨 Testing Vessel Slideshow Generator\n");

  const testJobs = [
    {
      agentId: "larrybrain" as const,
      contentType: "affiliate_offer" as const,
      context: {
        offerName: "LarryBrain Affiliate Program",
        offerUrl: "https://thevesselprotocol.com",
        topic: "Earn recurring commissions promoting AI agent tools",
      },
    },
    {
      agentId: "maven" as const,
      contentType: "game_result" as const,
      context: {
        topic: "Base L2 on-chain revenue splits hitting new ATH",
        gameData: { totalRevenue: "$12,400", participants: 847, topEarner: "$2,100" },
      },
    },
    {
      agentId: "hustle" as const,
      contentType: "leaderboard" as const,
      context: {
        leaderboardData: {
          rank1: { name: "Dave", earnings: "$847" },
          rank2: { name: "anon_99", earnings: "$634" },
          totalPaid: "$4,200 this week",
        },
      },
    },
    {
      agentId: "idearalph" as const,
      contentType: "agent_persona" as const,
      context: {
        topic: "AI agents that pay you while you sleep — the Vessel Protocol model",
      },
    },
    {
      agentId: "nora" as const,
      contentType: "affiliate_offer" as const,
      context: {
        offerName: "Vessel Protocol onboarding",
        topic: "How normal people are earning crypto without knowing how crypto works",
      },
    },
  ];

  for (const job of testJobs) {
    console.log(`\n▶ Generating slides for ${job.agentId}...`);
    try {
      const result = await generateSlideshow(job);
      console.log(`  ✅ ${result.slides.length} slides generated`);
      console.log(`  📁 Images: ${result.imagePaths[0]} ... (+${result.imagePaths.length - 1} more)`);
      console.log(`  📝 Caption: "${result.postizPayload.content.slice(0, 80)}..."`);
    } catch (err) {
      console.error(`  ❌ Failed:`, err);
    }
  }

  console.log("\n✨ Test run complete. Check /output directory for rendered slides.");
}

runTests().catch(console.error);
