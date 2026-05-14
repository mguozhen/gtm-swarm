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
When both DBs are available, multica takes precedence over GTM DB (checked first).

## Key Conventions

- `/api/projects` — lists workspaces from DB only, no filesystem fallback
- `/api/agents` — reads agents from DB only (multica → `'gtm'` workspace; gtm-db → by project slug), no filesystem fallback
- `/api/workspaces/[slug]` — agents always fetched from multica `'gtm'` workspace when multica is available
