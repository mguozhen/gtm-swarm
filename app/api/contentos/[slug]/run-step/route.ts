import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { REPO_ROOT } from '@/lib/fs-api'

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const step = request.nextUrl.searchParams.get('step')
  if (!step || !['1','2','3','4'].includes(step)) {
    return NextResponse.json({ error: 'step 1..4 required' }, { status: 400 })
  }
  return new Promise<NextResponse>(resolve => {
    const child = spawn('python3',
      [path.join(REPO_ROOT, 'scripts/contentos-agent.py'), '--project', slug, '--step', step],
      { cwd: REPO_ROOT, env: process.env })
    let out = '', err = ''
    child.stdout.on('data', (d: Buffer) => out += d.toString())
    child.stderr.on('data', (d: Buffer) => err += d.toString())
    child.on('close', (code: number) => {
      resolve(NextResponse.json({ code, stdout: out, stderr: err }, { status: code === 0 ? 200 : 500 }))
    })
    request.signal.addEventListener('abort', () => child.kill('SIGTERM'))
  })
}
