<script setup>
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionMain from '@/components/SectionMain.vue';
import BaseButton from '@/components/BaseButton.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const certificationTitle = route.params.title || 'Certification Title';
const certificationDescription = "Full detailed description of the certification. This will include objectives, requirements, content covered, and any other relevant details.";
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-bold text-center mb-6">{{ certificationTitle }}</h2>
        <img src="/public/favicon.png" alt="Certification Image" class="w-full h-64 object-cover mb-6 rounded-lg"/>
        <p class="text-lg text-gray-700 dark:text-gray-300 mb-8">{{ certificationDescription }}</p>
        <div class="flex justify-center">
          <BaseButton href="/register" label="Register Now" color="primary" />
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
