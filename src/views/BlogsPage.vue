<template>
  <LayoutAuthenticated>
    <SectionMain class="p-6 mb-6">
      <!-- Blog Section -->
      <BlogSection />
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import BlogSection from '@/components/BlogSection.vue'
import SectionMain from "@/components/SectionMain.vue"
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
</script>

<style>
</style>