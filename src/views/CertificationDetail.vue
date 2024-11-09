<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <!-- Title and Action Icons -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-4xl font-bold">{{ certificationTitle }}</h2>
          <div class="flex space-x-2 ml-4">
            <button @click="navigateToEdit"
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
          <BaseButton v-if="certificateStatus !== ''" :label="certificateStatus" :icon="buttonIcon"
            :color="buttonColor" />
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

        <!-- Additional Registered Course Details -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800 dark:text-gray-200 mb-8">
          <div class="flex items-center">
            <span class="text-gray-500 mr-4">📅 Start Date:</span>
            <span class="font-medium">{{ startDate }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-gray-500 mr-4">👤 Provider:</span>
            <span class="font-medium">{{ providerName }}</span>
          </div>
          <div v-if="registrationStatus === ''" class="flex items-center">
            <span class="text-gray-500 mr-4">💰 Amount Due:</span>
            <span class="font-medium">{{ amountDue }}</span>
          </div>
        </div>

        <!-- Register and Download Syllabus Buttons -->
        <div class="flex justify-between">
          <BaseButton v-if="registrationStatus === ''"  @click="navigateToRegistration" label="Register Now" class="bg-green-500 text-white hover:bg-green-600" />
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
import { certification } from '@/shared/constants/certification';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionMain from '@/components/SectionMain.vue';
import BaseButton from '@/components/BaseButton.vue';
import { mdiPencil, mdiArchive, mdiCheckCircle, mdiAccountCircle } from '@mdi/js';

const route = useRoute();
const router = useRouter();
const certificationId = route.params.id;
const certificationTitle = ref('Certification 1');
const certificationDescription = ref('Detailed description of certification 1.');
const level = ref('Intermediate');
const duration = ref('7 hours 30 minutes');
const lastUpdated = ref('August 26, 2024');
const certificateInfo = ref('Certificate of completion');
const startDate = ref('September 1, 2024');
const providerName = ref('Provider XYZ');
const amountDue = ref('$200');

// Mock registration status: certification.CERTIFIED, certification.REGISTERED, or ""
const registrationStatus = ref("");

// Computed properties for BaseButton content
const certificateStatus = computed(() => {
  switch (registrationStatus.value) {
    case certification.CERTIFIED:
      return 'Certified';
    case certification.REGISTERED:
      return 'Registered';
    default:
      return '';
  }
});

const buttonColor = computed(() => {
  switch (registrationStatus.value) {
    case certification.CERTIFIED:
      return 'border-blue-600';
    case certification.REGISTERED:
      return 'border-green-600';
    default:
      return 'default';
  }
});

const buttonIcon = computed(() => {
  switch (registrationStatus.value) {
    case certification.CERTIFIED:
      return mdiCheckCircle; // Icon for Certified
    case certification.REGISTERED:
      return mdiAccountCircle; // Icon for Registered
    default:
      return null; // No icon for browsing
  }
});

// Function to navigate to the Edit Certification page
const navigateToEdit = () => {
  router.push({ name: 'certification-edit-form', params: { id: certificationId } });
};

const navigateToRegistration = () => {
  router.push({ name: 'certification-register-form', params: { id: certificationId } });
};

onMounted(() => {
  // Fetch data and set registration status here
});
</script>

<style scoped>
.text-2xl {
  font-size: 1.25rem;
}

.bg-green-500 {
  background-color: #10b981;
}

.hover\:bg-green-600:hover {
  background-color: #059669;
}
</style>
