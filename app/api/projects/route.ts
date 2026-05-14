import { NextResponse } from 'next/server'
import { hasDB } from '@/server/db.js'
import * as store from '@/server/store.js'
import { hasMultica } from '@/server/multica-db.js'

export async function GET() {
  if (hasMultica()) {
    // Always expose only the 'gtm' workspace — multica holds many workspaces but this app is gtm-only.
    const { getWorkspaceBySlug } = await import('@/server/multica-db.js')
    const ws = await getWorkspaceBySlug('gtm')
    const entry = ws ? { slug: ws.slug, name: ws.name, url: '', category: '', tagline: '', status: 'active' } : null
    const projects = entry ? { gtm: entry } : {}
    return NextResponse.json({ registry: { projects, default: 'gtm' }, discovered: entry ? ['gtm'] : [] })
  }
  if (hasDB()) {
    const rows = await store.listWorkspaces()
    const projects = Object.fromEntries(rows.map((ws: { slug: string; name: string }) => [
      ws.slug, { slug: ws.slug, name: ws.name, url: '', category: '', tagline: '', status: 'active' }
    ]))
    return NextResponse.json({ registry: { projects, default: rows[0]?.slug }, discovered: rows.map((ws: { slug: string }) => ws.slug) })
  }
  return NextResponse.json({ registry: { projects: {}, default: null }, discovered: [] })
}
