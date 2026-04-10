export type QuizCategoryId = 'mixed'

export interface QuizCategory {
  id: QuizCategoryId
  label: string
  description: string
}

/** Extend this list when you add chapter- or topic-based quizzes. */
export const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: 'mixed',
    label: 'Mixed',
    description: 'Random questions from every chapter in the bank.',
  },
]
