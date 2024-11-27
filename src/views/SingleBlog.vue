<template>
  <LayoutAuthenticated>
    <SectionMain class="mb-6 p-6">
      <h1 class="text-3xl font-bold mb-4">{{ blog.title }}</h1>
      <img
        v-if="blog.coverImage"
        :src="blog.coverImage"
        alt="Blog Image"
        class="w-full h-64 object-cover mb-4"
      />
      <div class= "dark:prose-invert prose-sm sm:prose-sm lg:prose-base xl:prose-lg focus:outline-none my-8 prose max-w-none text-gray-600 dark:text-slate-400" v-html="blog.content"></div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
  
  <script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '../store/index'
import 'markdown-it-vue/dist/markdown-it-vue.css'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'

const route = useRoute()

const blog = computed(() => store.state.blogs.singleBlog)

onMounted(async () => {
  const slug = route.params.id
  await store.dispatch('blogs/getSingleBlog', slug)
})
</script>
  