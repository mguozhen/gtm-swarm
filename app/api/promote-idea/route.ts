import { NextRequest, NextResponse } from 'next/server'
import { existsSync, readFileSync, mkdirSync, renameSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { PROJECTS_DIR } from '@/lib/fs-api'
import { hasAnthropic } from '@/server/llm.js'
import { runAgent } from '@/server/runner.js'
import { hasMultica } from '@/server/multica-db.js'
import { MULTICA_WORKSPACE_SLUG } from '@/lib/constants'

function agentBrief(channel: string, topic: string, angle: string, hook: string): string {
  const lines = [`Topic: ${topic}`]
  if (angle) lines.push(`Angle: ${angle}`)
  if (hook) lines.push(`Hook: ${hook}`)
  lines.push(`\nYour task: plan and execute ${channel} content for this topic. Break it down your own way.`)
  return lines.join('\n')
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { project, idea_id, agent } = body
  if (!project || !idea_id) {
    return NextResponse.json({ error: 'project and idea_id are required' }, { status: 400 })
  }

  if (hasMultica()) {
    const {
      getIssue, updateIssueStatus, getWorkspaceBySlug,
      getWorkspaceAgents, createIssue, getOrCreateGTMUser,
    } = await import('@/server/multica-db.js')

    const issue = await getIssue(idea_id)
    if (!issue) return NextResponse.json({ error: 'idea not found' }, { status: 404 })

    const topic = issue.title || ''
    if (!topic) return NextResponse.json({ error: 'no topic in idea' }, { status: 400 })

    // Parse angle/hook from description if present
    const descLines: string[] = (issue.description || '').split('\n')
    const angle = descLines.find((l: string) => l.startsWith('**Angle**:'))?.replace('**Angle**:', '').trim() || ''
    const hook = descLines.find((l: string) => l.startsWith('**Hook seed**:'))?.replace('**Hook seed**:', '').trim() || ''

    const ws = await getWorkspaceBySlug(MULTICA_WORKSPACE_SLUG)
    if (!ws) return NextResponse.json({ error: 'gtm workspace not found in Multica' }, { status: 404 })

    const agents = await getWorkspaceAgents(MULTICA_WORKSPACE_SLUG)
    if (!agents.length) return NextResponse.json({ error: 'no agents in workspace' }, { status: 503 })

    const creatorId = await getOrCreateGTMUser()
    await updateIssueStatus(idea_id, 'in_progress')

    const notified: { agent: string; channel: string; issue_id: string }[] = []
    for (const agent of agents) {
      const description = agentBrief(agent.channel, topic, angle, hook)
      const issueId = await createIssue(ws.id, {
        title: `[${agent.channel}] ${topic}`,
        description,
        status: 'in_progress',
        creatorId,
        parentId: idea_id,
        assigneeId: agent.id,
      })
      notified.push({ agent: agent.name, channel: agent.channel, issue_id: issueId })
    }

    return NextResponse.json({ ok: true, topic, agents_notified: notified })
  }

  // Filesystem mode (no Multica) — unchanged
  if (!agent) return NextResponse.json({ error: 'project + agent + idea_id required' }, { status: 400 })
  if (!hasAnthropic()) return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 503 })
  const ideaFile = path.join(PROJECTS_DIR, project, 'agents', agent, 'content-bank', 'new-idea', `${idea_id}.md`)
  if (!existsSync(ideaFile)) return NextResponse.json({ error: 'idea not found' }, { status: 404 })
  let topic = ''
  try { topic = matter(readFileSync(ideaFile, 'utf-8')).data.topic || '' } catch {}
  if (!topic) return NextResponse.json({ error: 'no topic in idea frontmatter' }, { status: 400 })
  const promotedDir = path.join(PROJECTS_DIR, project, 'agents', agent, 'content-bank', '.promoted')
  mkdirSync(promotedDir, { recursive: true })
  renameSync(ideaFile, path.join(promotedDir, `${idea_id}.md`))
  try {
    const out = await runAgent(agent, { project, topic } as Parameters<typeof runAgent>[1])
    return NextResponse.json({ ok: true, topic, ...out })
  } catch (e: unknown) {
    return NextResponse.json({ error: String((e as Error)?.message || e), topic }, { status: 500 })
  }
}
