<script setup>
import { ref, computed } from 'vue'
import CardBox from '@/components/CardBox.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import { mdiArrowRight, mdiTrendingUp } from '@mdi/js'
import PillTag from '@/components/PillTag.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  isPublished: {
    type: Boolean,
    required: false
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
const pillsSettingsModel = ref(['icon'])

const pillsOutline = computed(() => pillsSettingsModel.value.indexOf('outline') > -1)

const pillsSmall = computed(() => pillsSettingsModel.value.indexOf('small') > -1)

const pillsIcon = computed(() =>
  pillsSettingsModel.value.indexOf('icon') > -1 ? mdiTrendingUp : null
)
</script>

<template>
  <CardBox :no-padding="true">
    <div class="flex justify-end p-2">
      <PillTag v-if="!isPublished" color="warning" label="pending" :small="pillsSmall" :outline="pillsOutline"
        :icon="pillsIcon" />
      <PillTag v-if="isPublished" color="success" label="Published" :small="pillsSmall" :outline="pillsOutline"
        :icon="pillsIcon" />
    </div>

    <div class="flex flex-col h-full">
      <!-- Image -->
      <img :src="imageUrl" alt="Card Image" class="rounded-t-3xl w-full h-48 object-cover" />

      <!-- Content -->
      <div class="p-4 flex flex-col flex-grow min-h-[200px]">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
          {{ title }}
        </h3>
        <p class="mt-2 mb-4 text-gray-600 dark:text-slate-400 flex-grow max-h-48 overflow-clip text-ellipsis prose max-w-none dark:prose-invert prose-sm sm:prose-sm lg:prose-base xl:prose-lg focus:outline-none"
          v-html="description"></p>

        <!-- Conditional Rendering of Link or Button -->
        <div class="mt-auto mt-[-.125rem]">
          <a v-if="linkUrl" :href="linkUrl" :class="`${linkColor} ${linkFontWeight} flex items-center`">
            {{ linkText }}
            <BaseIcon :path="mdiArrowRight" class="ml-2 w-5 h-5" />
          </a>
          <a v-if="buttonUrl || buttonText" :href="buttonUrl"
            :class="`${buttonColor} ${buttonFontWeight} block text-center px-4 py-2 mt-2 border-2 rounded-full transition cursor-pointer`">
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
  border: 1px solid #e5e7eb;
  /* Tailwind's gray-200 color */
}

.dark .CardBox {
  border-color: #374151;
  /* Tailwind's gray-700 color for dark mode */
}
</style>
