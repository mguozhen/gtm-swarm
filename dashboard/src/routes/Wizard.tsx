import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import MDEditor from '@uiw/react-md-editor'
import { useToken, authHeaders } from '../hooks/useToken'
import './Wizard.css'

type StepKey = '01-market-insight' | '02-user-insight' | '03-competitor-analysis' | '04-content-strategy'
type StepInfo = {
  status: 'pending' | 'running' | 'done'
  output_file?: string
  size?: number
  started_at?: string
  completed_at?: string
}

const STEPS: { n: 1 | 2 | 3 | 4; key: StepKey; label: string; sub: string }[] = [
  { n: 1, key: '01-market-insight',      label: 'Market Insight',       sub: 'TAM · SAM · SOM · trends · timing' },
  { n: 2, key: '02-user-insight',        label: 'User Insight',         sub: 'ICP · pain · triggers · vocab' },
  { n: 3, key: '03-competitor-analysis', label: 'Competitor Analysis',  sub: 'Top 5 · positioning · gap · risks' },
  { n: 4, key: '04-content-strategy',    label: 'Content Strategy',     sub: 'Pillars · channels · 11-agent YAML' },
]

function fmtDuration(ms: number) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  return `${m}:${String(s % 60).padStart(2, '0')}`
}

function stepDurationMs(info?: StepInfo) {
  if (!info?.started_at || !info?.completed_at) return null
  return new Date(info.completed_at).getTime() - new Date(info.started_at).getTime()
}

type CIAStatus = { phase: string; done: boolean; log: string[]; error?: string }

