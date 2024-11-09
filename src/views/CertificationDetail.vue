<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <!-- Title and Action Icons -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-4xl font-bold">{{ certificationTitle }}</h2>
          <div class="flex space-x-2 ml-4">
            <button
              class="flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
              <svg :width="24" :height="24">
                <path :d="mdiPencil" />
              </svg>
            </button>
            <button
              class="flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
              <svg :width="24" :height="24">
                <path :d="mdiArchive" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Image -->
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
          <BaseButton href="/register" label="Register Now" class="bg-green-500 text-white hover:bg-green-600" />
          <a href="/path/to/syllabus.pdf" download="Syllabus_DLDC2024"
            class="text-blue-600 dark:text-blue-400 font-medium border border-blue-600 dark:border-blue-400 py-2 px-4 rounded hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-white transition">
            Download Syllabus
          </a>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionMain from '@/components/SectionMain.vue';
import BaseButton from '@/components/BaseButton.vue';
import { mdiPencil, mdiArchive } from '@mdi/js';
import { useRoute } from 'vue-router';

const route = useRoute();
const certificationId = route.params.id;
const certificationTitle = ref('');
const certificationDescription = ref('');
const level = ref('Intermediate');
const duration = ref('7 hours 30 minutes');
const lastUpdated = ref('August 26, 2024');
const certificateInfo = ref('Certificate of completion');

const fetchCertificationData = async (id) => {
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


<style scoped>
.text-2xl {
  font-size: 1.25rem;
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
