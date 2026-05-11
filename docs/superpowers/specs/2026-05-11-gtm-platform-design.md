# GTM Platform — Generalized Product Lifecycle Engine

> Spec v1.0 · 2026-05-11
> Status: design approved, pending implementation plan

## Overview

Generalize the GTM Agent Swarm from a hand-configured repo into a platform where any product can plug in and get GTM capabilities automatically. Target: internal product matrix first (Solvea, VOC AI, BTCMind, Flatkey, PairCode), architecture SaaS-ready.

## Key Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Target user | Internal product matrix first, SaaS-ready architecture | Validate model before multi-tenancy complexity |
| Product onboarding | URL input → AI analysis → founder confirmation | Reduce manual project.yaml creation to a single step |
| Iron Triangle | Shared human pool | Reuse existing people across products, no per-agent binding |
| Content engine | Shared base skeleton + async product-specific build | Ships content in 1 hour, improves over time |
| Storage | PostgreSQL (JSONB columns) | Railway-native, handles semi-structured docs, supports indexing and queries |

## Layer 1: Product Lifecycle State Machine

A product is a stateful lifecycle object, not a static YAML file.

```
onboarding  →  strategy  →  engine_building  →  active  →  (paused | archived)
```

| State | Trigger | Actions available | Artifacts |
|---|---|---|---|
| `onboarding` | Founder enters URL(s) | AI analyzes product, generates project config | workspace row, project config (auto-filled) |
| `strategy` | Founder confirms info | ContentOS 4-step wizard runs automatically | 4 strategy docs (market insight, user insight, competitor analysis, content strategy) |
| `engine_building` | Strategy complete | Shared skeleton activated immediately; product-specific engine built async in background | Base engine (instant) + custom engine (async) |
| `active` | Engine ready | Daily cron sources ideas; agents produce content; pipeline runs | Content pipeline (ideas → drafts → bank → published) |
| `paused` | Manual action | Cron stopped, data preserved | — |
| `archived` | Product sunset | Data retained, all automations disabled | — |

### Onboarding Inputs

- **Product website URL** (required): AI scrapes site, infers product category, tagline, audience, competitors
- **GitHub knowledge base URL** (optional): Repository of markdown files (organized in folders) providing product depth — docs, guides, technical specs, brand guidelines

AI presents analysis results. Founder confirms/corrects. One click to proceed.

## Layer 2: Shared Human Pool

Builders and Reviewers are platform-level resources, not per-agent bindings.

### Data Model

```yaml
# people/<handle>.yaml → migrated to people table
handle: wayne
role: builder          # builder | reviewer
channels:              # which agent channels this person can handle
  - reddit
  - social
max_workload: 3        # max agents they can be assigned to
```

### Allocation Rules

1. New agent creation: auto-assign from pool by channel match + lowest current workload
2. If no person covers a channel → flag agent as `needs_people`, show staffing ticket in Dashboard
3. All assignments stored in `agent_assignments` table, Dashboard supports drag-to-reassign
4. One person can be Builder for Product A's Reddit agent AND Product B's Reddit agent

## Layer 3: Engine Template Inheritance

Three-tier content engine resolution:

### Tier 1: Shared Base Skeleton (`engines/_base/`)

Checked into the repo, seeded into `engines` table with `workspace_id = NULL` on deploy. Contains:

```
voice/brand-voice.md       # Generic professional-but-approachable voice
voice/platform-tone.md     # Platform-specific tone differences
audience/casual.md         # Generic casual audience
audience/builders.md       # Generic builder/developer audience
platforms/x.md, linkedin.md, newsletter.md, youtube.md, tiktok.md...
```

### Tier 2: Product Overrides (`workspaces.engine_overrides` JSONB)

```json
{
  "brand_voice": "Crypto-native, talk like a trader not an analyst",
  "primary_audience": "BTC daily traders",
  "tone": "irreverent"
}
```

### Tier 3: Product-Specific Engine (async build)

After strategy is complete, ContentOS generates a full product-specific engine (the 17-file skill graph). Stored in `engines` table with `workspace_id = <product>`. When present, overrides both Tier 1 and Tier 2 for that file.

### Runtime Resolution

```
content generation context assembly:
  for each engine file needed:
    1. SELECT from engines WHERE workspace_id = <product> AND file_path = <path>
    2. If not found → SELECT from engines WHERE workspace_id IS NULL AND file_path = <path>
    3. If not found → use workspace.engine_overrides + workspace config as fallback
```

## Layer 4: Multi-Product Dashboard

### Pages

**Home — Product Overview**
- Card grid: one card per product, color-coded by lifecycle state
- Each card: product name, state badge, pipeline counts (ideas/drafts/published)
- Top bar: "New Product" button, pool status summary (Wayne 2/3, Ivy 1/3)
- Bottom bar: today's output summary across all products

**Product Detail** (`/<slug>`)
- Left sidebar: lifecycle progress bar + ContentOS step status
- Center: content pipeline (existing IDEAS / DRAFTS / BANK / PUBLISHED views)
- Right sidebar: assigned people + engine override summary

