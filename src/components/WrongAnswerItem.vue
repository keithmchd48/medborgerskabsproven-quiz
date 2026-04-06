<script setup lang="ts">
import type { AnsweredQuestion } from '@/types/question'
import { optionText } from '@/utils/question'

defineProps<{
  item: AnsweredQuestion
}>()
</script>

<template>
  <article class="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
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
</template>
