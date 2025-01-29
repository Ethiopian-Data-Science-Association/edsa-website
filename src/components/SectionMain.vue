<script setup>
import { computed } from 'vue'
import { containerMaxW } from '@/config.js'
import { useDarkModeStore } from '@/pinia/darkMode.js'

// Define props
const props = defineProps({
  IsCustomized: {
    type: Boolean,
    required: false,
    default: false
  },
  customClass: {
    type: String,
    required: false,
    default: ''
  }
})

// Compute color class
const colorClass = computed(() => {
  return useDarkModeStore().isEnabled
    ? 'bg-gray-100 text-black dark:bg-slate-800 dark:text-white'
    : ''
})

// Compute final class string
const computedClass = computed(() => {
  return props.IsCustomized ? `${colorClass.value} ${props.customClass}`.trim() : `${containerMaxW} ${colorClass.value}`.trim()
})
</script>

<template>
  <section class="p-6" :class="computedClass">
    <slot />
  </section>
</template>