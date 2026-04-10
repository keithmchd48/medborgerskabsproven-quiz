<script setup lang="ts">
import { useQuiz, QUIZ_SIZE } from '@/composables/useQuiz'
import AppHeader from '@/components/AppHeader.vue'
import QuizCategoryView from '@/components/QuizCategoryView.vue'
import QuizStartView from '@/components/QuizStartView.vue'
import QuizQuestionView from '@/components/QuizQuestionView.vue'
import QuizResultsView from '@/components/QuizResultsView.vue'
import AppFooter from '@/components/AppFooter.vue'

const {
  phase,
  selectedCategory,
  currentIndex,
  selectedKey,
  score,
  wrongAnswers,
  currentQuestion,
  selectCategory,
  goBackToCategories,
  startQuiz,
  nextQuestion,
  endQuiz,
} = useQuiz()
</script>

<template>
  <div class="min-h-dvh flex flex-col items-center px-4 py-10 sm:py-14">
    <AppHeader />

    <main class="w-full max-w-2xl flex-1 flex flex-col">
      <QuizCategoryView v-if="phase === 'home'" @select="selectCategory" />

      <QuizStartView
        v-else-if="phase === 'start' && selectedCategory"
        :quiz-size="QUIZ_SIZE"
        :category-label="selectedCategory.label"
        :category-description="selectedCategory.description"
        @start="startQuiz"
        @back="goBackToCategories"
      />

      <QuizQuestionView
        v-else-if="phase === 'quiz' && currentQuestion"
        v-model="selectedKey"
        :question="currentQuestion"
        :question-number="currentIndex + 1"
        :total-questions="QUIZ_SIZE"
        @next="nextQuestion"
      />

      <QuizResultsView
        v-else-if="phase === 'results'"
        :score="score"
        :quiz-size="QUIZ_SIZE"
        :wrong-answers="wrongAnswers"
        @end="endQuiz"
      />
    </main>

    <AppFooter />
  </div>
</template>
