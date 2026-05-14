import { NextRequest, NextResponse } from 'next/server'
import { getCIAStatus } from '@/server/cia.js'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const status = getCIAStatus(slug)
  if (!status) return NextResponse.json({ phase: 'idle', done: false, log: [] })
  return NextResponse.json(status)
}
