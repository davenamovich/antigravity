# Antigravity → Railway: Step-by-Step Deployment

## Prerequisites (do these first, off Railway)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Make sure repo is on GitHub
git init
git remote add origin https://github.com/YOUR_USERNAME/antigravity.git
git add . && git commit -m "init: antigravity monorepo"
git push -u origin main
```

---

## Phase 1 — Postiz (Day 1)

### Step 1: Create Railway project

```bash
railway init
# Name it: antigravity
# Select: Empty project
```

Or go to https://railway.app/new → "Empty Project" → name it `antigravity`

---

### Step 2: Add Postgres for Postiz

In Railway dashboard:
1. Click **+ New** → **Database** → **Add PostgreSQL**
2. Name it `postiz-db`
3. Copy the `DATABASE_URL` from the Variables tab — you'll need it

---

### Step 3: Add Redis for Postiz

1. Click **+ New** → **Database** → **Add Redis**
2. Name it `postiz-redis`
3. Copy `REDIS_URL`

---

### Step 4: Deploy Postiz service

1. Click **+ New** → **GitHub Repo**
2. Select `antigravity` repo
3. Set **Root Directory** to: `services/postiz`
4. Railway will detect the Dockerfile automatically

**Set these environment variables in the Postiz service:**

```
MAIN_APP_URL         = https://postiz-antigravity.up.railway.app
FRONTEND_URL         = https://postiz-antigravity.up.railway.app
JWT_SECRET           = (run: openssl rand -base64 32)
DATABASE_URL         = (paste from postiz-db)
REDIS_URL            = (paste from postiz-redis)
DISABLE_REGISTRATION = false
```

> ⚠️ IMPORTANT: Leave DISABLE_REGISTRATION=false until AFTER you create your first account

5. Click **Deploy**
6. Wait for health check to pass (watch logs)
7. Open the generated URL → Register your admin account
8. **Immediately** set `DISABLE_REGISTRATION=true` and redeploy

---

### Step 5: Configure Postiz social providers

In Postiz web UI:
1. Go to **Settings** → **Providers**
2. Add Twitter/X, TikTok, Instagram OAuth credentials
3. Connect your agent social accounts

---

### Step 6: Get Postiz API key

1. Settings → **API Keys** → Create new key
2. Copy it → add to your `.env` as `POSTIZ_API_KEY`

---

## Phase 2 — Moltis (Day 1-2)

### Step 7: Deploy Moltis

1. **+ New** → **GitHub Repo** → `antigravity`
2. Root Directory: `services/moltis`

**Environment variables:**
```
ANTHROPIC_API_KEY  = (your key — fallback model)
OPENAI_API_KEY     = (your CHUTES_API_KEY — Moltis uses OpenAI-compat)
OPENAI_BASE_URL    = https://llm.chutes.ai/v1
```

3. Deploy → watch logs for the **setup code** printed on first run
4. Open Moltis URL → enter setup code → set password

### Step 8: Configure Moltis → Postiz MCP

In Moltis web UI:
1. Settings → **MCP Servers** → Add new
2. Name: `postiz`
3. URL: `https://YOUR-POSTIZ-URL.railway.app/api/mcp/YOUR_POSTIZ_API_KEY`
4. Transport: `HTTP`
5. Save → test connection

---

## Phase 3 — Paperclip (Day 2)

### Step 9: Add Postgres for Paperclip

1. **+ New** → **Database** → **Add PostgreSQL**
2. Name it `paperclip-db` (separate from Postiz)
3. Copy `DATABASE_URL`

### Step 10: Deploy Paperclip

1. **+ New** → **GitHub Repo** → `antigravity`
2. Root Directory: `services/paperclip`

**Environment variables:**
```
DATABASE_URL    = (paste from paperclip-db)
JWT_SECRET      = (run: openssl rand -base64 32)
PORT            = 3100
NODE_ENV        = production
```

3. Deploy → open URL → complete onboarding wizard

### Step 11: Set up Vessel Protocol company in Paperclip

In Paperclip UI:
```
Company name:    Vessel Protocol
Mission:         Automate affiliate content and on-chain revenue via AI agents
Budget/agent:    $50/month (adjust as needed)
```

**Hire your agents (in order):**
1. LarryBrain — Role: Affiliate Content Lead
2. Maven — Role: Market Intelligence
3. Hustle — Role: Engagement & Community
4. IdeaRalph — Role: Content Strategy
5. Nora — Role: Onboarding & Education

---

## Phase 4 — Slideshow Service (Day 2-3)

### Step 12: Deploy Slideshow service

1. **+ New** → **GitHub Repo** → `antigravity`
2. Root Directory: `apps/slideshow` (or wherever you place the package)

**Environment variables:**
```
CHUTES_API_KEY      = (your Chutes key)
CHUTES_BASE_URL     = https://llm.chutes.ai/v1
CHUTES_MODEL        = deepseek-ai/DeepSeek-V3-0324
PORT                = 3500
```

