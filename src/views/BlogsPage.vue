<template>
  <LayoutAuthenticated>
    <SectionMain class="p-6 mb-6">
      <div class="flex justify-end">
        <BaseButton color="contrast" label="Write Blog" @click="handleWriteBlogBtn"/>
      </div>
      <!-- Blog Section -->
      <BlogSection />
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import BlogSection from "@/components/BlogSection.vue"
import SectionMain from "@/components/SectionMain.vue"
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const handleWriteBlogBtn = ()=>{
  router.push("/blogs/write")
}
</script>

<style>
</style>