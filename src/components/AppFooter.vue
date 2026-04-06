<script setup lang="ts">
const version = import.meta.env.VITE_APP_VERSION
</script>

<template>
  <footer class="mt-auto pt-10 text-center text-xs text-slate-400 tabular-nums">
    v{{ version }}
  </footer>
</template>
