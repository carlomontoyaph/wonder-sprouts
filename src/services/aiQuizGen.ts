import { TopicQuestion, AiProvider } from '../types'
import { ILLUSTRATIONS } from '../components/AnswerArt/AnswerArt'
import { pickArtKind } from './artMatch'

export type AiFailure =
  | 'AUTH'
  | 'RATE_LIMIT'
  | 'NETWORK'
  | 'BAD_JSON'
  | 'INSUFFICIENT'
  | 'CORS'
  | 'UNKNOWN'

export type AiResult =
  | { ok: true; questions: TopicQuestion[] }
  | { ok: false; reason: AiFailure; detail?: string }

const KIND_KEYS = Object.keys(ILLUSTRATIONS)

function buildSystemPrompt(count: number): string {
  return [
    'You are creating a short trivia quiz for a child aged 5 to 8 based on the pages of a picture book. The child is learning to read.',
    `Produce exactly ${count} multiple-choice questions grounded in what appears on the pages.`,
    'Rules:',
    '- Questions must be answerable from what is shown in the images.',
    '- Answers must be single words or short phrases (max 20 characters).',
    '- Avoid violence, romance, or complex vocabulary.',
    '- Mix at least one "which word appears" recall question with comprehension questions grounded in what is happening on the page.',
    '- Every question must have exactly 4 answer options, all different.',
    '- Do not include any prose, greeting, explanation, or markdown code fences.',
    'Return ONLY minified JSON with this exact shape:',
    '{"questions":[{"q":string,"a":[string,string,string,string],"correct":0-3,"art":string,"fact":string,"talk":string}]}',
    `The "art" field must be one of these whitelist keys (pick the closest match; use "book-fallback" if nothing fits): ${KIND_KEYS.join(', ')}.`,
  ].join('\n')
}

async function downscaleAndEncode(file: File): Promise<{ base64: string; mime: string }> {
  const mime = file.type && file.type.startsWith('image/') ? file.type : 'image/jpeg'
  const bmp = await createImageBitmap(file).catch(() => null)
  if (!bmp) {
    const buf = await file.arrayBuffer()
    return { base64: bufToBase64(buf), mime }
  }
  const MAX = 1280
  const scale = Math.min(1, MAX / Math.max(bmp.width, bmp.height))
  const w = Math.round(bmp.width * scale)
  const h = Math.round(bmp.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    const buf = await file.arrayBuffer()
    return { base64: bufToBase64(buf), mime }
  }
  ctx.drawImage(bmp, 0, 0, w, h)
  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.85),
  )
  if (!blob) {
    const buf = await file.arrayBuffer()
    return { base64: bufToBase64(buf), mime }
  }
  const buf = await blob.arrayBuffer()
  return { base64: bufToBase64(buf), mime: 'image/jpeg' }
}

function bufToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let bin = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)))
  }
  return btoa(bin)
}

function stripJsonFences(text: string): string {
  let t = text.trim()
  if (t.startsWith('```')) {
    t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
  }
  const first = t.indexOf('{')
  const last = t.lastIndexOf('}')
  if (first > 0 && last > first) t = t.slice(first, last + 1)
  return t.trim()
}

function parseAndValidate(raw: string, count: number): AiResult {
  let parsed: any
  try {
    parsed = JSON.parse(stripJsonFences(raw))
  } catch {
    return { ok: false, reason: 'BAD_JSON' }
  }
  const list = parsed?.questions
  if (!Array.isArray(list) || list.length < count) {
    return { ok: false, reason: 'INSUFFICIENT' }
  }
  const out: TopicQuestion[] = []
  for (let i = 0; i < count; i++) {
    const q = list[i]
    if (!q || typeof q.q !== 'string' || !Array.isArray(q.a) || q.a.length !== 4) {
      return { ok: false, reason: 'INSUFFICIENT' }
    }
    const answers: string[] = q.a.map((s: any) => String(s || '').trim().slice(0, 20))
    const uniq = new Set(answers.map((a) => a.toLowerCase()))
    if (uniq.size !== 4 || answers.some((a) => !a)) {
      return { ok: false, reason: 'INSUFFICIENT' }
    }
    const correct = Number(q.correct)
    if (!Number.isInteger(correct) || correct < 0 || correct > 3) {
      return { ok: false, reason: 'INSUFFICIENT' }
    }
    const correctAnswer = answers[correct]
    let art = typeof q.art === 'string' ? q.art.trim() : ''
    if (!art || !KIND_KEYS.includes(art)) art = pickArtKind(correctAnswer)
    out.push({
      q: String(q.q).slice(0, 140),
      a: [answers[0], answers[1], answers[2], answers[3]],
      correct,
      art,
      artDesc: 'from your book',
      fact: typeof q.fact === 'string' && q.fact.trim()
        ? String(q.fact).slice(0, 200)
        : `You spotted the word "${correctAnswer}" in your book!`,
      talk: typeof q.talk === 'string' && q.talk.trim()
        ? String(q.talk).slice(0, 160)
        : `Can you use "${correctAnswer}" in a sentence about the story?`,
    })
  }
  return { ok: true, questions: out }
}

