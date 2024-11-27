<template>
  <span class="inline-flex justify-center items-center h-6 w-6 text-gray-500 dark:text-slate-400">
    <svg viewBox="0 0 24 24" :width="16" :height="16" class="inline-block">
      <path fill="currentColor" :d="icon" />
    </svg>
  </span>
</template>
<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  }
})
</script>