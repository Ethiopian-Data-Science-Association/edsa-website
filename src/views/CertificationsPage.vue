<template>
  <LayoutAuthenticated>
    <div class="flex flex-col min-h-screen">
      <!-- Main Content -->
      <SectionMain class="flex-grow">
        <!-- Header with Title and Create Button -->
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold">Our Certifications</h2>
          <BaseButton label="Create" :icon="mdiPlus" color="success"
            class="rounded-full bg-green-500 text-white hover:bg-green-600" @click="goToCreatePage" />
        </div>

        <!-- Certifications Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardBoxWidget v-for="(certification, index) in certifications" :key="certification.id"
            :title="certification.title" :description="certification.description" :imageUrl="certification.image"
            :buttonUrl="certification.link" buttonColor="text-blue-500 dark:text-blue-400"
            buttonFontWeight="font-medium" buttonText="View Details" />
        </div>
      </SectionMain>
    </div>
  </LayoutAuthenticated>
</template>
<script setup>
import { ref } from 'vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionMain from '@/components/SectionMain.vue';
import CardBoxWidget from '@/components/CardBoxWidget.vue';
import BaseButton from '@/components/BaseButton.vue';
import { mdiPlus } from '@mdi/js';
import { useRouter } from 'vue-router';

const router = useRouter();

const certifications = ref([
  {
    id: "1",
    title: "Certification 1",
    description: "Brief description for certification 1.",
    image: `${import.meta.env.VITE_BASE_URL}public/favicon.png`,
    link: "/edsa-website/certifications/1"
  },
  {
    id: "2",
    title: "Certification 2",
    description: "Brief description for certification 2.",
    image: `${import.meta.env.VITE_BASE_URL}public/favicon.png`,
    link: "/edsa-website/certifications/2"
  },
]);

const goToCreatePage = () => {
  router.push('certification-create-form'); // Replace with the actual route for creating certifications
};
</script>



<style scoped>
/* Ensure the footer stays visible without scrolling */
.min-h-screen {
  min-height: 100vh;
}

.bg-green-500 {
  background-color: #10b981;
  /* Adjust green color as needed */
}

.hover\:bg-green-600:hover {
  background-color: #059669;
  /* Darker shade for hover */
}
</style>