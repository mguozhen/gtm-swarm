import { NextRequest, NextResponse } from 'next/server'
import { runCIAAnalysis } from '@/server/cia.js'

export async function POST(request: NextRequest) {
  const { name, slug } = await request.json()
  if (!name || !slug) return NextResponse.json({ error: 'name and slug required' }, { status: 400 })
  if (!process.env.CIA_HUB_TOKEN) return NextResponse.json({ error: 'CIA_HUB_TOKEN not configured' }, { status: 503 })
  try {
    const result = await runCIAAnalysis(name, slug)
    return NextResponse.json(result)
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
