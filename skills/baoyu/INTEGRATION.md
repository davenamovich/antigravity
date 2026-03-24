# baoyu-skills Integration — Vessel Protocol

Skills from github.com/JimLiu/baoyu-skills loaded into Hermes Agent,
used by Paperclip agents as callable tools during their task heartbeats.

## Installation (run once on dev machine / Hermes host)

```bash
# Option 1: npx installer
npx skills add jimliu/baoyu-skills

# Option 2: inside Claude Code or Hermes CLI
/plugin marketplace add jimliu/baoyu-skills
/plugin install content-skills@baoyu-skills
/plugin install utility-skills@baoyu-skills
```

## Priority Skills for Vessel Protocol

### 1. baoyu-infographic
**Used by:** IdeaRalph, Maven  
**Purpose:** Generate infographics from agent research/context  
**Ralph Loop stage:** ACT → alternative to slideshow for single-image posts

```bash
# IdeaRalph generating an affiliate offer infographic
/baoyu-infographic context/larrybrain-offer.md --layout funnel --style cyberpunk-neon --aspect 9:16

# Maven generating a market intelligence card
/baoyu-infographic context/maven-intel.md --layout comparison-table --style technical-schematic
```

**Best layout per agent:**
| Agent | Layout | Style |
|-------|--------|-------|
| LarryBrain | funnel | cyberpunk-neon |
| Maven | comparison-table | technical-schematic |
| Hustle | feature-list | bold-graphic |
| IdeaRalph | mind-map | craft-handmade |
| Nora | bridge | storybook-watercolor |

---

### 2. baoyu-slide-deck
**Used by:** All agents  
**Purpose:** Full presentation decks from agent context — exports .pptx + .pdf  
**Ralph Loop stage:** ACT → for longer-form content batches

```bash
# LarryBrain creating a "how to earn" deck
/baoyu-slide-deck context/larrybrain-offer.md --style bold-editorial --audience general --slides 7

# Maven creating an intel brief deck
/baoyu-slide-deck context/maven-weekly.md --style corporate --audience executives --slides 10
```

---

### 3. baoyu-url-to-markdown
**Used by:** All agents  
**Purpose:** ORIENT stage — scrape trending content, competitor pages, affiliate offers  
**Ralph Loop stage:** ORIENT (before DECIDE)

```bash
# Ralph Loop ORIENT: scrape trending crypto content
/baoyu-url-to-markdown https://cointelegraph.com/news/latest -o /tmp/orient-context.md

# Scrape affiliate offer page for context
/baoyu-url-to-markdown https://thevesselprotocol.com -o /tmp/vessel-context.md
```

---

### 4. baoyu-cover-image
**Used by:** All agents  
**Purpose:** Cover image for Postiz text posts (non-carousel)  
**Ralph Loop stage:** ACT → single image posts

```bash
# Quick mode — auto-selects dimensions
/baoyu-cover-image context/post-draft.md --quick --aspect 9:16

# LarryBrain style
/baoyu-cover-image context/post-draft.md --type conceptual --style dark-atmospheric --mood bold
```

---

### 5. baoyu-xhs-images (bonus)
**Used by:** Nora, IdeaRalph  
**Purpose:** Carousel series with illustrated style — softer than our HTML templates  
**Use case:** Nora's onboarding content performs better with illustrated carousels

```bash
# Nora onboarding carousel
/baoyu-xhs-images "How to earn crypto without knowing anything about crypto" --style warm --layout flow

# IdeaRalph idea breakdown
/baoyu-xhs-images context/idea.md --style notion --layout dense
```

---

## Agent → Skill Routing in Ralph Loop

In the DECIDE stage, the agent picks its tool based on content type:

```typescript
// apps/ralph-loop/src/stages/decide.ts
const AGENT_SKILL_MAP = {
  larrybrain: {
    affiliate_offer: "slideshow",        // our HTML renderer
    game_result:     "baoyu-infographic",
    agent_persona:   "slideshow",
  },
  maven: {
    affiliate_offer: "baoyu-slide-deck",
    game_result:     "baoyu-infographic",
    leaderboard:     "baoyu-infographic",
  },
  hustle: {
    affiliate_offer: "slideshow",
    leaderboard:     "slideshow",
    agent_persona:   "slideshow",
  },
  idearalph: {
    affiliate_offer: "baoyu-infographic",
    agent_persona:   "baoyu-xhs-images",
    game_result:     "slideshow",
  },
  nora: {
    affiliate_offer: "baoyu-xhs-images",
    agent_persona:   "baoyu-cover-image",
    leaderboard:     "slideshow",
  },
};
```

---

## Self-Improving Loop (Paperclip task)

Agents can be assigned tasks to improve the skills themselves. In Paperclip, create a recurring task:

```
Task: Review last 7 days of content performance
Agent: IdeaRalph
Instructions: 
  1. Use baoyu-url-to-markdown to pull Postiz analytics
  2. Identify which slide styles performed best per platform
  3. Update EXTEND.md files in .baoyu-skills/ with new style preferences
  4. Commit changes to antigravity repo via git tool
  
Runs: Every Monday 9am
Budget: $2/run
```

This is the "agents improving themselves" loop — IdeaRalph reads performance data
and rewrites the skill config files, which Hermes picks up on next heartbeat.

---

## EXTEND.md Customization per Agent

baoyu-skills supports per-skill overrides via EXTEND.md files.
Create these in `.baoyu-skills/` to lock in agent-specific styles:

```bash
mkdir -p .baoyu-skills/baoyu-infographic
```

`.baoyu-skills/baoyu-infographic/EXTEND.md`:
```markdown
## Agent Style Overrides

### LarryBrain Default
- Style: cyberpunk-neon
- Layout: funnel
- Always include dollar amounts as the primary stat
- Use green (#00FF87) as accent where possible

### Maven Default  
- Style: technical-schematic
- Layout: comparison-table
- Always include source citations
- Tone: analytical, never hype

### Nora Default
- Style: storybook-watercolor
- Layout: bridge (problem → solution)
- Always end with "No experience needed" messaging
```

Hermes loads these on every run — agents stay on-brand without retraining.
