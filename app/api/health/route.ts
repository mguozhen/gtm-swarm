import { NextResponse } from 'next/server'
import { hasAnthropic } from '@/server/llm.js'
import { listProjects } from '@/lib/fs-api'

export async function GET() {
  return NextResponse.json({ ok: true, anthropic: hasAnthropic(), projects: listProjects() })
}
