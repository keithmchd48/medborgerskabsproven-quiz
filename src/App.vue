<script setup>
import { ref, computed } from 'vue'
import allQuestions from './data/questions.json'

const QUIZ_SIZE = 25

const phase = ref('start')
const quizQuestions = ref([])
const currentIndex = ref(0)
const selectedKey = ref(null)
const answers = ref([])

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function startQuiz() {
  quizQuestions.value = shuffle(allQuestions).slice(0, QUIZ_SIZE)
  currentIndex.value = 0
  selectedKey.value = null
  answers.value = []
  phase.value = 'quiz'
}

function selectOption(key) {
  selectedKey.value = key
}

function nextQuestion() {
  if (selectedKey.value === null) return
  const q = quizQuestions.value[currentIndex.value]
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

function optionText(q, key) {
  return q.options.find((o) => o.key === key)?.text ?? ''
}

function endQuiz() {
  phase.value = 'start'
}

const currentQuestion = computed(() => quizQuestions.value[currentIndex.value])
</script>

<template>
  <div class="min-h-dvh flex flex-col items-center px-4 py-10 sm:py-14">
    <header class="mb-8 text-center max-w-2xl">
      <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
        Medborgerskabsprøven
      </h1>
      <p class="mt-2 text-sm text-slate-600">
        Practice quiz — questions and explanations are in Danish.
      </p>
    </header>

    <main class="w-full max-w-2xl flex-1 flex flex-col">
      <!-- Start -->
      <section
        v-if="phase === 'start'"
        class="flex flex-col items-center justify-center flex-1 gap-8 rounded-2xl border border-slate-200/80 bg-white/90 p-10 shadow-sm backdrop-blur-sm"
      >
        <p class="text-slate-600 text-center max-w-md leading-relaxed">
          Each quiz has {{ QUIZ_SIZE }} random questions from the full bank. Select one answer per
          question to continue. At the end you will see your score and a review of any mistakes.
        </p>
        <button
          type="button"
          class="rounded-xl bg-slate-900 px-8 py-3.5 text-base font-medium text-white shadow-md transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          @click="startQuiz"
        >
          Start Quiz
        </button>
      </section>

      <!-- Quiz -->
      <section
        v-else-if="phase === 'quiz' && currentQuestion"
        class="rounded-2xl border border-slate-200/80 bg-white/90 p-6 sm:p-8 shadow-sm backdrop-blur-sm"
      >
        <div class="mb-6 flex items-center justify-between gap-4 text-sm text-slate-500">
          <span class="font-medium text-slate-700"
            >Question {{ currentIndex + 1 }} of {{ QUIZ_SIZE }}</span
          >
          <span class="truncate text-xs sm:text-sm" :title="currentQuestion.chapter">{{
            currentQuestion.chapter
          }}</span>
        </div>

        <h2 class="text-lg sm:text-xl font-medium text-slate-900 leading-snug mb-6">
          {{ currentQuestion.question }}
        </h2>

        <fieldset class="space-y-3 border-0 p-0 m-0">
          <legend class="sr-only">Choose one answer</legend>
          <label
            v-for="opt in currentQuestion.options"
            :key="opt.key"
            class="flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition has-[:checked]:border-slate-900 has-[:checked]:bg-slate-50 border-slate-200 hover:border-slate-300"
          >
            <input
              v-model="selectedKey"
              class="mt-1 h-4 w-4 shrink-0 border-slate-300 text-slate-900 focus:ring-slate-500"
              type="radio"
              :name="'q-' + currentQuestion.id"
              :value="opt.key"
            />
            <span class="text-left leading-relaxed">
              <span class="font-semibold text-slate-800">{{ opt.key }})</span>
              {{ opt.text }}
            </span>
          </label>
        </fieldset>

        <div class="mt-8 flex justify-end">
          <button
            type="button"
            class="rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            :disabled="selectedKey === null"
            @click="nextQuestion"
          >
            {{ currentIndex + 1 >= QUIZ_SIZE ? 'See results' : 'Next question' }}
          </button>
        </div>
      </section>

      <!-- Results -->
      <section
        v-else-if="phase === 'results'"
        class="rounded-2xl border border-slate-200/80 bg-white/90 p-6 sm:p-8 shadow-sm backdrop-blur-sm"
      >
        <h2 class="text-xl font-semibold text-slate-900 mb-2">Quiz complete</h2>
        <p class="text-lg text-slate-700 mb-8">
          You answered
          <span class="font-semibold tabular-nums text-slate-900">{{ score }}</span>
          out of
          <span class="font-semibold tabular-nums">{{ QUIZ_SIZE }}</span>
          questions correctly.
        </p>

        <div v-if="wrongAnswers.length === 0" class="mb-8 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-900">
          You answered every question in this quiz correctly.
        </div>

        <div v-else class="mb-8 space-y-8">
          <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Questions to review
          </h3>
          <article
            v-for="item in wrongAnswers"
            :key="item.id + '-' + item.selectedKey"
            class="border-b border-slate-100 pb-8 last:border-0 last:pb-0"
          >
            <p class="font-medium text-slate-900 mb-3 leading-snug">{{ item.question }}</p>
            <dl class="space-y-2 text-sm text-slate-700">
              <div>
                <dt class="inline font-medium text-slate-600">Correct answer:</dt>
                <dd class="inline ml-1">
                  {{ item.correctKey }}) {{ optionText(item, item.correctKey) }}
                </dd>
              </div>
              <div>
                <dt class="inline font-medium text-slate-600">Your answer:</dt>
                <dd class="inline ml-1">
                  {{ item.selectedKey }}) {{ optionText(item, item.selectedKey) }}
                </dd>
              </div>
              <div class="pt-2 text-slate-600 leading-relaxed">
                <span class="font-medium text-slate-700">Explanation:</span>
                {{ item.explanation }}
              </div>
            </dl>
          </article>
        </div>

        <button
          type="button"
          class="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          @click="endQuiz"
        >
          End quiz
        </button>
      </section>
    </main>
  </div>
</template>
