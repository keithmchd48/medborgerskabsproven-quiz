<script setup lang="ts">
defineProps<{
  quizSize: number
  categoryLabel: string
  categoryDescription: string
}>()

const emit = defineEmits<{
  start: []
  back: []
}>()
</script>

<template>
  <section
    class="flex flex-col items-center justify-center flex-1 gap-8 rounded-2xl border border-slate-200/80 bg-white/90 p-10 shadow-sm backdrop-blur-sm"
  >
    <button
      type="button"
      class="self-start -mt-2 text-sm font-medium text-slate-600 transition hover:text-slate-900 focus:outline-none focus-visible:underline"
      @click="emit('back')"
    >
      ← Choose another category
    </button>

    <div class="w-full text-center space-y-2">
      <p class="text-xs font-medium uppercase tracking-wide text-slate-500">Selected</p>
      <p class="text-lg font-semibold text-slate-900">{{ categoryLabel }}</p>
      <p class="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">{{ categoryDescription }}</p>
    </div>

    <p class="text-slate-600 text-center max-w-md leading-relaxed">
      Each quiz has {{ quizSize }} random questions from this category. Select one answer per
      question to continue. At the end you will see your score and a review of any mistakes.
    </p>
    <button
      type="button"
      class="rounded-xl bg-slate-900 px-8 py-3.5 text-base font-medium text-white shadow-md transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
      @click="emit('start')"
    >
      Start Quiz
    </button>
  </section>
</template>
