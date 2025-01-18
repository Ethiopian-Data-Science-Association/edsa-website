<template>
  <LayoutAuthenticated>
    <SectionMain class="p-6 mb-6">
      <div class="flex justify-end">
        <BaseButton color="contrast" label="Write Blog" @click="handleWriteBlogBtn" />
      </div>
      <!-- Blog Section -->
      <BlogSection :isAdmin="isAdmin" />
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import BlogSection from "@/components/BlogSection.vue"
import SectionMain from "@/components/SectionMain.vue"
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { useRouter } from 'vue-router';
import { useStore } from "vuex";
import { roles } from "@/shared/constants/roles";
import { ref, computed, onMounted } from "vue";
import localforage from 'localforage'

const router = useRouter()
const store = useStore();
const isAdmin = ref(false);

onMounted(() => {
  fetchUserAcl();
});

const handleWriteBlogBtn = () => {
  router.push("/blogs/write")
}

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
    await store.dispatch('blogs/getBlogs', { pageSize: 10, lastDoc: null, isAdmin: isAdmin.value })
  })
} 
</script>

<style></style>