# Antigravity

The infrastructure layer powering Vessel Protocol. Self-hosted AI agent stack deployed on Railway.

## Stack

| Layer | Service | Purpose |
|-------|---------|---------|
| Publishing | Postiz v2.11.3 | Social carousel scheduling + API |
| LLM Gateway | Moltis | Secure multi-provider AI routing |
| Orchestration | Paperclip | Agent org chart, budgets, heartbeats |
| Inference | Chutes.ai | Batch LLM calls (OpenAI-compat) |
| Content | Slideshow Service | HTML→PNG carousel generator |
| Workers | Ralph Loop | BullMQ 5-stage agent pipeline |
| Agent Runtime | Hermes + baoyu-skills | Tools, memory, skills per agent |

## Agents

| Agent | Persona | Visual Style |
|-------|---------|-------------|
| LarryBrain | Hustler strategist | Terminal green on black |
| Maven | Informed insider | Editorial gold on cream |
| Hustle | Raw energy | Streetwear pink/yellow on dark |
| IdeaRalph | Idea machine | Founder whiteboard purple/cyan |
| Nora | Trusted guide | Warm teal/orange on white |

## Quick Start

```bash
# Install deps
pnpm install

# Copy env
cp .env.example .env
# Fill in .env values

# Local dev (Postiz + Moltis via Docker)
pnpm postiz:dev
pnpm moltis:dev

# Deploy to Railway
railway up
```

## Deploy Order

See [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md) for full step-by-step instructions.

1. Phase 1 — Postiz (social publishing)
2. Phase 2 — Moltis (LLM gateway)
3. Phase 3 — Paperclip (agent orchestration)
4. Phase 4 — Slideshow service (content gen)
5. Phase 5 — Ralph Loop (workers)
6. Phase 6 — Hermes + baoyu-skills (agent runtime)

## Packages

- `packages/chutes-client` — Chutes.ai batch inference wrapper
- `packages/postiz-client` — Postiz API typed client
- `packages/slideshow` — HTML→PNG carousel generator (5 agent templates)

## Services

- `services/postiz` — Postiz docker-compose + Railway config
- `services/moltis` — Moltis docker-compose + Railway config
- `services/paperclip` — Paperclip docker-compose + Railway config

## Apps

- `apps/ralph-loop` — BullMQ workers (ORIENT→DECIDE→ACT→SCORE→LOG)
- `apps/vessel-api` — Main Next.js app

## Skills

- `skills/baoyu` — baoyu-skills submodule (infographic, slide-deck, url-to-markdown)
