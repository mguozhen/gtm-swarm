import { NextRequest, NextResponse } from 'next/server'
import { existsSync, readFileSync, mkdirSync, renameSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { PROJECTS_DIR } from '@/lib/fs-api'
import { hasAnthropic } from '@/server/llm.js'
import { runAgent } from '@/server/runner.js'
import { hasMultica } from '@/server/multica-db.js'

export async function POST(request: NextRequest) {
  const { project, agent, idea_id } = await request.json()
  if (!project || !agent || !idea_id) {
    return NextResponse.json({ error: 'project + agent + idea_id required' }, { status: 400 })
  }

  if (hasMultica()) {
    if (!hasAnthropic()) return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 503 })
    const { getIssue, updateIssueStatus } = await import('@/server/multica-db.js')
    const issue = await getIssue(idea_id)
    if (!issue) return NextResponse.json({ error: 'idea not found' }, { status: 404 })
    const topic = issue.title || ''
    if (!topic) return NextResponse.json({ error: 'no topic in idea' }, { status: 400 })
    await updateIssueStatus(idea_id, 'in_progress')
    try {
      const out = await runAgent(agent, { project, topic })
      return NextResponse.json({ ok: true, topic, ...out })
    } catch (e: unknown) {
      return NextResponse.json({ error: String((e as Error)?.message || e), topic }, { status: 500 })
    }
  }

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
    const out = await runAgent(agent, { project, topic })
    return NextResponse.json({ ok: true, topic, ...out })
  } catch (e: unknown) {
    return NextResponse.json({ error: String((e as Error)?.message || e), topic }, { status: 500 })
  }
}
