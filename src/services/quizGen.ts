import { TopicQuestion } from '../types'
import { pickArtKind } from './artMatch'

const STOPWORDS = new Set<string>([
  'the','a','an','and','or','but','so','if','of','to','in','on','at','by','for','with','from',
  'is','am','are','was','were','be','been','being','it','its','this','that','these','those',
  'i','you','he','she','we','they','me','him','her','us','them','my','your','his','their','our',
  'do','does','did','done','doing','have','has','had','having','will','would','could','should',
  'can','may','might','must','shall','not','no','yes','as','than','then','there','here','when',
  'where','why','how','what','which','who','whom','whose','some','any','all','each','every',
  'both','few','more','most','other','another','such','only','own','same','too','very','just',
  'much','many','one','two','three','four','five','six','seven','eight','nine','ten','into',
  'up','down','out','off','over','under','again','once','also','about','because','while',
  'after','before','above','below','between','through','across','around','oh','ah','um','er',
  'say','said','says','saying','go','went','goes','going','get','got','gets','getting','make',
  'made','makes','making','put','puts','putting','see','saw','sees','seeing','look','looks',
  'looked','looking','come','came','comes','coming','take','took','takes','taking','give',
  'gave','gives','giving','know','knew','knows','knowing','think','thought','thinks','thinking',
])

// Common English kid-vocabulary words for distractors that must NOT appear in
// the OCR text. Keep short and age-appropriate.
const KID_LEXICON = [
  'apple','banana','pear','grape','orange','carrot','bread','milk','water','juice',
  'happy','sleepy','hungry','thirsty','angry','shy','brave','kind','silly','proud',
  'red','blue','green','yellow','pink','purple','black','white','brown','gray',
  'circle','square','triangle','star','heart','moon','sun','cloud','rain','snow',
  'cat','dog','fish','bird','frog','bear','duck','cow','horse','sheep',
  'ball','doll','block','crayon','book','paper','pen','pencil','box','bag',
  'run','jump','swim','fly','walk','skip','hop','dance','sing','laugh',
  'big','small','tall','short','wide','narrow','fast','slow','loud','quiet',
  'mom','dad','sister','brother','baby','friend','teacher','doctor','farmer','artist',
  'house','tree','flower','grass','leaf','rock','sand','wave','beach','mountain',
  'chair','table','bed','lamp','door','window','floor','wall','roof','stair',
  'shoe','sock','shirt','pants','hat','glove','coat','scarf','dress','skirt',
  'car','bus','truck','bike','boat','plane','train','rocket','wagon','sled',
  'morning','night','day','week','month','year','summer','winter','spring','autumn',
]

interface CandidateSentence {
  text: string
  words: string[]
}

export type GenerateResult =
  | { ok: true; questions: TopicQuestion[] }
  | { ok: false; reason: 'INSUFFICIENT' | 'EMPTY' }

interface DraftQuestion {
  q: string
  correct: string
  distractors: string[]
  fact?: string
}

function clean(raw: string): string {
  return raw
    .replace(/[“”‘’]/g, "'")
    .replace(/[^\x20-\x7E\n]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function splitSentences(text: string): CandidateSentence[] {
  const parts = text.split(/(?<=[.!?])\s+/g)
  const out: CandidateSentence[] = []
  for (const p of parts) {
    const words = p.split(/\s+/).filter(Boolean)
    if (words.length < 5 || words.length > 18) continue
    if (!words.some((w) => w.replace(/[^a-zA-Z]/g, '').length >= 4)) continue
    out.push({ text: p.trim(), words })
  }
  return out
}

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z']+/g) || []).filter(
    (t) => t.length >= 3 && !STOPWORDS.has(t) && !t.includes("''"),
  )
}

function tally(tokens: string[]): Map<string, number> {
  const m = new Map<string, number>()
  for (const t of tokens) m.set(t, (m.get(t) || 0) + 1)
  return m
}

