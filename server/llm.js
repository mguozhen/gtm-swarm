import Anthropic from '@anthropic-ai/sdk'

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6'
const MAX_TOKENS = parseInt(process.env.ANTHROPIC_MAX_TOKENS || '16000', 10)
const BASE_URL = process.env.ANTHROPIC_BASE_URL || undefined

export const hasAnthropic = () => Boolean(process.env.ANTHROPIC_API_KEY)

let client = null
function getClient() {
  if (!client) {
    if (!hasAnthropic()) throw new Error('ANTHROPIC_API_KEY not set')
    const opts = { apiKey: process.env.ANTHROPIC_API_KEY }
    if (BASE_URL) opts.baseURL = BASE_URL
    client = new Anthropic(opts)
  }
  return client
}

export async function complete(prompt, opts = {}) {
  const c = getClient()
  // Stream so long generations don't trip Cloudflare 524 timeouts on proxies
  // like api.flatkey.ai (120s origin-read window).
  const stream = c.messages.stream({
    model: opts.model || MODEL,
    max_tokens: opts.maxTokens || MAX_TOKENS,
    messages: [{ role: 'user', content: prompt }],
  })
  let text = ''
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
      text += event.delta.text
    }
  }
  const final = await stream.finalMessage()
  return { text, usage: final.usage, stopReason: final.stop_reason }
}
