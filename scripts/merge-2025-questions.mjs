/**
 * Parses scripts/source-2025.txt and appends questions not already in src/data/questions.json
 * (dedupe by normalized question text).
 */
import fs from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function parseSource(src) {
  const lines = src
    .split('\n')
    .map((l) => l.trimEnd())
    .filter((l) => !/^-- \d+ of \d+ --$/.test(l.trim()))

  let i = 0
  let chapterTitle = ''
  const questions = []

  function skipEmpty() {
    while (i < lines.length && lines[i].trim() === '') i++
  }

  while (i < lines.length) {
    const line = lines[i].trim()
    if (line.startsWith('Fakta-ark ')) {
      chapterTitle = line.replace(/^Fakta-ark \d+:\s*/, '').trim()
      i++
      continue
    }
    if (/^Spørgsmål \d+$/.test(line)) {
      i++
      skipEmpty()
      const qParts = []
      while (i < lines.length && !/^A\)\s/.test(lines[i].trim())) {
        const l = lines[i].trim()
        if (l && !/^Fakta-ark /.test(l) && !/^Spørgsmål \d+$/.test(l)) {
          qParts.push(l)
        }
        i++
      }
      const questionText = qParts.join(' ').trim()
      const options = { A: '', B: '', C: '', D: '' }
      for (const letter of ['A', 'B', 'C', 'D']) {
        const re = new RegExp(`^${letter}\\)\\s*(.*)$`)
        if (i >= lines.length) throw new Error(`Missing option ${letter} after: ${questionText.slice(0, 40)}`)
        const m = lines[i].trim().match(re)
        if (!m) throw new Error(`Expected ${letter}) at line ${i}: ${lines[i]}`)
        let opt = m[1] || ''
        i++
        while (
          i < lines.length &&
          !/^[A-D]\)\s/.test(lines[i].trim()) &&
          !/^Svar:\s*[A-D]/.test(lines[i].trim())
        ) {
          const t = lines[i].trim()
          if (t) opt += (opt ? ' ' : '') + t
          i++
        }
        options[letter] = opt.trim()
      }
      if (i >= lines.length || !/^Svar:\s*([A-D])\s*$/.test(lines[i].trim())) {
        throw new Error(`Missing Svar after options near: ${questionText.slice(0, 50)} at ${i}`)
      }
      const correct = lines[i].trim().match(/^Svar:\s*([A-D])\s*$/)[1]
      i++
      skipEmpty()
      let explanation = ''
      if (i < lines.length && lines[i].trim().startsWith('Forklaring:')) {
        explanation = lines[i].trim().replace(/^Forklaring:\s*/, '')
        i++
        while (i < lines.length) {
          const t = lines[i].trim()
          if (/^Spørgsmål \d+$/.test(t) || /^Fakta-ark /.test(t)) break
          if (/^[A-D]\)\s/.test(t)) break
          if (/^Svar:\s*[A-D]/.test(t)) break
          if (t) explanation += (explanation ? ' ' : '') + t
          i++
        }
      } else {
        while (i < lines.length && !lines[i].trim().startsWith('Forklaring:')) {
          const t = lines[i].trim()
          if (/^Spørgsmål \d+$/.test(t) || /^Fakta-ark /.test(t)) {
            throw new Error(`Missing Forklaring for: ${questionText.slice(0, 40)}`)
          }
          i++
        }
        if (i < lines.length && lines[i].trim().startsWith('Forklaring:')) {
          explanation = lines[i].trim().replace(/^Forklaring:\s*/, '')
          i++
          while (i < lines.length) {
            const t = lines[i].trim()
            if (/^Spørgsmål \d+$/.test(t) || /^Fakta-ark /.test(t)) break
            if (/^[A-D]\)\s/.test(t)) break
            if (/^Svar:\s*[A-D]/.test(t)) break
            if (t) explanation += (explanation ? ' ' : '') + t
            i++
          }
        }
      }
      questions.push({
        chapter: chapterTitle,
        question: questionText,
        options: [
          { key: 'A', text: options.A },
          { key: 'B', text: options.B },
          { key: 'C', text: options.C },
          { key: 'D', text: options.D },
        ],
        correctKey: correct,
        explanation: explanation.trim(),
      })
      continue
    }
    i++
  }
  return questions
}

function normalizeQuestion(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Levenshtein edit distance. */
function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return dp[m][n]
}

function stringSimilarity(a, b) {
  if (a === b) return 1
  const d = levenshtein(a, b)
  return 1 - d / Math.max(a.length, b.length)
}

function questionTokens(s) {
  return s
    .split(/\s+/)
    .map((w) => w.replace(/^[('"]+|[?.!,:;)'"]+$/g, ''))
    .filter((w) => w.length > 1)
}

/** Sørensen–Dice style overlap on words (handles “den danske …” and punctuation). */
function wordOverlapScore(a, b) {
  const wa = questionTokens(a)
  const wb = questionTokens(b)
  if (wa.length === 0 || wb.length === 0) return 0
  const setB = new Set(wb)
  let hit = 0
  for (const w of wa) {
    if (setB.has(w)) hit++
  }
  return (2 * hit) / (wa.length + wb.length)
}

/**
 * True if candidate matches an existing question (exact, or 2025 rephrase of same fact).
 */
function isNearDuplicate(candidateNorm, existingNorms) {
  for (const ex of existingNorms) {
    if (candidateNorm === ex) return true
    const la = candidateNorm.length
    const lb = ex.length
    if (la < 8 || lb < 8) continue
    const lenRatio = Math.min(la, lb) / Math.max(la, lb)
    if (lenRatio < 0.42) continue
    const sim = stringSimilarity(candidateNorm, ex)
    const words = wordOverlapScore(candidateNorm, ex)
    // 2025 rephrasings often differ by a few words; char + word scores both help
    if (sim >= 0.72) return true
    if (lenRatio >= 0.52 && words >= 0.74) return true
  }
  return false
}

const src2025 = fs.readFileSync(join(__dirname, 'source-2025.txt'), 'utf8')
const from2025 = parseSource(src2025)
console.log('Parsed 2025 source:', from2025.length, 'questions')

const existingPath = join(__dirname, '../src/data/questions.json')
const existing = JSON.parse(fs.readFileSync(existingPath, 'utf8'))

const existingNorms = existing.map((q) => normalizeQuestion(q.question))
const added = []

for (const q of from2025) {
  const key = normalizeQuestion(q.question)
  if (isNearDuplicate(key, existingNorms)) continue
  existingNorms.push(key)
  added.push(q)
}

let nextId = existing.reduce((m, q) => Math.max(m, q.id), 0)
const merged = [
  ...existing,
  ...added.map((q) => ({
    id: ++nextId,
    chapter: q.chapter,
    question: q.question,
    options: q.options,
    correctKey: q.correctKey,
    explanation: q.explanation,
  })),
]

fs.writeFileSync(existingPath, JSON.stringify(merged, null, 2) + '\n', 'utf8')
console.log('Existing:', existing.length, '| Added from 2025:', added.length, '| Total:', merged.length)
if (added.length) {
  console.log(
    'New questions (preview):',
    added.slice(0, 5).map((q) => q.question.slice(0, 60) + '…')
  )
}