function isNounShaped(word: string, sentenceWords: string[]): boolean {
  const w = word.toLowerCase()
  if (/(tion|ness|ment|ship|hood|ing)$/.test(w)) return true
  // Capitalized mid-sentence (proper noun)
  const idx = sentenceWords.findIndex((sw) => sw.toLowerCase().replace(/[^a-z']/g, '') === w)
  if (idx > 0 && /^[A-Z]/.test(sentenceWords[idx].replace(/[^A-Za-z]/g, ''))) return true
  // Preceded by "the"/"a"/"an"
  if (idx > 0) {
    const prev = sentenceWords[idx - 1].toLowerCase().replace(/[^a-z]/g, '')
    if (prev === 'the' || prev === 'a' || prev === 'an') return true
  }
  return false
}

function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function pickDistractors(
  correct: string,
  wordBank: string[],
  excludeInSentence: Set<string>,
  count = 3,
): string[] {
  const cLen = correct.length
  const cInitial = correct[0]
  const scored = wordBank
    .filter(
      (w) =>
        w !== correct &&
        !excludeInSentence.has(w) &&
        w[0] !== cInitial &&
        w.length >= 3,
    )
    .map((w) => ({ w, dist: Math.abs(w.length - cLen) }))
    .sort((a, b) => a.dist - b.dist)
  const chosen: string[] = []
  const usedInitials = new Set<string>([cInitial])
  for (const { w } of scored) {
    if (usedInitials.has(w[0])) continue
    chosen.push(w)
    usedInitials.add(w[0])
    if (chosen.length === count) break
  }
  // If we can't find enough with unique initials, allow initial reuse
  if (chosen.length < count) {
    for (const { w } of scored) {
      if (chosen.includes(w) || w === correct) continue
      chosen.push(w)
      if (chosen.length === count) break
    }
  }
  return chosen
}

function pickKidLexiconDistractors(
  correct: string,
  presentTokens: Set<string>,
  count = 3,
): string[] {
  const pool = KID_LEXICON.filter(
    (w) => !presentTokens.has(w) && w !== correct && w[0] !== correct[0],
  )
  // shuffle
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, count)
}

function buildQuestion(draft: DraftQuestion): TopicQuestion | null {
  const options = [draft.correct, ...draft.distractors]
  // Dedupe case-insensitively
  const seen = new Set<string>()
  for (const o of options) {
    const key = o.toLowerCase()
    if (seen.has(key)) return null
    seen.add(key)
  }
  if (options.length !== 4) return null
  if (options.some((o) => o.length < 2 || o.length > 18)) return null

  // Shuffle then find correct index
  const shuffled = [...options]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  const correctIdx = shuffled.findIndex((o) => o === draft.correct)
  if (correctIdx === -1) return null

  const a = [
    titleCase(shuffled[0]),
    titleCase(shuffled[1]),
    titleCase(shuffled[2]),
    titleCase(shuffled[3]),
  ] as [string, string, string, string]

  const correctWord = titleCase(draft.correct)
  return {
    q: draft.q,
    a,
    correct: correctIdx,
    art: pickArtKind(draft.correct),
    artDesc: 'from your book',
    fact: draft.fact || `You spotted the word "${correctWord}" in your book!`,
    talk: `Can you use "${correctWord}" in a sentence about the story?`,
  }
}

function templateCloze(
  sentences: CandidateSentence[],
  keyPool: string[],
  wordBank: string[],
  usedCorrect: Set<string>,
): TopicQuestion | null {
  for (const s of sentences) {
    const sentenceTokensLower = s.words.map((w) =>
      w.toLowerCase().replace(/[^a-z']/g, ''),
    )
    for (let i = 1; i < sentenceTokensLower.length - 1; i++) {
      const tok = sentenceTokensLower[i]
      if (!keyPool.includes(tok)) continue
      if (usedCorrect.has(tok)) continue
      // must appear only once in this sentence
      if (sentenceTokensLower.filter((t) => t === tok).length !== 1) continue
      if (!isNounShaped(tok, s.words)) continue
      const masked = s.words
        .map((w, idx) =>
          idx === i ? w.replace(/[A-Za-z']+/, '_____') : w,
        )
        .join(' ')
      const distractors = pickDistractors(
        tok,
        wordBank,
        new Set(sentenceTokensLower),
      )
      if (distractors.length < 3) continue
      const draft: DraftQuestion = {
        q: `Fill in the blank: "${masked}"`,
        correct: tok,
        distractors,
        fact: `From your book: "${s.text}"`,
      }
      const q = buildQuestion(draft)
      if (q) {
        usedCorrect.add(tok)
        return q
      }
    }
  }
  return null
}

function templateWordRecognition(
  keyPool: string[],
  presentTokens: Set<string>,
  usedCorrect: Set<string>,
): TopicQuestion | null {
  for (const tok of keyPool) {
    if (usedCorrect.has(tok)) continue
    if (tok.length < 3 || tok.length > 12) continue
    const distractors = pickKidLexiconDistractors(tok, presentTokens)
    if (distractors.length < 3) continue
    const draft: DraftQuestion = {
      q: `Which word was in your book?`,
      correct: tok,
      distractors,
    }
    const q = buildQuestion(draft)
    if (q) {
      usedCorrect.add(tok)
      return q
    }
  }
  return null
}

function templateFirstLetter(
  keyPool: string[],
  usedCorrect: Set<string>,
): TopicQuestion | null {
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  for (const letter of letters) {
    const matches = keyPool.filter(
      (w) => w[0] === letter && !usedCorrect.has(w),
    )
    if (matches.length === 0) continue
    const correct = matches[0]
    const others = keyPool.filter(
      (w) => w[0] !== letter && w !== correct,
    )
    if (others.length < 3) continue
    // pick 3 words starting with different letters
    const distractors: string[] = []
    const usedInitials = new Set<string>([letter])
    for (const o of others) {
      if (usedInitials.has(o[0])) continue
      distractors.push(o)
      usedInitials.add(o[0])
      if (distractors.length === 3) break
    }
    if (distractors.length < 3) continue
    const draft: DraftQuestion = {
      q: `Which word from your book starts with the letter "${letter.toUpperCase()}"?`,
      correct,
      distractors,
    }
    const built = buildQuestion(draft)
    if (built) {
      usedCorrect.add(correct)
      return built
    }
  }
  return null
}

function templateLongest(
  wordBank: string[],
  usedCorrect: Set<string>,
): TopicQuestion | null {
  const candidates = [...wordBank]
    .filter((w) => !usedCorrect.has(w) && w.length >= 4 && w.length <= 12)
    .sort((a, b) => b.length - a.length)
  if (candidates.length < 4) return null
  const correct = candidates[0]
  // pick 3 shorter words
  const distractors = candidates
    .slice(1)
    .filter((w) => w.length < correct.length && w[0] !== correct[0])
    .slice(0, 3)
  if (distractors.length < 3) return null
  const draft: DraftQuestion = {
    q: `Which of these words from your book is the longest?`,
    correct,
    distractors,
  }
  const q = buildQuestion(draft)
  if (q) {
    usedCorrect.add(correct)
    return q
  }
  return null
}

export function generateQuiz(rawText: string, count = 5): GenerateResult {
  const cleaned = clean(rawText)
  if (cleaned.length < 40) return { ok: false, reason: 'EMPTY' }

  const sentences = splitSentences(cleaned)
  const allTokens = tokenize(cleaned)
  if (allTokens.length < 12) return { ok: false, reason: 'INSUFFICIENT' }

  const freq = tally(allTokens)
  const keyPool = [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .map(([w]) => w)
    .slice(0, 40)
  const wordBank = Array.from(new Set(allTokens))
  const presentTokens = new Set(allTokens)
  const usedCorrect = new Set<string>()

  const questions: TopicQuestion[] = []
  const clozeMax = Math.max(3, Math.ceil(count * 0.6))
  const recogMax = Math.max(2, Math.ceil(count * 0.4))

  // Template A — cloze
  for (let i = 0; i < clozeMax && questions.length < count; i++) {
    const q = templateCloze(sentences, keyPool, wordBank, usedCorrect)
    if (!q) break
    questions.push(q)
  }

  // Template B — word recognition
  for (let i = 0; i < recogMax && questions.length < count; i++) {
    const q = templateWordRecognition(keyPool, presentTokens, usedCorrect)
    if (!q) break
    questions.push(q)
  }

  // Template C — first-letter (fill up)
  while (questions.length < count) {
    const q = templateFirstLetter(keyPool, usedCorrect)
    if (!q) break
    questions.push(q)
  }

  // Template D — longest word (last resort)
  while (questions.length < count) {
    const q = templateLongest(wordBank, usedCorrect)
    if (!q) break
    questions.push(q)
  }

  if (questions.length < count) return { ok: false, reason: 'INSUFFICIENT' }
  return { ok: true, questions: questions.slice(0, count) }
}