**Onboarding** (`/onboard` or wizard on `/new`)
- URL input(s): website (required), GitHub KB (optional)
- AI analysis preview: product name, tagline, audience, competitors
- Confirmation step: founder edits/corrects each field
- Submit → product created in `onboarding` state → auto-transitions to `strategy`

**Pool Manager** (`/pool`)
- Table: people, role, channels, current workload, assigned products
- Drag-to-reassign for agent assignments
- Highlight channels with zero coverage (staffing gaps)

## Layer 5: Database Schema

PostgreSQL on Railway.

### Tables

```sql
-- Workspaces (formerly projects/)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  lifecycle_state TEXT NOT NULL DEFAULT 'onboarding',
  -- onboarding
  urls JSONB DEFAULT '{}',        -- {website, github_kb}
  project_config JSONB DEFAULT '{}', -- the full project.yaml as JSONB
  engine_overrides JSONB DEFAULT '{}',
  -- timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Strategy docs (one row per doc per version)
CREATE TABLE strategy_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id),
  step_key TEXT NOT NULL,  -- 01-market-insight, etc.
  version INT NOT NULL DEFAULT 1,
  content TEXT NOT NULL,
  usage JSONB,             -- LLM token usage
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ContentOS state (per workspace, mutable)
CREATE TABLE contentos_states (
  workspace_id UUID PRIMARY KEY REFERENCES workspaces(id),
  current_step INT DEFAULT 0,
  steps JSONB DEFAULT '{}',
  last_updated TIMESTAMPTZ
);

-- People (shared pool)
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,          -- builder | reviewer
  channels JSONB DEFAULT '[]',
  max_workload INT DEFAULT 3,
  active BOOLEAN DEFAULT true
);

-- Agent instances (per product per channel)
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id),
  channel TEXT NOT NULL,       -- reddit, blog, kol, video, etc.
  status TEXT DEFAULT 'active',
  config JSONB DEFAULT '{}',  -- agent.yaml as JSONB
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Agent-to-people assignments
CREATE TABLE agent_assignments (
  agent_id UUID REFERENCES agents(id),
  person_id UUID REFERENCES people(id),
  role TEXT NOT NULL,           -- builder | reviewer
  PRIMARY KEY (agent_id, role)
);

-- Content items (pipeline)
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id),
  agent_id UUID REFERENCES agents(id),
  state TEXT NOT NULL DEFAULT 'new-idea',  -- new-idea | draft | bank | published
  frontmatter JSONB DEFAULT '{}',
  body TEXT DEFAULT '',
  mtime TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Engine files
CREATE TABLE engines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id),  -- NULL = base skeleton
  file_path TEXT NOT NULL,
  content TEXT DEFAULT '',
  UNIQUE (workspace_id, file_path)
);

-- Audit log
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id),
  actor TEXT,
  action TEXT,
  detail JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_content_items_workspace_state ON content_items(workspace_id, state);
CREATE INDEX idx_agents_workspace ON agents(workspace_id);
CREATE INDEX idx_engines_lookup ON engines(workspace_id, file_path);
CREATE INDEX idx_audit_log_workspace ON audit_log(workspace_id, created_at DESC);
```

### Migration from file-based

One-time script: read all `projects/*/project.yaml`, `projects/*/agents/*/agent.yaml`, `projects/*/strategy/*.md`, `projects/*/agents/*/content-bank/**/*.md` → INSERT into corresponding tables. `_registry.json` → merged into `workspaces.project_config`.

## Layer 6: API Changes

### New endpoints

```
POST   /api/workspaces              # create workspace (onboarding submit)
PATCH  /api/workspaces/:slug        # update workspace config/state
GET    /api/workspaces/:slug        # full workspace detail
GET    /api/workspaces              # list all workspaces (dashboard home)

POST   /api/onboarding/analyze      # submit URL(s) → AI analysis preview
GET    /api/onboarding/analysis/:id # fetch analysis result

GET    /api/pool                    # list all people + their assignments
POST   /api/pool                    # add person
PATCH  /api/pool/:id                # update person (channels, workload)
POST   /api/assignments             # assign/reassign person to agent

GET    /api/engines/:ws/file/*path  # read engine file (with inheritance)
PUT    /api/engines/:ws/file/*path  # write/edit engine file
```

### Changed endpoints

Existing `/api/projects`, `/api/agents`, `/api/content`, `/api/contentos/:slug/*` → adapt to read from PostgreSQL instead of filesystem.

## Scope Boundaries

**In scope for v1:**
- PostgreSQL migration (all data)
- Product lifecycle state machine
- Onboarding wizard (URL input + AI analysis + confirmation)
- Shared human pool with auto-assignment
- Engine inheritance (base skeleton + product overrides)
- Multi-product dashboard home page
- Adapted existing API endpoints

**Out of scope for v1:**
- SaaS multi-tenancy (workspaces isolation, billing, user auth)
- Template marketplace for engines
- External API tokens / webhooks
