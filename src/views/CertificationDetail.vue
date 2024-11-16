<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div class="max-w-5xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <!-- Title and Action Icons -->
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-4xl font-bold">{{ certification.title }}</h2>
          <div class="flex space-x-2 ml-4">
            <button @click="navigateToEdit"
              class="flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
              <BaseIcon :path="mdiPencil" />
            </button>
            <button
              class="flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white">
              <BaseIcon :path="mdiArchive" />
            </button>
          </div>
        </div>

        <!-- Image -->
        <img :src="certification.imageUrl || '/public/favicon.png'" alt="Certification Image"
          class="w-full h-64 object-cover mb-6 rounded-lg" />

        <!-- Description -->
        <p class="text-lg text-gray-700 dark:text-gray-300 mb-8">{{ certification.description }}</p>

        <!-- Rating and Action Buttons -->
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center text-yellow-400">
            <span class="text-2xl">&#9733;</span>
            <span class="text-2xl">&#9733;</span>
            <span class="text-2xl">&#9733;</span>
            <span class="text-2xl">&#9733;</span>
            <span class="text-2xl">&#9733;</span>
            <span class="text-gray-500 ml-2">({{ certification.rating || 0 }} Ratings)</span>
          </div>
          <BaseButton v-if="certificateStatus !== ''" :label="certificateStatus" :icon="buttonIcon"
            :color="buttonColor" />
        </div>

        <!-- Certification Details -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800 dark:text-gray-200 mb-8">
          <div class="flex items-center">
            <span class="text-gray-500 mr-4">📊 Level:</span>
            <span class="font-medium">{{ certification.level }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-gray-500 mr-4">⏱️ Duration:</span>
            <span class="font-medium">{{ certification.duration }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-gray-500 mr-4">📜 Certificate:</span>
            <span class="font-medium">{{ certification.certificateInfo }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-gray-500 mr-4">🗓️ Last Updated:</span>
            <span class="font-medium">{{ certification.endDateTime }}</span>
          </div>
        </div>

        <!-- Additional Registered Course Details -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-800 dark:text-gray-200 mb-8">
          <div class="flex items-center">
            <span class="text-gray-500 mr-4">📅 Start Date:</span>
            <span class="font-medium">{{ certification.startDate }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-gray-500 mr-4">👤 Provider:</span>
            <span class="font-medium">{{ certification.providerName }}</span>
          </div>
          <div v-if="registrationStatus === ''" class="flex items-center">
            <span class="text-gray-500 mr-4">💰 Amount Due:</span>
            <span class="font-medium">{{ certification.amountDue }}</span>
          </div>
        </div>

        <!-- Register and Download Syllabus Buttons -->
        <div class="flex justify-between">
          <BaseButton v-if="registrationStatus === ''" @click="navigateToRegistration" label="Register Now"
            class="bg-green-500 text-white hover:bg-green-600" />
          <a :href="certification.syllabusUrl" download="Syllabus_DLDC2024"
            class="text-blue-600 dark:text-blue-400 font-medium border border-blue-600 dark:border-blue-400 py-2 px-4 rounded hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-white transition">
            Download Syllabus
          </a>
        </div>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionMain from '@/components/SectionMain.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseIcon from '@/components/BaseIcon.vue';
import { formatFirestoreTimestamp } from '@/utils/parseDateTime';
import { mdiPencil, mdiArchive, mdiCheckCircle, mdiAccountCircle } from '@mdi/js';
import { certification as certificationConstants } from '@/shared/constants/certification';

const route = useRoute();
const router = useRouter();
const store = useStore();
const certificationId = route.params.id;

const certification = ref({
  title: '',
  description: '',
  level: '',
  duration: '',
  endDateTime: '',
  certificateInfo: 'Certificate of completion',
  startDate: '',
  providerName: '',
  amountDue: '',
  rating: 0,
  syllabusUrl: '',
  imageUrl: ''
});

const registrationStatus = ref('');

// Computed properties for BaseButton content
const certificateStatus = computed(() => {
  switch (registrationStatus.value) {
    case certificationConstants.CERTIFIED:
      return 'Certified';
    case certificationConstants.REGISTERED:
      return 'Registered';
    default:
      return '';
  }
});

const buttonColor = computed(() => {
  switch (registrationStatus.value) {
    case certificationConstants.CERTIFIED:
      return 'border-blue-600';
    case certificationConstants.REGISTERED:
      return 'border-green-600';
    default:
      return 'default';
  }
});

const buttonIcon = computed(() => {
  switch (registrationStatus.value) {
    case certificationConstants.CERTIFIED:
      return mdiCheckCircle;
    case certificationConstants.REGISTERED:
      return mdiAccountCircle;
    default:
      return null;
  }
});

const navigateToEdit = () => {
  router.push({ name: 'certification-edit-form', params: { id: certificationId } });
};

const navigateToRegistration = () => {
  router.push({ name: 'certification-register-form', params: { id: certificationId } });
};

onMounted(async () => {
  // Fetch the certification details based on certificationId
  await store.dispatch('certification/fetchCertification', certificationId);
  const { certificationData } = store.state.certification;// certificationData;
  console.log(certificationData)
  // Set the certification data
  certification.value = {
    title: certificationData.title,
    description: certificationData.description,
    level: certificationData.level,
    duration: certificationData.duration,
    endDateTime: formatFirestoreTimestamp(certificationData.endDateTime) || '',
    certificateInfo: certificationData.certificateInfo,
    startDate: formatFirestoreTimestamp(certificationData.startDateTime) || '',
    providerName: certificationData.instructorName,
    amountDue: certificationData.amountDue,
    rating: certificationData.rating,
    syllabusUrl: certificationData.syllabusUrl,
    imageUrl: certificationData.imageUrl
  };

  registrationStatus.value = certificationData.registrationStatus || '';
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
