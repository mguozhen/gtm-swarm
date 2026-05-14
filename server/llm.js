// Supports DeepSeek (default) or Anthropic via env vars
// DEEPSEEK_API_KEY  → use DeepSeek  (https://api.deepseek.com)
// ANTHROPIC_API_KEY → use Anthropic (fallback)

import Anthropic from '@anthropic-ai/sdk'

const DEEPSEEK_BASE = 'https://api.deepseek.com/v1'
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat'

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6'
const ANTHROPIC_BASE_URL = process.env.ANTHROPIC_BASE_URL || undefined

function getAnthropicKey() {
  return process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN || ''
}

export function hasAnthropic() {
  return Boolean(process.env.DEEPSEEK_API_KEY || getAnthropicKey())
}

async function completeDeepSeek(prompt, opts = {}) {
  const res = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: opts.model || DEEPSEEK_MODEL,
      max_tokens: opts.maxTokens || 8000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`DeepSeek API error ${res.status}: ${err.slice(0, 200)}`)
  }
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content || ''
  const usage = data.usage
  return { text, usage, stopReason: data.choices?.[0]?.finish_reason }
}

let anthropicClient = null
async function completeAnthropic(prompt, opts = {}) {
  if (!anthropicClient) {
    const clientOpts = { apiKey: getAnthropicKey() }
    if (ANTHROPIC_BASE_URL) clientOpts.baseURL = ANTHROPIC_BASE_URL
    anthropicClient = new Anthropic(clientOpts)
  }
  const msg = await anthropicClient.messages.create({
    model: opts.model || ANTHROPIC_MODEL,
    max_tokens: opts.maxTokens || 16000,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = msg.content.filter(b => b.type === 'text').map(b => b.text).join('')
  return { text, usage: msg.usage, stopReason: msg.stop_reason }
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
  if (process.env.DEEPSEEK_API_KEY) return completeDeepSeek(prompt, opts)
  if (process.env.ANTHROPIC_API_KEY) return completeAnthropic(prompt, opts)
  throw new Error('No LLM configured — set DEEPSEEK_API_KEY or ANTHROPIC_API_KEY')
}
