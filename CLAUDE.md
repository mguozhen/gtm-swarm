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
- **Only workspace `slug = 'gtm'` is used. Ignore all other workspaces.** workspace_id `95c76175-b7d0-4031-ae1e-51a1f2c895e9`
- Never query by any other workspace slug (voc-ai, solvea, flatkey, etc.) — always hardcode or resolve to `'gtm'`

### Priority in API routes
Agents data comes **exclusively from Multica**. No GTM DB fallback for agents — if `MULTICA_DATABASE_URL` is not set, return 503.

## Key Conventions

- `/api/projects` — lists workspaces from DB only, no filesystem fallback
- `/api/agents` — **multica only**, no GTM DB fallback; queries by project slug first, then falls back to `'gtm'` workspace; returns 503 if multica not configured
- `/api/workspaces/[slug]` — agents always fetched from multica `'gtm'` workspace when multica is available
- `/api/content` — **multica only** when `MULTICA_DATABASE_URL` is set; reads Issues from Multica DB exclusively; no GTM DB content_items, no filesystem fallback

## Agent Config — Multica is Source of Truth

**Never create or rely on local `agent.yaml` files.** Agent configuration (name, platform, reviewer, builder, goal, status) lives exclusively in the Multica database.

- Do NOT add `agent.yaml` to any `projects/*/agents/*/` directory
- Do NOT read `agent.yaml` in any code path when Multica is configured (`hasMultica()`)
- Do NOT create engine symlinks or local filesystem stubs to work around missing agent config
- When `hasMultica()` is true, all agent metadata must be fetched from Multica and passed directly to runner/LLM logic
- **All content lists (Ideas / Drafts / Review / Bank / Published) read exclusively from Multica Issues** — never from GTM DB `content_items` or filesystem; GTM DB is not used for content reads

## Idea → GTM 落地流程

```
[用户] 在 Ideas Tab 填写 topic / angle / hook
  ↓ POST /api/create-idea
[Multica] 创建 issue（status=backlog），number 自动递增

[用户] 点击 Promote
  ↓ POST /api/promote-idea { project, idea_id }
[系统]
  1. 从 Multica 读取该 idea（title + description 里的 angle/hook）
  2. 从 Multica 读取 workspace 下所有 agents
  3. 为每个 agent 创建一条子 issue（parentId = idea_id），内容：
       - title: [channel] <topic>
       - description: topic + angle + hook + "your channel, your call"
       - status: backlog，assignee = 该 agent
  4. 将原 idea issue 状态改为 in_progress
  → 返回 { agents_notified: [{agent, channel, issue_id}] }

[各 Agent] 收到各自的子 issue，自行拆解执行
  ↓ agent 完成内容生成后
[GTM DB] 写入 content_items（state=draft）
  ↓ Reviewer 审核
[GTM DB] 更新 state: draft → bank → published
```

**关键约束：**
- `promote-idea` 不调 LLM，不生成内容，只做任务分发
- 每个 agent 的子 issue 是独立的执行单元，agent 自己决定怎么拆解
- 子 issue 通过 `parentId` 挂在原 idea 下，保持追溯链路
