# gtm-swarm

## Database Configuration

Two separate databases. Never mix them up.

### GTM Database (`GTM_DATABASE`)
- The app's own PostgreSQL database
- Used by `server/db.js` (`hasDB()` checks `GTM_DATABASE`)
- Used by `server/store.js` (workspaces, agents, content items, etc.)
- Used by `server/bootstrap.js` for migrations

### Multica Database (`MULTICA_DATABASE_URL`)
- External Multica project management database
- Used **only** by `server/multica-db.js` (`hasMultica()` checks `MULTICA_DATABASE_URL`)
- Contains workspaces, agents, issues from Multica's schema
- Multica workspace slug is **`'gtm'`** (lowercase), workspace_id `95c76175-b7d0-4031-ae1e-51a1f2c895e9`

### Priority in API routes
Agents data comes **exclusively from Multica**. No GTM DB fallback for agents — if `MULTICA_DATABASE_URL` is not set, return 503.

## Key Conventions

- `/api/projects` — lists workspaces from DB only, no filesystem fallback
- `/api/agents` — **multica only**, no GTM DB fallback; queries by project slug first, then falls back to `'gtm'` workspace; returns 503 if multica not configured
- `/api/workspaces/[slug]` — agents always fetched from multica `'gtm'` workspace when multica is available

## Agent Config — Multica is Source of Truth

**Never create or rely on local `agent.yaml` files.** Agent configuration (name, platform, reviewer, builder, goal, status) lives exclusively in the Multica database.

- Do NOT add `agent.yaml` to any `projects/*/agents/*/` directory
- Do NOT read `agent.yaml` in any code path when Multica is configured (`hasMultica()`)
- Do NOT create engine symlinks or local filesystem stubs to work around missing agent config
- When `hasMultica()` is true, all agent metadata must be fetched from Multica and passed directly to runner/LLM logic — the filesystem agent directory is only used for content output (drafts, bank, published files)
