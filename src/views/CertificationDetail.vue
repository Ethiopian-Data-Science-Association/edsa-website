<script setup>
import { ref, onMounted } from 'vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionMain from '@/components/SectionMain.vue';
import BaseButton from '@/components/BaseButton.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const certificationId = route.params.id;
const certificationTitle = ref('');
const certificationDescription = ref('');
const level = ref('Intermediate');
const duration = ref('7 hours 30 minutes');
const lastUpdated = ref('August 26, 2024');
const certificateInfo = ref('Certificate of completion');

// Simulating data fetch (replace with Firebase logic)
const fetchCertificationData = async (id) => {
  // Placeholder data fetch - replace with Firebase API call
  const data = {
    title: `Certification ${id}`,
    description: `Detailed description of certification ${id}.`,
  };
  certificationTitle.value = data.title;
  certificationDescription.value = data.description;
};

onMounted(() => {
  fetchCertificationData(certificationId);
});
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <!-- Title and Image -->
        <h2 class="text-4xl font-bold text-center mb-4">{{ certificationTitle }}</h2>
        <img src="/public/favicon.png" alt="Certification Image" class="w-full h-64 object-cover mb-6 rounded-lg" />

        <!-- Description -->
        <p class="text-lg text-gray-700 dark:text-gray-300 mb-8">{{ certificationDescription }}</p>

        <!-- Rating and Action Buttons -->
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center text-yellow-400">
            <span class="text-2xl">&#9733;</span>
            <span class="text-2xl">&#9733;</span>
            <span class="text-2xl">&#9733;</span>
            <span class="text-2xl">&#9733;</span>
            <span class="text-2xl">&#9733;</span>
            <span class="text-gray-500 ml-2">(0 Ratings)</span>
          </div>
          <BaseButton href="/cart" label="View Cart" color="contrast" />
        </div>

        <!-- Certification Details -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800 dark:text-gray-200 mb-8">
          <div class="flex items-center">
            <span class="text-gray-500 mr-4">📊 Level:</span>
            <span class="font-medium">{{ level }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-gray-500 mr-4">⏱️ Duration:</span>
            <span class="font-medium">{{ duration }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-gray-500 mr-4">🗓️ Last Updated:</span>
            <span class="font-medium">{{ lastUpdated }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-gray-500 mr-4">📜 Certificate:</span>
            <span class="font-medium">{{ certificateInfo }}</span>
          </div>
        </div>

        <!-- Register and Download Syllabus Buttons -->
        <div class="flex justify-between">
          <BaseButton href="/register" label="Register Now" color="primary" />
          <a
            href="/path/to/syllabus.pdf"
            download="Syllabus_DLDC2024"
            class="text-blue-600 dark:text-blue-400 font-medium border border-blue-600 dark:border-blue-400 py-2 px-4 rounded hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-white transition"
          >
            Download Syllabus
          </a>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<style scoped>
.text-2xl {
  font-size: 1.25rem;
}
</style>
