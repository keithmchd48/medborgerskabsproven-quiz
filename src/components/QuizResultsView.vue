<script setup lang="ts">
import type { AnsweredQuestion } from '@/types/question'
import WrongAnswerItem from './WrongAnswerItem.vue'

defineProps<{
  score: number
  quizSize: number
  wrongAnswers: AnsweredQuestion[]
}>()

const emit = defineEmits<{
  end: []
}>()
</script>

<template>
  <section
    class="rounded-2xl border border-slate-200/80 bg-white/90 p-6 sm:p-8 shadow-sm backdrop-blur-sm"
  >
    <h2 class="text-xl font-semibold text-slate-900 mb-2">Quiz complete</h2>
    <p class="text-lg text-slate-700 mb-8">
      You answered
      <span class="font-semibold tabular-nums text-slate-900">{{ score }}</span>
      out of
      <span class="font-semibold tabular-nums">{{ quizSize }}</span>
      questions correctly.
    </p>

    <div
      v-if="wrongAnswers.length === 0"
      class="mb-8 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-900"
    >
      You answered every question in this quiz correctly.
    </div>

    <div v-else class="mb-8 space-y-8">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Questions to review
      </h3>
      <WrongAnswerItem
        v-for="item in wrongAnswers"
        :key="item.id + '-' + item.selectedKey"
        :item="item"
      />
    </div>

    <button
      type="button"
      class="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
      @click="emit('end')"
    >
      End quiz
    </button>
  </section>
</template>
