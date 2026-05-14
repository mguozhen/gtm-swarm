import { NextResponse } from 'next/server'
import { listProjects, readRegistry } from '@/lib/fs-api'
import { hasDB } from '@/server/db.js'
import * as store from '@/server/store.js'
import { hasMultica } from '@/server/multica-db.js'

export async function GET() {
  if (hasMultica()) {
    const { listAllWorkspaces } = await import('@/server/multica-db.js')
    const workspaces = await listAllWorkspaces()
    const projects = Object.fromEntries(workspaces.map((w: { slug: string; name: string }) => [
      w.slug, { slug: w.slug, name: w.name, url: '', category: '', tagline: '', status: 'active' }
    ]))
    return NextResponse.json({ registry: { projects, default: workspaces[0]?.slug }, discovered: workspaces.map((w: { slug: string }) => w.slug) })
  }
  if (hasDB()) {
    const rows = await store.listWorkspaces()
    const projects = Object.fromEntries(rows.map((ws: { slug: string; name: string }) => [
      ws.slug, { slug: ws.slug, name: ws.name, url: '', category: '', tagline: '', status: 'active' }
    ]))
    return NextResponse.json({ registry: { projects, default: rows[0]?.slug }, discovered: rows.map((ws: { slug: string }) => ws.slug) })
  }
  return NextResponse.json({ registry: readRegistry(), discovered: listProjects() })
}
