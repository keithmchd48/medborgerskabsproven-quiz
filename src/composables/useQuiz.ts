import { ref, computed } from 'vue'
import type { Question, AnsweredQuestion, OptionKey, Phase } from '@/types/question'
import { shuffleQuestionOptions } from '@/utils/question'
import { QUIZ_CATEGORIES, type QuizCategoryId } from '@/config/quizCategories'
import rawQuestions from '@/data/questions.json'
import rawDatesQuestions from '@/data/questions-dates.json'
import rawFamousQuestions from '@/data/questions-famous.json'
export const QUIZ_SIZE = 25

const allQuestions = rawQuestions as Question[]
const datesQuestions = rawDatesQuestions as Question[]
const famousQuestions = rawFamousQuestions as Question[]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

function questionPoolForCategory(categoryId: QuizCategoryId): Question[] {
  switch (categoryId) {
    case 'mixed':
      return allQuestions
    case 'dates':
      return datesQuestions
    case 'famous':
      return famousQuestions
    default:
      return allQuestions
  }
}

function questionCountForPool(pool: Question[]): number {
  return Math.min(QUIZ_SIZE, pool.length)
}

export function useQuiz() {
  const phase = ref<Phase>('home')
  const selectedCategoryId = ref<QuizCategoryId | null>(null)
  const quizQuestions = ref<Question[]>([])
  const currentIndex = ref(0)
  const selectedKey = ref<OptionKey | null>(null)
  const answers = ref<AnsweredQuestion[]>([])

  const selectedCategory = computed(() =>
    selectedCategoryId.value
      ? QUIZ_CATEGORIES.find((c) => c.id === selectedCategoryId.value) ?? null
      : null,
  )

  /** How many questions the next quiz will use (shown on start screen). */
  const previewQuestionCount = computed(() => {
    if (!selectedCategoryId.value) return QUIZ_SIZE
    return questionCountForPool(questionPoolForCategory(selectedCategoryId.value))
  })

  const currentQuizLength = computed(() => quizQuestions.value.length)

  const completedQuizQuestionCount = computed(() => answers.value.length)

  function selectCategory(categoryId: QuizCategoryId) {
    selectedCategoryId.value = categoryId
    phase.value = 'start'
  }

  function goBackToCategories() {
    selectedCategoryId.value = null
    phase.value = 'home'
  }

  function startQuiz() {
    if (!selectedCategoryId.value) return
    const pool = questionPoolForCategory(selectedCategoryId.value)
    const n = questionCountForPool(pool)
    quizQuestions.value = shuffle(pool).slice(0, n).map(shuffleQuestionOptions)
    currentIndex.value = 0
    selectedKey.value = null
    answers.value = []
    phase.value = 'quiz'
  }

  function nextQuestion() {
    if (selectedKey.value === null) return
    const q = quizQuestions.value[currentIndex.value]!
    const len = quizQuestions.value.length
    answers.value.push({
      ...q,
      selectedKey: selectedKey.value,
      isCorrect: selectedKey.value === q.correctKey,
    })
    if (currentIndex.value >= len - 1) {
      phase.value = 'results'
    } else {
      currentIndex.value++
      selectedKey.value = null
    }
  }

  const score = computed(() => answers.value.filter((a) => a.isCorrect).length)

  const wrongAnswers = computed(() => answers.value.filter((a) => !a.isCorrect))

  const currentQuestion = computed(() => quizQuestions.value[currentIndex.value])

  function endQuiz() {
    selectedCategoryId.value = null
    phase.value = 'home'
  }

  return {
    phase,
    selectedCategoryId,
    selectedCategory,
    previewQuestionCount,
    currentQuizLength,
    completedQuizQuestionCount,
    quizQuestions,
    currentIndex,
    selectedKey,
    answers,
    score,
    wrongAnswers,
    currentQuestion,
    selectCategory,
    goBackToCategories,
    startQuiz,
    nextQuestion,
    endQuiz,
  }
}
