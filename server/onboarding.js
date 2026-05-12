// server/onboarding.js
import { complete } from './llm.js'

const analyses = new Map()

function newAnalysisId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export async function analyzeProduct({ website, github_kb }) {
  const id = newAnalysisId()
  analyses.set(id, { status: 'running', started_at: new Date().toISOString() })

  const prompt = `You are a product analyst. Analyze the following product URL(s) and extract structured GTM metadata.

Website URL: ${website}
${github_kb ? `GitHub KB URL: ${github_kb}` : ''}

Return ONLY a JSON object (no markdown, no preamble) with these fields:
{
  "name": "Product name",
  "slug": "kebab-case-slug",
  "tagline": "One-sentence tagline",
  "category": "B2B SaaS | B2C | Dev tools | etc",
  "url": "${website}",
  "audience": {
    "primary": "Primary audience description",
    "secondary": "Secondary audience"
  },
  "positioning": "1-2 sentence positioning statement",
  "competitors": ["competitor1", "competitor2", "competitor3"],
  "suggested_channels": ["reddit", "x", "blog", "kol-koc"]
}`

  complete(prompt, { maxTokens: 2000 }).then(({ text }) => {
    try {
      const jsonStr = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
      const data = JSON.parse(jsonStr)
      analyses.set(id, { status: 'done', result: data, completed_at: new Date().toISOString() })
    } catch (e) {
      analyses.set(id, { status: 'error', error: e.message })
    }
  }).catch(e => {
    analyses.set(id, { status: 'error', error: e.message })
  })

  return id
}

export function getAnalysis(id) {
  return analyses.get(id) || null
}
