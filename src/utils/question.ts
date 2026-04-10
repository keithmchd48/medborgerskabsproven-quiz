import type { OptionKey, Question, QuestionOption } from '@/types/question'

const DISPLAY_KEYS: OptionKey[] = ['A', 'B', 'C', 'D']

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
}

function displayKeysForOptionCount(n: number): OptionKey[] {
  if (n < 2 || n > 4) return []
  return DISPLAY_KEYS.slice(0, n) as OptionKey[]
}

/**
 * Returns a copy of the question with options in random order.
 * Labels are A–D in display order (3- or 4-option MCQs supported); correctKey matches shuffled positions.
 */
export function shuffleQuestionOptions(q: Question): Question {
  const opts = [...q.options]
  shuffleInPlace(opts)
  const correctIndex = opts.findIndex((o) => o.key === q.correctKey)
  const keys = displayKeysForOptionCount(opts.length)
  if (correctIndex < 0 || keys.length !== opts.length) {
    return { ...q }
  }
  const newOptions: QuestionOption[] = opts.map((o, i) => ({
    key: keys[i]!,
    text: o.text,
  }))
  return {
    ...q,
    options: newOptions,
    correctKey: keys[correctIndex]!,
  }
}

export function optionText(q: Question, key: OptionKey): string {
  return q.options.find((o) => o.key === key)?.text ?? ''
}