export default function Wizard() {
  const { slug } = useParams<{ slug: string }>()
  const [state, setState] = useState<Record<StepKey, StepInfo>>({} as Record<StepKey, StepInfo>)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState<'idle' | 'running' | 'saving' | 'building'>('idle')
  const [editing, setEditing] = useState(false)
  const [building, setBuilding] = useState<{ output?: string; done?: boolean } | null>(null)
  const [elapsedMs, setElapsedMs] = useState(0)
  const runStartedAtRef = useRef<number | null>(null)
  const [token] = useToken()
  const [cia, setCia] = useState<CIAStatus | null>(null)
  const [ciaSkipped, setCiaSkipped] = useState(false)
  const ciaPollerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const pollCIA = useCallback(() => {
    if (!slug) return
    fetch(`/api/cia/status/${slug}`).then(r => r.json()).then(d => {
      setCia(d)
      if (d.done && ciaPollerRef.current) {
        clearInterval(ciaPollerRef.current)
        ciaPollerRef.current = null
      }
    }).catch(() => {})
  }, [slug])

  useEffect(() => {
    pollCIA()
  }, [pollCIA])

  const triggerCIA = async () => {
    if (!slug) return
    // Get product name from slug (best effort)
    const name = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    await fetch('/api/cia/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug }),
    })
    pollCIA()
    // Start polling
    if (ciaPollerRef.current) clearInterval(ciaPollerRef.current)
    ciaPollerRef.current = setInterval(pollCIA, 3000)
  }

  // Auto-poll if CIA is running
  useEffect(() => {
    if (cia && !cia.done && cia.phase !== 'idle') {
      if (!ciaPollerRef.current) {
        ciaPollerRef.current = setInterval(pollCIA, 3000)
      }
    }
    return () => {
      if (ciaPollerRef.current) clearInterval(ciaPollerRef.current)
    }
  }, [cia?.phase, cia?.done])

  const refreshState = useCallback(async () => {
    if (!slug) return
    const r = await fetch(`/api/contentos/${slug}/state`).then(r => r.json())
    setState(r.state.steps || {})
    const cur = r.state.current_step || 0
    const next = Math.min(4, cur + 1) as 1 | 2 | 3 | 4
    if (cur >= 4) setCurrentStep(4)
    else setCurrentStep(next)
  }, [slug])

  const loadStep = useCallback(async (step: 1 | 2 | 3 | 4) => {
    if (!slug) return
    const r = await fetch(`/api/contentos/${slug}/strategy?step=${step}`).then(r => r.json())
    setContent(r.content || '')
    setCurrentStep(step)
    setEditing(false)
  }, [slug])

  useEffect(() => { refreshState() }, [refreshState])
  useEffect(() => { loadStep(currentStep) }, [currentStep, loadStep])

  useEffect(() => {
    if (loading !== 'running') { setElapsedMs(0); runStartedAtRef.current = null; return }
    runStartedAtRef.current = Date.now()
    const id = setInterval(() => {
      if (runStartedAtRef.current) setElapsedMs(Date.now() - runStartedAtRef.current)
    }, 250)
    return () => clearInterval(id)
  }, [loading])

  const runStep = async (step: 1 | 2 | 3 | 4) => {
    if (!slug) return
    setLoading('running')
    setCurrentStep(step)
    const r = await fetch(`/api/contentos/${slug}/run-step?step=${step}`, {
      method: 'POST', headers: { ...authHeaders(token) },
    }).then(r => r.json())
    setLoading('idle')
    if (r.error) {
      alert('Step run failed:\n' + r.error + (String(r.error).includes('Bearer') ? '\n\n→ Click 🔒 Sign in (top bar of Home / Dashboard).' : ''))
      return
    }
    await refreshState()
    await loadStep(step)
  }

  const saveEdit = async () => {
    if (!slug) return
    setLoading('saving')
    await fetch(`/api/contentos/${slug}/save-edit?step=${currentStep}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
      body: JSON.stringify({ content }),
    })
    setLoading('idle')
    setEditing(false)
  }

  const build = async () => {
    if (!slug) return
    setLoading('building')
    setBuilding({ output: 'Hydrating 11 agents...' })
    const r = await fetch(`/api/contentos/${slug}/build`, {
      method: 'POST', headers: { ...authHeaders(token) },
    }).then(r => r.json())
    setLoading('idle')
    if (r.error) {
      setBuilding({ output: 'Build failed:\n' + r.error, done: false })
      return
    }
    setBuilding({ output: `✓ Hydrated ${(r.updated || []).length} agents.`, done: true })
  }

  const doneCount = STEPS.filter(s => state[s.key]?.status === 'done').length
  const allDone = doneCount === 4
  const stepInfo = state[STEPS[currentStep - 1].key]
  const stepDone = stepInfo?.status === 'done'
  const durations = STEPS.map(s => stepDurationMs(state[s.key])).filter((d): d is number => d !== null)
  const totalElapsedMs = durations.reduce((a, b) => a + b, 0)

  if (building?.done) {
    return (
      <div className="wizard wizard-success">
        <div className="success-burst">
          <div className="success-checkmark">✓</div>
          <h1>11 GTM Agents Initialized</h1>
          <p className="success-sub">{slug} swarm is ready to run.</p>
          <pre className="success-log">{building.output}</pre>
          <div className="success-actions">
            <Link to={`/dashboard/${slug}`} className="btn btn-primary">Open Control Panel →</Link>
            <Link to="/" className="btn btn-ghost">Back to projects</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wizard">
      <header className="wizard-header">
        <Link to="/" className="wizard-back">← projects</Link>
        <div className="wizard-title">
          <span className="wt-label">DISCOVERY</span>
          <h1>{slug}</h1>
          <span className="wt-progress">
            <span className="wt-pcount">{doneCount}/4</span>
            <span className="wt-pdots">
              {STEPS.map(s => (
                <span key={s.n} className={`wt-pdot wt-pdot-${state[s.key]?.status || 'pending'}`} />
              ))}
            </span>
          </span>
        </div>
        <div className="wizard-meta">
          {allDone ? '✓ Ready to build' : `Step ${currentStep} of 4`}
          {totalElapsedMs > 0 && <span className="wt-elapsed"> · {fmtDuration(totalElapsedMs)} total</span>}
          <Link to={`/dashboard/${slug}`} className="btn btn-ghost" style={{ fontSize: 12, marginLeft: 12 }}>跳过 →</Link>
        </div>
      </header>

      <div className="wizard-grid">
        <aside className="wizard-rail">
          {STEPS.map(s => {
            const info = state[s.key]
            const status = info?.status || 'pending'
            const isActive = currentStep === s.n
            const dur = stepDurationMs(info)
            return (
              <button
                key={s.n}
                className={`rail-step rail-step-${status} ${isActive ? 'is-active' : ''}`}
                onClick={() => setCurrentStep(s.n)}
              >
                <span className="rs-num">{status === 'done' ? '✓' : status === 'running' ? '⟳' : s.n}</span>
                <span className="rs-text">
                  <span className="rs-label">{s.label}</span>
                  <span className="rs-sub">{s.sub}</span>
                  {dur !== null && <span className="rs-dur">{fmtDuration(dur)}</span>}
                  {info?.size && <span className="rs-size">{(info.size / 1024).toFixed(1)}KB</span>}
                </span>
              </button>
            )
          })}

          {allDone && (
            <button className="rail-build-btn" onClick={build} disabled={loading === 'building'}>
              {loading === 'building' ? '⟳ Building…' : '⚡ Build 11 Agents'}
            </button>
          )}

          {/* CIA Analysis panel */}
          {!ciaSkipped && <div style={{ marginTop: 16, padding: '12px', background: '#0f172a', borderRadius: 8, border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '.08em' }}>CIA 市场分析</div>
              <button onClick={() => setCiaSkipped(true)} style={{ fontSize: 11, color: '#4b5563', background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px' }}>跳过</button>
            </div>
            {(!cia || cia.phase === 'idle') && (
              <button className="btn btn-ghost" style={{ width: '100%', fontSize: 12 }} onClick={triggerCIA}>
                🔍 触发 CIA 分析
              </button>
            )}
            {cia && !cia.done && cia.phase !== 'idle' && (
              <div>
                <div style={{ fontSize: 12, color: '#f59e0b', marginBottom: 6 }}>⟳ {cia.phase}…</div>
                <div style={{ fontSize: 10, color: '#4b5563', maxHeight: 80, overflow: 'hidden', fontFamily: 'monospace', lineHeight: 1.4 }}>
                  {cia.log.slice(-4).join('\n')}
                </div>
              </div>
            )}
            {cia?.done && !cia.error && (
              <div style={{ fontSize: 12, color: '#10b981' }}>
                ✓ 分析完成 · project.yaml 已更新
                <button className="btn btn-ghost" style={{ display: 'block', width: '100%', fontSize: 11, marginTop: 6 }} onClick={triggerCIA}>
                  重新分析
                </button>
              </div>
            )}
            {cia?.error && (
              <div>
                <div style={{ fontSize: 11, color: '#ef4444', marginBottom: 4 }}>✗ {cia.error.slice(0, 60)}</div>
                <button className="btn btn-ghost" style={{ width: '100%', fontSize: 11 }} onClick={triggerCIA}>
                  重试
                </button>
              </div>
            )}
          </div>}
        </aside>

        <main className="wizard-main">
          {!stepDone && loading !== 'running' && (
            <div className="step-empty">
              <div className="empty-icon">▱▱▱▱</div>
              <h2>Step {currentStep}: {STEPS[currentStep - 1].label}</h2>
              <p>{STEPS[currentStep - 1].sub}</p>
              <button className="btn btn-primary" onClick={() => runStep(currentStep)}>
                Run ContentOS Agent →
              </button>
            </div>
          )}

          {loading === 'running' && (
            <div className="step-running">
              <div className="running-spinner">⟳</div>
              <h2>ContentOS Agent thinking...</h2>
              <p>Step {currentStep}: {STEPS[currentStep - 1].label}</p>
              <div className="running-elapsed">⏱ {fmtDuration(elapsedMs)}</div>
              <div className="running-hint">claude --print is assembling 40KB+ context. Usually 2-3 min.</div>
              <div className="running-bar">
                <div className="running-bar-fill" style={{ width: `${Math.min(95, elapsedMs / 1800)}%` }} />
              </div>
            </div>
          )}

          {stepDone && content && (
            <div className="step-done">
              <div className="step-toolbar">
                <div className="st-info">
                  <span className="st-size">{(content.length / 1024).toFixed(1)}KB</span>
                  <span className="st-status">✓ done</span>
                </div>
                <div className="st-actions">
                  {!editing ? (
                    <>
                      <button className="btn btn-ghost" onClick={() => setEditing(true)}>✏️ Edit</button>
                      {currentStep < 4 ? (
                        <button className="btn btn-primary" onClick={() => runStep((currentStep + 1) as 2 | 3 | 4)} disabled={loading !== 'idle'}>
                          Approve & Run Step {currentStep + 1} →
                        </button>
                      ) : (
                        <button className="btn btn-primary" onClick={build} disabled={loading !== 'idle'}>
                          ⚡ Build 11 Agents
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button className="btn btn-ghost" onClick={() => { setEditing(false); loadStep(currentStep) }}>Cancel</button>
                      <button className="btn btn-primary" onClick={saveEdit} disabled={loading === 'saving'}>
                        {loading === 'saving' ? 'Saving…' : '💾 Save Edit'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="step-content" data-color-mode="dark">
                {editing ? (
                  <MDEditor value={content} onChange={v => setContent(v || '')} height={700} preview="edit" />
                ) : (
                  <MDEditor.Markdown source={content} style={{ background: 'transparent' }} />
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
