<script setup lang="ts">
import type { OptionKey } from '@/types/question'
import type { Question } from '@/types/question'

const props = defineProps<{
  question: Question
  questionNumber: number
  totalQuestions: number
}>()

const selectedKey = defineModel<OptionKey | null>({ required: true })

const emit = defineEmits<{
  next: []
}>()

const isLast = () => props.questionNumber >= props.totalQuestions
</script>

<template>
  <section
    class="rounded-2xl border border-slate-200/80 bg-white/90 p-6 sm:p-8 shadow-sm backdrop-blur-sm"
  >
    <div class="mb-6 flex items-center justify-between gap-4 text-sm text-slate-500">
      <span class="font-medium text-slate-700"
        >Question {{ questionNumber }} of {{ totalQuestions }}</span
      >
      <span class="truncate text-xs sm:text-sm" :title="question.chapter">{{ question.chapter }}</span>
    </div>

    <h2 class="text-lg sm:text-xl font-medium text-slate-900 leading-snug mb-6">
      {{ question.question }}
    </h2>

    <fieldset class="space-y-3 border-0 p-0 m-0">
      <legend class="sr-only">Choose one answer</legend>
      <label
        v-for="opt in question.options"
        :key="opt.key"
        class="flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition has-[:checked]:border-slate-900 has-[:checked]:bg-slate-50 border-slate-200 hover:border-slate-300"
      >
        <input
          v-model="selectedKey"
          class="mt-1 h-4 w-4 shrink-0 border-slate-300 text-slate-900 focus:ring-slate-500"
          type="radio"
          :name="'q-' + question.id"
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
        @click="emit('next')"
      >
        {{ isLast() ? 'See results' : 'Next question' }}
      </button>
    </div>
  </section>
</template>
