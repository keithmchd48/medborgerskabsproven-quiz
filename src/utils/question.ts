import type { OptionKey, Question } from '@/types/question'

export function optionText(q: Question, key: OptionKey): string {
  return q.options.find((o) => o.key === key)?.text ?? ''
}
