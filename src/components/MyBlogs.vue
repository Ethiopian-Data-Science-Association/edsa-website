<template>
    <div class="my-12">
      <h2 class="text-3xl font-bold text-center mb-8">My Blogs</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardBoxWidget
          v-if="blogs"
          v-for="(blog, index) in blogs"
          :key="blog.slug"
          :title="blog.title"
          :isPublished="blog.isPublished"
          :description="blog.content"
          :imageUrl="blog.coverImage || `/public/favicon.png`"
          :buttonUrl="`/edsa-website/blogs/${sanitizeUrl(blog.slug)}`"
          buttonColor="text-blue-500 dark:text-blue-400"
          buttonFontWeight="font-medium"
          buttonText="Read More"
        />
        <div
          v-if="!blogs"
          class="min-h-[460px] bg-gray-300 rounded-lg shadow-md overflow-hidden animate-pulse"
        >
          <div class="h-48 bg-gray-400"></div>
          <div class="p-4">
            <div class="h-6 bg-gray-400 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-400 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-400 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted } from 'vue';
  import { store } from '../store/index';
  import CardBoxWidget from './CardBoxWidget.vue';
  import {sanitizeUrl} from "../utils/sanitizeUrl.utils.js"
  import localforage from "localforage"
  
  const pageSize = 10
  
  const blogs = computed(() => store.state.blogs.blogs)
  
  const fetchBlogs = async (lastDoc = null) => {
    const { uid } = await localforage.getItem('user')
    await store.dispatch('blogs/getMyBlogs', { pageSize, lastDoc, uid })
  }
  
  onMounted(fetchBlogs)
  </script>
  
  <style scoped>
  /* Additional styles if necessary */
  </style>
  