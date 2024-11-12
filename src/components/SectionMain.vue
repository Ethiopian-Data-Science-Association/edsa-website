<script setup>
import { computed } from 'vue'
import { containerMaxW } from '@/config.js'
import { useDarkModeStore } from '@/pinia/darkMode.js'

const colorClass = computed(() => {
  if (useDarkModeStore().isEnabled) {
    return 'bg-gray-100 text-black dark:bg-slate-800 dark:text-white'
  }
  return ''
})
</script>

<template>
  <section class="p-6" :class="containerMaxW +' '+ colorClass">
    <slot />
  </section>
</template>
