<script setup>
import CardBox from '@/components/CardBox.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import { mdiArrowRight } from '@mdi/js'

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  linkText: {
    type: String,
    default: 'Learn more'
  },
  linkUrl: {
    type: String,
    required: false
  },
  linkColor: {
    type: String,
    default: 'text-blue-600 dark:text-blue-400'
  },
  linkFontWeight: {
    type: String,
    default: 'font-bold'
  },
  buttonText: {
    type: String,
    default: null
  },
  buttonUrl: {
    type: String,
    required: false
  },
  buttonColor: {
    type: String,
    default: 'text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white'
  },
  buttonFontWeight: {
    type: String,
    default: 'font-bold'
  }
})
</script>

<template>
  <CardBox :no-padding="true">
    <div class="flex flex-col h-full">
      <!-- Image -->
      <img :src="imageUrl" alt="Card Image" class="rounded-t-3xl w-full h-48 object-cover" />

      <!-- Content -->
      <div class="p-4 flex flex-col flex-grow">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
          {{ title }}
        </h3>
        <p class="mt-2 mb-4 text-gray-600 dark:text-slate-400 flex-grow">
          {{ description }}
        </p>

        <!-- Conditional Rendering of Link or Button -->
        <div class="mt-auto">
          <a v-if="linkUrl" :href="linkUrl" :class="`${linkColor} ${linkFontWeight} flex items-center`">
            {{ linkText }}
            <BaseIcon :path="mdiArrowRight" class="ml-2 w-5 h-5" />
          </a>
          <a v-if="buttonUrl" :href="buttonUrl" :class="`${buttonColor} ${buttonFontWeight} block text-center px-4 py-2 mt-2 border-2 rounded-full transition`">
            {{ buttonText }}
          </a>
        </div>
      </div>
    </div>
  </CardBox>
</template>

<style scoped>
/* Ensure the CardBox has a border and rounded corners */
.CardBox {
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb; /* Tailwind's gray-200 color */
}

.dark .CardBox {
  border-color: #374151; /* Tailwind's gray-700 color for dark mode */
}
</style>