3. Deploy → test: `curl https://YOUR-SLIDESHOW-URL/health`

---

## Phase 5 — Ralph Loop (Day 3)

### Step 13: Deploy Ralph Loop workers

1. **+ New** → **GitHub Repo** → `antigravity`
2. Root Directory: `apps/ralph-loop`

**Environment variables:**
```
DATABASE_URL          = (same as vessel-api Postgres)
REDIS_URL             = (same Redis as Postiz OR new Redis)
CHUTES_API_KEY        = 
CHUTES_BASE_URL       = https://llm.chutes.ai/v1
POSTIZ_API_KEY        = 
POSTIZ_API_URL        = https://YOUR-POSTIZ-URL.railway.app/public/v1
SLIDESHOW_SERVICE_URL = https://YOUR-SLIDESHOW-URL.railway.app
COMPOSIO_API_KEY      = 
```

---

## Phase 6 — Hermes + baoyu-skills (Day 3-4)

### Step 14: Install Hermes Agent locally (your dev machine)

```bash
pip install hermes-agent
hermes --version  # verify
```

### Step 15: Install baoyu-skills into Hermes

```bash
# In your project root
npx skills add jimliu/baoyu-skills

# Or inside Claude Code / Hermes:
/plugin marketplace add jimliu/baoyu-skills
/plugin install content-skills@baoyu-skills
/plugin install utility-skills@baoyu-skills
```

**Priority skills to activate:**
- `baoyu-infographic` → agent-driven infographic generation
- `baoyu-slide-deck` → full decks from agent context
- `baoyu-url-to-markdown` → ORIENT stage web scraping
- `baoyu-cover-image` → Postiz post cover images

### Step 16: Register Hermes adapter in Paperclip

In your Paperclip codebase (`server/src/adapters/registry.ts`):

```typescript
import * as hermesLocal from "@nousresearch/paperclip-adapter-hermes";
import { execute, testEnvironment } from "@nousresearch/paperclip-adapter-hermes/server";

registry.set("hermes_local", {
  ...hermesLocal,
  execute,
  testEnvironment,
});
```

### Step 17: Assign agent runtimes in Paperclip UI

For each agent (LarryBrain, Maven, etc.):
- Adapter type: `hermes_local`
- Model: `openai/deepseek-ai/DeepSeek-V3-0324` (via Chutes)
- Enabled toolsets: `["web", "file", "mcp"]`
- Persist session: `true`

---

## Verification Checklist

Run these after each phase:

```bash
# Phase 1: Postiz
curl https://YOUR-POSTIZ-URL/api/health

# Phase 2: Moltis  
curl https://YOUR-MOLTIS-URL/health

# Phase 3: Paperclip
curl https://YOUR-PAPERCLIP-URL/health

# Phase 4: Slideshow
curl -X POST https://YOUR-SLIDESHOW-URL/generate \
  -H "Content-Type: application/json" \
  -d '{"agentId":"larrybrain","contentType":"affiliate_offer","context":{"topic":"test"}}'

# Phase 5: Ralph Loop
curl https://YOUR-RALPH-LOOP-URL/health
```

---

## Full Railway Service Map (when complete)

```
antigravity (Railway project)
├── postiz           → https://postiz-antigravity.up.railway.app
│   ├── postiz-db    (Postgres — auto-provisioned)
│   └── postiz-redis (Redis — auto-provisioned)
├── moltis           → https://moltis-antigravity.up.railway.app
├── paperclip        → https://paperclip-antigravity.up.railway.app
│   └── paperclip-db (Postgres — auto-provisioned)
├── slideshow        → https://slideshow-antigravity.up.railway.app
└── ralph-loop       → https://ralph-antigravity.up.railway.app
    └── (shared Redis with Postiz or own Redis)
```

---

## Cost Estimate (Railway Hobby plan)

| Service | Est. RAM | $/month |
|---------|----------|---------|
| Postiz + DB + Redis | 512MB | ~$5 |
| Moltis | 256MB | ~$3 |
| Paperclip + DB | 512MB | ~$5 |
| Slideshow | 1GB (Puppeteer) | ~$8 |
| Ralph Loop | 256MB | ~$3 |
| **Total** | | **~$24/month** |

Chutes.ai billed separately per inference call.

---

## Troubleshooting

**Postiz 502 on registration:**
- Check Redis connection — most common cause
- Verify `REDIS_URL` format: `redis://default:PASSWORD@HOST:PORT`

**Moltis setup code not showing:**
- Check Railway logs immediately after first deploy
- The code only prints once — if missed, delete volume and redeploy

**Slideshow OOM crash:**
- Puppeteer needs ~800MB RAM — upgrade Railway service to 1GB
- Add `--disable-dev-shm-usage` to Puppeteer args (already in template)

**Paperclip agents not heartbeating:**
- Verify `DATABASE_URL` is pointing to `paperclip-db` not `postiz-db`
- Check agent adapter registration in registry.ts
