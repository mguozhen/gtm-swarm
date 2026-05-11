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

async function streamOnce(c, payload) {
  const stream = c.messages.stream(payload)
  let text = ''
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
      text += event.delta.text
    }
  }
  const final = await stream.finalMessage()
  return { text, usage: final.usage, stopReason: final.stop_reason }
}

export async function complete(prompt, opts = {}) {
  const c = getClient()
  // Stream so long generations don't trip Cloudflare 524 on proxies like
  // api.flatkey.ai (120s origin-read window). Retry on premature-close
  // because CF/Flatkey occasionally drops mid-stream around the 60s mark.
  const payload = {
    model: opts.model || MODEL,
    max_tokens: opts.maxTokens || MAX_TOKENS,
    messages: [{ role: 'user', content: prompt }],
  }
  const maxAttempts = 4
  let lastErr
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      return await streamOnce(c, payload)
    } catch (err) {
      lastErr = err
      const transient = /Premature close|ECONNRESET|ETIMEDOUT|524|socket hang up/i.test(err?.message || '')
      if (!transient || i === maxAttempts) throw err
      const wait = 2000 * i
      console.error(`[llm] attempt ${i}/${maxAttempts} failed (${err.message}); retrying in ${wait}ms`)
      await new Promise(r => setTimeout(r, wait))
    }
  }
  throw lastErr
}
