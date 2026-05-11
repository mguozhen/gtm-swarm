import Anthropic from '@anthropic-ai/sdk'

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-4-7'
const MAX_TOKENS = parseInt(process.env.ANTHROPIC_MAX_TOKENS || '16000', 10)

export const hasAnthropic = () => Boolean(process.env.ANTHROPIC_API_KEY)

let client = null
function getClient() {
  if (!client) {
    if (!hasAnthropic()) throw new Error('ANTHROPIC_API_KEY not set')
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return client
}

export async function complete(prompt, opts = {}) {
  const c = getClient()
  const msg = await c.messages.create({
    model: opts.model || MODEL,
    max_tokens: opts.maxTokens || MAX_TOKENS,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = msg.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('')
  return { text, usage: msg.usage, stopReason: msg.stop_reason }
}
