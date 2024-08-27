<script setup>
import { ref } from 'vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionMain from '@/components/SectionMain.vue';
import CardBoxWidget from '@/components/CardBoxWidget.vue';

const certifications = ref([
  { 
    id: 1,
    title: "Certification 1",
    description: "Brief description for certification 1.",
    image: "/public/favicon.png",
    link: "/certifications/certification-1"
  },
  {
    id:2,
    title: "Certification 2",
    description: "Brief description for certification 2.",
    image: "/public/favicon.png",
    link: "/certifications/certification-2"
  },
  // Add more certifications as needed
]);
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <h2 class="text-3xl font-bold text-center mb-8">Our Certifications</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <CardBoxWidget
          v-for="(certification, index) in certifications"
          :key="index"
          :title="certification.title"
          :description="certification.description"
          :imageUrl="certification.image"
          :buttonUrl="certification.link"
          buttonColor="text-blue-500 dark:text-blue-400"
          buttonFontWeight="font-medium"
          buttonText="View Details"
        />
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
