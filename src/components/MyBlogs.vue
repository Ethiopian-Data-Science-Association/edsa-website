<template>
  <div class="my-12">
    <h2 class="text-3xl font-bold text-center mb-8">My Blogs</h2>

    <!-- Blogs Grid -->
    <div v-if="blogs.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <CardBoxWidget
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
    </div>

    <!-- Loading Skeleton -->
    <div
      v-if="isLoading"
      class="min-h-[460px] bg-gray-300 rounded-lg shadow-md overflow-hidden animate-pulse"
    >
      <div class="h-48 bg-gray-400"></div>
      <div class="p-4">
        <div class="h-6 bg-gray-400 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-400 rounded w-full mb-2"></div>
        <div class="h-4 bg-gray-400 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && blogs.length === 0" class="flex flex-col items-center text-center py-16">
      <img src="/public/favicon.png" alt="No blogs available" class="w-24 h-24 mb-4" />
      <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">You haven't created any blogs yet</p>
      <p class="text-gray-500 dark:text-gray-400">Start writing and share your knowledge with the community.</p>
      <BaseButton
        label="Create Blog"
        :icon="mdiPlus"
        color="success"
        class="mt-4 rounded-full bg-green-500 text-white hover:bg-green-600"
        @click="handleWriteBlogBtn"
      />
    </div>
  </div>
</template>

---

### **🔹 Script Section**
```vue
<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { store } from '../store/index';
import CardBoxWidget from './CardBoxWidget.vue';
import { sanitizeUrl } from "../utils/sanitizeUrl.utils.js";
import localforage from "localforage";
import BaseButton from '@/components/BaseButton.vue';
import { mdiPlus } from "@mdi/js";

const router = useRouter()
const pageSize = 10;
const blogs = computed(() => store.state.blogs.blogs);
const isLoading = ref(true);

// Fetch Blogs
const fetchBlogs = async (lastDoc = null) => {
  try {
    const userData = await localforage.getItem('user');
    if (userData && userData.uid) {
      await store.dispatch('blogs/getMyBlogs', { pageSize, lastDoc, uid: userData.uid });
    }
  } catch (error) {
    console.error("Error fetching user blogs:", error);
  } finally {
    isLoading.value = false;
  }
};

// Navigate to Blog Creation
const handleWriteBlogBtn = () => {
  router.push("/blogs/write")
}

// Fetch blogs on mount
onMounted(fetchBlogs);
</script>
