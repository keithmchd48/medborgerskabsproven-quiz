import type { OptionKey, Question, QuestionOption } from '@/types/question'

const DISPLAY_KEYS: OptionKey[] = ['A', 'B', 'C', 'D']

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
}

/**
 * Returns a copy of the question with options in random order.
 * Labels are always A–D top-to-bottom; correctKey matches the shuffled positions.
 */
export function shuffleQuestionOptions(q: Question): Question {
  const opts = [...q.options]
  shuffleInPlace(opts)
  const correctIndex = opts.findIndex((o) => o.key === q.correctKey)
  if (correctIndex < 0 || opts.length !== DISPLAY_KEYS.length) {
    return { ...q }
  }
  const newOptions: QuestionOption[] = opts.map((o, i) => ({
    key: DISPLAY_KEYS[i]!,
    text: o.text,
  }))
  return {
    ...q,
    options: newOptions,
    correctKey: DISPLAY_KEYS[correctIndex]!,
  }
}

export function optionText(q: Question, key: OptionKey): string {
  return q.options.find((o) => o.key === key)?.text ?? ''
}
