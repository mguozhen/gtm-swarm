import { useEffect, useState } from 'react'
import './Ledger.css'

type AgentRow = {
  id: string
  name: string
  platform: string
  category: string
  builder: string | null
  reviewer: string | null
  status: string
  activate: boolean
  goal: string
  ironTriangleOK: boolean
  window: {
    new_ideas: number
    claimed: number
    drafts: number
    bank: number
    published: number
    rejected: number
  }
  pending_review: number
  total_published: number
  total_bank: number
  recent_topics: string[]
  anti_patterns_snippet: string
}

type LedgerData = {
  project: string
  window_hours: number
  generated_at: string
  totals: { freshIdeas: number; freshDrafts: number; freshBank: number; freshPublished: number; pendingReview: number }
  agents: AgentRow[]
}

export function Ledger({ slug }: { slug: string }) {
  const [data, setData] = useState<LedgerData | null>(null)
  const [windowH, setWindowH] = useState(168)
  const [expanded, setExpanded] = useState<string>('')
  const [err, setErr] = useState('')

  useEffect(() => {
    setErr('')
    setData(null)
    fetch(`/api/ledger?project=${slug}&window_hours=${windowH}`)
      .then(r => r.json())
      .then(d => { if (d.error) setErr(d.error); else setData(d) })
      .catch(e => setErr(String(e)))
  }, [slug, windowH])

  if (err) return <div className="ledger-err">Error loading ledger: {err}</div>
  if (!data) return <div className="ledger-loading">Loading swarm ledger…</div>

  const windowLabel = windowH === 24 ? '24h' : windowH === 168 ? '7d' : windowH === 720 ? '30d' : `${windowH}h`

  return (
    <div className="ledger">
      <div className="ledger-header">
        <div className="ledger-title">
          <span>📒 Swarm Ledger — {data.project}</span>
          <span className="ledger-meta">window: {windowLabel}  ·  generated {new Date(data.generated_at).toLocaleString()}</span>
        </div>
        <div className="ledger-window-toggle">
          {[24, 168, 720].map(h => (
            <button
              key={h}
              className={windowH === h ? 'is-active' : ''}
              onClick={() => setWindowH(h)}
            >{h === 24 ? '24h' : h === 168 ? '7d' : '30d'}</button>
          ))}
        </div>
      </div>

      <div className="ledger-totals">
        <div className="ledger-stat"><span className="ledger-stat-n">{data.totals.freshIdeas}</span><span className="ledger-stat-l">new ideas</span></div>
        <div className="ledger-stat"><span className="ledger-stat-n">{data.totals.freshDrafts}</span><span className="ledger-stat-l">drafts</span></div>
        <div className="ledger-stat"><span className="ledger-stat-n">{data.totals.freshBank}</span><span className="ledger-stat-l">approved</span></div>
        <div className="ledger-stat"><span className="ledger-stat-n">{data.totals.freshPublished}</span><span className="ledger-stat-l">published</span></div>
        <div className="ledger-stat is-alert"><span className="ledger-stat-n">{data.totals.pendingReview}</span><span className="ledger-stat-l">⚠ pending review</span></div>
      </div>

      <table className="ledger-table">
        <thead>
          <tr>
            <th>Agent</th>
            <th>Iron Triangle</th>
            <th>Status</th>
            <th>Δ Ideas</th>
            <th>Δ Drafts</th>
            <th>Δ Bank</th>
            <th>Δ Pub</th>
            <th>Pending</th>
            <th>Goal</th>
          </tr>
        </thead>
        <tbody>
          {data.agents.map(a => {
            const isExpanded = expanded === a.id
            const inactive = !a.activate
            return (
              <>
                <tr
                  key={a.id}
                  className={`ledger-row ${inactive ? 'is-inactive' : ''} ${isExpanded ? 'is-expanded' : ''}`}
                  onClick={() => setExpanded(isExpanded ? '' : a.id)}
                >
                  <td className="ledger-agent">
                    <span className="ledger-agent-id">{a.id}</span>
                    <span className="ledger-agent-platform">{a.platform || '—'}</span>
                  </td>
                  <td>
                    {a.ironTriangleOK ? (
                      <div className="ledger-triangle">
                        <span title="builder">🧱 {a.builder}</span>
                        <span title="reviewer">👁 {a.reviewer}</span>
                      </div>
                    ) : (
                      <span className="ledger-triangle-broken">⚠ incomplete (B:{a.builder || '—'} R:{a.reviewer || '—'})</span>
                    )}
                  </td>
                  <td>
                    <span className={`ledger-status ledger-status-${a.activate ? 'active' : 'off'}`}>
                      {inactive ? 'off' : a.status || 'active'}
                    </span>
                  </td>
                  <td className="ledger-n">{a.window.new_ideas || ''}</td>
                  <td className="ledger-n">{a.window.drafts || ''}</td>
                  <td className="ledger-n">{a.window.bank || ''}</td>
                  <td className="ledger-n">{a.window.published || ''}</td>
                  <td className={`ledger-n ${a.pending_review ? 'is-alert' : ''}`}>{a.pending_review || ''}</td>
                  <td className="ledger-goal">{(a.goal || '').slice(0, 80) || '—'}</td>
                </tr>
                {isExpanded && (
                  <tr key={a.id + '-x'} className="ledger-expand">
                    <td colSpan={9}>
                      <div className="ledger-expand-inner">
                        <div>
                          <div className="ledger-section">Recent topics ({windowLabel})</div>
                          {a.recent_topics.length ? (
                            <ul className="ledger-topics">
                              {a.recent_topics.map((t, i) => <li key={i}>{t}</li>)}
                            </ul>
                          ) : <span className="ledger-empty">no fresh activity in this window</span>}
                        </div>
                        <div>
                          <div className="ledger-section">Lifetime</div>
                          <ul className="ledger-life">
                            <li>bank: {a.total_bank}</li>
                            <li>published: {a.total_published}</li>
                          </ul>
                        </div>
                        {a.anti_patterns_snippet ? (
                          <div className="ledger-anti">
                            <div className="ledger-section">Latest reviewer feedback</div>
                            <pre>{a.anti_patterns_snippet}</pre>
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            )
          })}
        </tbody>
      </table>

      <div className="ledger-foot">
        Click any row to expand · data from <code>/api/ledger?project={data.project}&amp;window_hours={windowH}</code>
      </div>
    </div>
  )
}
