export type OptionKey = 'A' | 'B' | 'C' | 'D'

export interface QuestionOption {
  key: OptionKey
  text: string
}

export interface Question {
  id: number
  chapter: string
  question: string
  options: QuestionOption[]
  correctKey: OptionKey
  explanation: string
}

export interface AnsweredQuestion extends Question {
  selectedKey: OptionKey
  isCorrect: boolean
}

export type Phase = 'home' | 'start' | 'quiz' | 'results'