interface CallArgs {
  files: File[]
  provider: AiProvider
  apiKey: string
  model: string
  count: number
  onProgress: (fraction: number) => void
}

async function callAnthropic(images: Array<{ base64: string; mime: string }>, apiKey: string, model: string, count: number): Promise<Response> {
  const content: any[] = images.map((img) => ({
    type: 'image',
    source: { type: 'base64', media_type: img.mime, data: img.base64 },
  }))
  content.push({ type: 'text', text: 'Generate the quiz JSON now.' })
  return fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: Math.max(2000, count * 400),
      system: buildSystemPrompt(count),
      messages: [{ role: 'user', content }],
    }),
  })
}

function extractAnthropicText(json: any): string {
  const blocks = json?.content
  if (!Array.isArray(blocks)) return ''
  return blocks.filter((b: any) => b?.type === 'text').map((b: any) => b.text || '').join('')
}

async function callOpenAI(images: Array<{ base64: string; mime: string }>, apiKey: string, model: string, count: number): Promise<Response> {
  const content: any[] = images.map((img) => ({
    type: 'image_url',
    image_url: { url: `data:${img.mime};base64,${img.base64}` },
  }))
  content.push({ type: 'text', text: 'Generate the quiz JSON now.' })
  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: Math.max(2000, count * 400),
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildSystemPrompt(count) },
        { role: 'user', content },
      ],
    }),
  })
}

function extractOpenAIText(json: any): string {
  return json?.choices?.[0]?.message?.content || ''
}

async function callGemini(images: Array<{ base64: string; mime: string }>, apiKey: string, model: string, count: number): Promise<Response> {
  const parts: any[] = images.map((img) => ({
    inline_data: { mime_type: img.mime, data: img.base64 },
  }))
  parts.push({ text: 'Generate the quiz JSON now.' })
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`
  return fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { role: 'system', parts: [{ text: buildSystemPrompt(count) }] },
      contents: [{ role: 'user', parts }],
      generationConfig: { responseMimeType: 'application/json', maxOutputTokens: Math.max(2000, count * 400) },
    }),
  })
}

function extractGeminiText(json: any): string {
  const parts = json?.candidates?.[0]?.content?.parts
  if (!Array.isArray(parts)) return ''
  return parts.map((p: any) => p.text || '').join('')
}

function mapHttpFailure(status: number): AiFailure {
  if (status === 401 || status === 403) return 'AUTH'
  if (status === 429) return 'RATE_LIMIT'
  if (status === 404) return 'UNKNOWN'
  return 'UNKNOWN'
}

export async function aiGenerateQuiz(args: CallArgs): Promise<AiResult> {
  const { files, provider, apiKey, model, count, onProgress } = args
  if (!files.length) return { ok: false, reason: 'INSUFFICIENT' }
  if (!apiKey) return { ok: false, reason: 'AUTH' }

  onProgress(0.05)
  const images: Array<{ base64: string; mime: string }> = []
  for (let i = 0; i < files.length; i++) {
    images.push(await downscaleAndEncode(files[i]))
    onProgress(0.05 + (0.35 * (i + 1)) / files.length)
  }

  onProgress(0.45)
  let res: Response
  try {
    if (provider === 'anthropic') res = await callAnthropic(images, apiKey, model, count)
    else if (provider === 'openai') res = await callOpenAI(images, apiKey, model, count)
    else res = await callGemini(images, apiKey, model, count)
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (/failed to fetch|networkerror|load failed/i.test(msg)) {
      return { ok: false, reason: 'CORS', detail: msg }
    }
    return { ok: false, reason: 'NETWORK', detail: msg }
  }

  onProgress(0.9)
  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    try {
      const errText = await res.text()
      if (errText) {
        try {
          const errJson = JSON.parse(errText)
          const apiMsg = errJson?.error?.message || errJson?.error?.status
          if (apiMsg) detail = `${detail}: ${String(apiMsg).slice(0, 200)}`
        } catch {
          detail = `${detail}: ${errText.slice(0, 200)}`
        }
      }
    } catch {}
    return { ok: false, reason: mapHttpFailure(res.status), detail }
  }

  let body: any
  try {
    body = await res.json()
  } catch {
    return { ok: false, reason: 'BAD_JSON' }
  }

  const text =
    provider === 'anthropic' ? extractAnthropicText(body)
    : provider === 'openai' ? extractOpenAIText(body)
    : extractGeminiText(body)

  if (!text) return { ok: false, reason: 'BAD_JSON' }

  onProgress(1)
  return parseAndValidate(text, count)
}
