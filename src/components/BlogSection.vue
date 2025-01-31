<template>
  <div class="my-12">
    <h2 class="text-3xl font-bold text-center mb-8">Latest from our Blogs</h2>

    <!-- Blog Grid -->
    <div v-if="blogs.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <CardBoxWidget v-for="(blog, index) in blogs" :key="blog.slug" :title="blog.title" :description="blog.content"
        :imageUrl="blog.coverImage || favicon"
        :buttonUrl="`/edsa-website/blogs/${sanitizeUrl(blog.slug)}`" buttonColor="text-blue-500 dark:text-blue-400"
        buttonFontWeight="font-medium" buttonText="Read More" :is-admin="isAdmin" :blog-data="blog"
        :is-published="blog.isPublished" />
    </div>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="min-h-[460px] bg-gray-300 rounded-lg shadow-md overflow-hidden animate-pulse">
      <div class="h-48 bg-gray-400"></div>
      <div class="p-4">
        <div class="h-6 bg-gray-400 rounded w-3/4 mb-2"></div>
        <div class="h-4 bg-gray-400 rounded w-full mb-2"></div>
        <div class="h-4 bg-gray-400 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!isLoading && blogs.length === 0" class="flex flex-col items-center text-center py-16">
      <img :src="favicon" alt="No blogs available" class="w-24 h-24 mb-4" />
      <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">No blogs available</p>
      <p class="text-gray-500 dark:text-gray-400">Check back later or create a new blog post.</p>
      <BaseButton v-if="isAdmin" label="Add Blog" :icon="mdiPlus" color="success"
        class="mt-4 rounded-full bg-green-500 text-white hover:bg-green-600" @click="handleWriteBlogBtn" />
    </div>
  </div>
</template>

<script setup>
import { roles } from "@/shared/constants/roles";
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from "vuex";
import CardBoxWidget from './CardBoxWidget.vue';
import { sanitizeUrl } from "../utils/sanitizeUrl.utils.js";
import BaseButton from '@/components/BaseButton.vue';
import { mdiPlus } from "@mdi/js";
import localforage from "localforage";
import favicon from '@/assets/favicon.png';


const router = useRouter()

const store = useStore();

const props = defineProps({
  isAdmin: {
    type: Boolean,
    required: false,
    default: false
  },
});

const isAdmin = ref(false);
const blogs = computed(() => store.state.blogs.blogs);
const isLoading = ref(true);


// Navigate to Blog Creation
const handleWriteBlogBtn = () => {
  router.push("/blogs/write")
}

// Fetch user 
const fetchUser = async () => {
  try {
    const userData = await localforage.getItem('user')
    if (userData && userData.uid) {
      await store.dispatch('user/getUser', userData.uid)
    } else {
      console.error('User data not found in local storage.')
    }
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}

const fetchUserAcl = async () => {
  await fetchUser().then(async () => {
    const user = computed(() => store.getters['user/userData']);
    if (user) {
      const userAcl = await store.dispatch('user/getUserAcl', user.value)
      isAdmin.value = (userAcl === roles.ADMIN ? true : false);
    }
  }).then(async () => {
    isLoading.value = true;
    await store.dispatch('blogs/getBlogs', { pageSize: 10, lastDoc: null, isAdmin: isAdmin.value })
    isLoading.value = false;
  })
}

// Fetch blogs on mount
onMounted(async () => {
  await fetchUserAcl(); // we ought to know if the user is an ADMIN 
});
</script>
