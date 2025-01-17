<template>
  <LayoutAuthenticated>
    <SectionMain class="mb-6 p-6">
      <h1 class="text-3xl font-bold mb-4">{{ blog.title }}</h1>
      <img v-if="blog.coverImage" :src="blog.coverImage" alt="Blog Image" class="w-full h-64 object-cover mb-4" />
      <div
        class="dark:prose-invert prose-sm sm:prose-sm lg:prose-base xl:prose-lg focus:outline-none my-8 prose max-w-none text-gray-600 dark:text-slate-400"
        v-html="sanitizedHtml"></div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
// import { store } from '../store/index'  <-- this one is better when you are at the *.module level
import { useStore } from 'vuex'; // <-- best practice on component level
import 'markdown-it-vue/dist/markdown-it-vue.css'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionMain from '@/components/SectionMain.vue'

// Imported here 
import DOMPurify from 'dompurify';

//Store setup 
const store = useStore()
const route = useRoute()

// variables 
const sanitizedHtml = ref(''); // Reactive reference for sanitized content
const slug = route.params.id; // Route parameter for the blog ID

// computed properties
const blog = computed(() => store.state.blogs.singleBlog); // Computed reference for reactivity

onMounted(async () => {
  await store.dispatch('blogs/getSingleBlog', slug);
})

// Watch for changes in blog content and sanitize it
watch(
  blog,
  (newBlog) => {
    if (newBlog?.content) {
      sanitizedHtml.value = DOMPurify.sanitize(newBlog.content);
    }
  },
  { immediate: true } // Ensures the watcher runs initially
);
</script>