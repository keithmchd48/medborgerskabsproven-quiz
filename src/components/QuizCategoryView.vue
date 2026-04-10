<script setup lang="ts">
import { QUIZ_CATEGORIES, type QuizCategoryId } from '@/config/quizCategories'

const emit = defineEmits<{
  select: [id: QuizCategoryId]
}>()
</script>

<template>
  <section
    class="flex flex-col flex-1 gap-6 rounded-2xl border border-slate-200/80 bg-white/90 p-8 sm:p-10 shadow-sm backdrop-blur-sm"
  >
    <div class="text-center">
      <h2 class="text-lg font-semibold text-slate-900 sm:text-xl">Choose a quiz</h2>
      <p class="mt-2 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
        Pick a category to see the start screen. More categories will be added later.
      </p>
    </div>

    <ul class="flex flex-col gap-3">
      <li v-for="cat in QUIZ_CATEGORIES" :key="cat.id">
        <button
          type="button"
          class="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          @click="emit('select', cat.id)"
        >
          <span class="block font-medium text-slate-900">{{ cat.label }}</span>
          <span class="mt-1 block text-sm text-slate-600 leading-relaxed">{{ cat.description }}</span>
        </button>
      </li>
    </ul>
  </section>
</template>
