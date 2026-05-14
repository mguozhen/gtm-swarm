import { NextRequest, NextResponse } from 'next/server'
import { hasDB } from '@/server/db.js'
import * as store from '@/server/store.js'
import { hasMultica } from '@/server/multica-db.js'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    // Project data always comes from GTM DB.
    if (!hasDB()) return NextResponse.json({ error: 'GTM_DATABASE required' }, { status: 503 })
    const ws = await store.getWorkspace(slug)
    if (!ws) return NextResponse.json({ error: 'not found' }, { status: 404 })
    const cosState = await store.getContentOSState(ws.id)

    // Agents come from multica; fall back to GTM DB if multica not configured.
    let agents
    if (hasMultica()) {
      const { getWorkspaceAgents } = await import('@/server/multica-db.js')
      agents = await getWorkspaceAgents(slug)
      if (agents.length === 0) agents = await getWorkspaceAgents('gtm')
    } else {
      agents = await store.listAgentsForWorkspace(ws.id)
    }
    return NextResponse.json({ ...ws, contentos_state: cosState, agents })
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!hasDB()) return NextResponse.json({ error: 'DATABASE_URL required' }, { status: 503 })
  try {
    const body = await request.json()
    const ws = await store.updateWorkspace(slug, body)
    if (!ws) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json(ws)
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
