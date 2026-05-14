import { NextRequest, NextResponse } from 'next/server'
import { hasDB } from '@/server/db.js'
import { getWorkspace, saveWorkspaceCIAResult } from '@/server/store.js'

export async function POST(request: NextRequest) {
  // Auth
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  if (!process.env.CIA_HUB_TOKEN || token !== process.env.CIA_HUB_TOKEN) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  if (!hasDB()) return NextResponse.json({ error: 'GTM_DATABASE required' }, { status: 503 })

  const body = await request.json().catch(() => null)
  if (!body?.slug || !body?.synthesis) {
    return NextResponse.json({ error: 'slug and synthesis required' }, { status: 400 })
  }

  const ws = await getWorkspace(body.slug)
  if (!ws) return NextResponse.json({ error: 'workspace not found' }, { status: 404 })

  const result = {
    ...body.synthesis,
    analyzed_at: body.analyzed_at || new Date().toISOString(),
  }
  await saveWorkspaceCIAResult(body.slug, result)

  return NextResponse.json({ ok: true })
}
