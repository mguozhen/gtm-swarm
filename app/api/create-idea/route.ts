import { NextRequest, NextResponse } from 'next/server'
import { hasMultica } from '@/server/multica-db.js'
import { MULTICA_WORKSPACE_SLUG } from '@/lib/constants'

export async function POST(request: NextRequest) {
  const { project, topic, angle, hook } = await request.json()
  if (!project || !topic) {
    return NextResponse.json({ error: 'project and topic are required' }, { status: 400 })
  }
  if (!hasMultica()) return NextResponse.json({ error: 'No database configured' }, { status: 503 })
  try {
    const { getWorkspaceBySlug, getOrCreateGTMUser, createIssue } = await import('@/server/multica-db.js')
    const ws = await getWorkspaceBySlug(MULTICA_WORKSPACE_SLUG)
    if (!ws) return NextResponse.json({ error: `workspace "${project}" not found` }, { status: 404 })
    const creatorId = await getOrCreateGTMUser()
    const parts: string[] = []
    if (angle) parts.push(`**Angle**: ${angle}`)
    if (hook) parts.push(`**Hook seed**: ${hook}`)
    const description = parts.join('\n\n')
    const id = await createIssue(ws.id, { title: topic, description, status: 'backlog', creatorId })
    return NextResponse.json({ ok: true, id })
  } catch (e: unknown) {
    return NextResponse.json({ error: String((e as Error)?.message || e) }, { status: 500 })
  }
}
