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
      {{ blog.content }}
      <Markdown :source="blog.content" />
    </SectionMain>
  </LayoutAuthenticated>
</template>
  
  <script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '../store/index'
import Markdown from '@/components/Markdown.vue'
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
  