<script setup lang="ts">
defineProps<{
  quizSize: number
}>()

const emit = defineEmits<{
  start: []
}>()
</script>

<template>
  <section
    class="flex flex-col items-center justify-center flex-1 gap-8 rounded-2xl border border-slate-200/80 bg-white/90 p-10 shadow-sm backdrop-blur-sm"
  >
    <p class="text-slate-600 text-center max-w-md leading-relaxed">
      Each quiz has {{ quizSize }} random questions from the full bank. Select one answer per
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
