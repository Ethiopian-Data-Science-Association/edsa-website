<template>
  <div class="my-12">
    <h2 class="text-3xl font-bold text-center mb-8">Latest from our Blogs</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <CardBoxWidget
        v-for="(blog, index) in blogs"
        v-if="blogs"
        :key="blog.slug"
        :title="blog.title"
        :description="blog.content"
        :imageUrl="blog.coverImage || `/public/favicon.png`"
        :buttonUrl="`/edsa-website/blogs/${sanitizeUrl(blog.slug)}`"
        buttonColor="text-blue-500 dark:text-blue-400"
        buttonFontWeight="font-medium"
        buttonText="Read More"
        :is-admin="isAdmin"
        :blog-data="blog"
        :is-published="blog.isPublished"
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
import { computed } from 'vue';
import { useStore } from "vuex";
import CardBoxWidget from './CardBoxWidget.vue';
import {sanitizeUrl} from "../utils/sanitizeUrl.utils.js";

const store = useStore();

const props = defineProps({
  isAdmin: {
    type: Boolean,
    required: false,
    default: false
  },
});

const blogs = computed(() => store.state.blogs.blogs)

</script> 
