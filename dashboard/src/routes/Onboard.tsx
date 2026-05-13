import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToken, authHeaders } from '../hooks/useToken'

type Phase = 'input' | 'analyzing' | 'confirm' | 'creating' | 'done'

type Analysis = {
  name: string
  slug: string
  tagline: string
  category: string
  url: string
  audience: { primary: string; secondary: string }
  positioning: string
  competitors: string[]
  suggested_channels: string[]
}

export default function Onboard() {
  const [phase, setPhase] = useState<Phase>('input')
  const [website, setWebsite] = useState('')
  const [githubKb, setGithubKb] = useState('')
  const [, setAnalysisId] = useState('')
  const [, setAnalysis] = useState<Analysis | null>(null)
  const [editedAnalysis, setEditedAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState('')
  const [token] = useToken()
  const navigate = useNavigate()

  const runAnalysis = async () => {
    if (!website.trim()) { setError('Website URL is required'); return }
    setError('')
    setPhase('analyzing')
    const r = await fetch('/api/onboarding/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
      body: JSON.stringify({ website, github_kb: githubKb || undefined }),
    }).then(r => r.json())
    if (r.error) { setError(r.error); setPhase('input'); return }
    const id = r.id
    setAnalysisId(id)
    let tries = 0
    const poll = setInterval(async () => {
      tries++
      const res = await fetch(`/api/onboarding/analysis/${id}`).then(r => r.json())
      if (res.status === 'done') {
        clearInterval(poll)
        setAnalysis(res.result)
        setEditedAnalysis({ ...res.result })
        setPhase('confirm')
      } else if (res.status === 'error' || tries > 30) {
        clearInterval(poll)
        setError(res.error || 'Analysis timed out')
        setPhase('input')
      }
    }, 2000)
  }

  const createProduct = async () => {
    if (!editedAnalysis) return
    setPhase('creating')
    const r = await fetch('/api/workspaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
      body: JSON.stringify({
        slug: editedAnalysis.slug,
        name: editedAnalysis.name,
        urls: { website, github_kb: githubKb || undefined },
        project_config: editedAnalysis,
      }),
    }).then(r => r.json())
    if (r.error) { setError(r.error); setPhase('confirm'); return }
    setPhase('done')
    setTimeout(() => navigate(`/wizard/${editedAnalysis.slug}`), 1500)
  }

  if (phase === 'done') {
    return (
      <div className="wizard wizard-success">
        <div className="success-burst">
          <div className="success-checkmark">✓</div>
          <h1>Product Created</h1>
          <p>Redirecting to ContentOS wizard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="wizard">
      <header className="wizard-header">
        <Link to="/" className="wizard-back">← projects</Link>
        <div className="wizard-title">
          <span className="wt-label">ONBOARDING</span>
          <h1>New Product</h1>
        </div>
      </header>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 16px' }}>
        {phase === 'input' && (
          <div>
            <h2 style={{ marginBottom: 8 }}>Product URLs</h2>
            <p style={{ color: '#9ca3af', marginBottom: 24 }}>
              Paste your product website URL. AI will analyze it and pre-fill the product config.
            </p>
            {error && <p style={{ color: '#ef4444', marginBottom: 16 }}>{error}</p>}
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Website URL *</label>
            <input
              type="url"
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder="https://your-product.com"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151',
                background: '#1f2937', color: '#f9fafb', fontSize: 14, marginBottom: 16, boxSizing: 'border-box' as const }}
            />
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>GitHub KB URL (optional)</label>
            <input
              type="url"
              value={githubKb}
              onChange={e => setGithubKb(e.target.value)}
              placeholder="https://github.com/org/kb-repo"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #374151',
                background: '#1f2937', color: '#f9fafb', fontSize: 14, marginBottom: 24, boxSizing: 'border-box' as const }}
            />
            <button className="btn btn-primary" onClick={runAnalysis} style={{ width: '100%' }}>
              Analyze Product →
            </button>
          </div>
        )}

        {phase === 'analyzing' && (
          <div style={{ textAlign: 'center', paddingTop: 64 }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>⟳</div>
            <h2>Analyzing product...</h2>
            <p style={{ color: '#9ca3af' }}>AI is scraping {website} and extracting GTM metadata.</p>
          </div>
        )}

        {phase === 'confirm' && editedAnalysis && (
          <div>
            <h2 style={{ marginBottom: 8 }}>Confirm Product Info</h2>
            <p style={{ color: '#9ca3af', marginBottom: 24 }}>Review and correct the AI's analysis.</p>
            {error && <p style={{ color: '#ef4444', marginBottom: 16 }}>{error}</p>}
            {([
              { key: 'name', label: 'Product Name' },
              { key: 'slug', label: 'Slug (URL-safe)' },
              { key: 'tagline', label: 'Tagline' },
              { key: 'category', label: 'Category' },
              { key: 'positioning', label: 'Positioning' },
            ] as const).map(({ key, label }) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: 13 }}>{label}</label>
                <input
                  value={(editedAnalysis as any)[key] || ''}
                  onChange={e => setEditedAnalysis({ ...editedAnalysis, [key]: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #374151',
                    background: '#1f2937', color: '#f9fafb', fontSize: 14, boxSizing: 'border-box' as const }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: 13 }}>Competitors (comma-separated)</label>
              <input
                value={editedAnalysis.competitors?.join(', ') || ''}
                onChange={e => setEditedAnalysis({ ...editedAnalysis, competitors: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #374151',
                  background: '#1f2937', color: '#f9fafb', fontSize: 14, boxSizing: 'border-box' as const }}
              />
            </div>
            <button className="btn btn-primary" onClick={createProduct} style={{ width: '100%' }}>
              Create Product & Start ContentOS Wizard →
            </button>
          </div>
        )}

        {phase === 'creating' && (
          <div style={{ textAlign: 'center', paddingTop: 64 }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>⟳</div>
            <h2>Creating product workspace...</h2>
          </div>
        )}
      </div>
    </div>
  )
}
