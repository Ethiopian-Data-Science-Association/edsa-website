<template>
  <LayoutAuthenticated>
    <div class="flex flex-col min-h-screen">
      <!-- Main Content -->
      <SectionMain class="flex-grow">
        <!-- Header with Title and Button -->
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold">Our Certifications</h2>
          <BaseButton
            v-if="isAdmin"
            label="Create"
            :icon="mdiPlus"
            color="success"
            class="rounded-full bg-green-500 text-white hover:bg-green-600"
            @click="goToCreatePage"
          />
          <BaseButton
            v-else
            label="My Certificates"
            :icon="mdiCertificate"
            color="primary"
            class="rounded-full bg-blue-500 text-white hover:bg-blue-600"
            @click="showMyCertificates"
          />
        </div>

        <!-- Certifications Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardBoxWidget
            v-for="(certification, index) in displayedCertifications"
            :key="certification.id"
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
    </div>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref } from 'vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionMain from '@/components/SectionMain.vue';
import CardBoxWidget from '@/components/CardBoxWidget.vue';
import BaseButton from '@/components/BaseButton.vue';
import { mdiPlus, mdiCertificate } from '@mdi/js';
import { useRouter } from 'vue-router';

// Mock user role
const isAdmin = true; // Set to true if the user is an admin

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

const myCertificates = ref([
  {
    id: "3",
    title: "Enrolled Certification 1",
    description: "Brief description for enrolled certification 1.",
    image: `${import.meta.env.VITE_BASE_URL}public/favicon.png`,
    link: "/edsa-website/certifications/enrolled/1"
  },
  {
    id: "4",
    title: "Enrolled Certification 2",
    description: "Brief description for enrolled certification 2.",
    image: `${import.meta.env.VITE_BASE_URL}public/favicon.png`,
    link: "/edsa-website/certifications/enrolled/2"
  },
]);

const displayedCertifications = ref(certifications.value);

const goToCreatePage = () => {
  router.push('/certification-create-form'); // Replace with the actual route for creating certifications
};

const showMyCertificates = () => {
  displayedCertifications.value = myCertificates.value;
};
</script>

<style scoped>
/* Ensure the footer stays visible without scrolling */
.min-h-screen {
  min-height: 100vh;
}

.bg-green-500 {
  background-color: #10b981;
}

.hover\:bg-green-600:hover {
  background-color: #059669;
}

.bg-blue-500 {
  background-color: #3b82f6;
}

.hover\:bg-blue-600:hover {
  background-color: #2563eb;
}
</style>
