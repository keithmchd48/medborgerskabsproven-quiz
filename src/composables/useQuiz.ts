import { ref, computed } from 'vue'
import type { Question, AnsweredQuestion, OptionKey, Phase } from '@/types/question'
import rawQuestions from '@/data/questions.json'
export const QUIZ_SIZE = 25

const allQuestions = rawQuestions as Question[]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

export function useQuiz() {
  const phase = ref<Phase>('start')
  const quizQuestions = ref<Question[]>([])
  const currentIndex = ref(0)
  const selectedKey = ref<OptionKey | null>(null)
  const answers = ref<AnsweredQuestion[]>([])

  function startQuiz() {
    quizQuestions.value = shuffle(allQuestions).slice(0, QUIZ_SIZE)
    currentIndex.value = 0
    selectedKey.value = null
    answers.value = []
    phase.value = 'quiz'
  }

  function nextQuestion() {
    if (selectedKey.value === null) return
    const q = quizQuestions.value[currentIndex.value]!
    answers.value.push({
      ...q,
      selectedKey: selectedKey.value,
      isCorrect: selectedKey.value === q.correctKey,
    })
    if (currentIndex.value >= QUIZ_SIZE - 1) {
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
    phase.value = 'start'
  }

  return {
    phase,
    quizQuestions,
    currentIndex,
    selectedKey,
    answers,
    score,
    wrongAnswers,
    currentQuestion,
    startQuiz,
    nextQuestion,
    endQuiz,
  }
}
