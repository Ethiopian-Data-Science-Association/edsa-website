<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseButton from '@/components/BaseButton.vue';
import { mdiArrowLeft } from '@mdi/js';
import dayjs from 'dayjs';

// Mock function to fetch certification data (replace with actual API call)
const fetchCertificationData = async (id) => {
  return {
    title: `Certification ${id}`,
    description: `Detailed description of certification ${id}.`,
    rating: 4,
    level: 'Intermediate',
    isActive: true,
    duration: '02:30', // Duration in HH:mm format
    startDate: '2024-08-26T08:30',
    lastUpdated: '2024-08-26T08:30',
    courseProvider: 'Provider Name',
    amountDue: 100,
  };
};

// Router setup
const route = useRoute();
const router = useRouter();
const certificationId = route.params.id;

// Form state
const certificationTitle = ref('');
const certificationDescription = ref('');
const certificationRating = ref(0);
const certificationLevel = ref('Intermediate');
const isActive = ref(false);
const duration = ref('');
const startDate = ref('');
const lastUpdated = ref('');
const courseProvider = ref('');
const amountDue = ref(0);

// Fetch and populate the form with existing data on component mount
onMounted(async () => {
  const data = await fetchCertificationData(certificationId);
  certificationTitle.value = data.title;
  certificationDescription.value = data.description;
  certificationRating.value = data.rating;
  certificationLevel.value = data.level;
  isActive.value = data.isActive;
  duration.value = data.duration;
  startDate.value = data.startDate;
  lastUpdated.value = data.lastUpdated;
  courseProvider.value = data.courseProvider;
  amountDue.value = data.amountDue;
});

const saveChanges = () => {
  // Handle save functionality (e.g., submit data to backend)
  console.log('Saving changes:', {
    certificationTitle: certificationTitle.value,
    certificationDescription: certificationDescription.value,
    certificationRating: certificationRating.value,
    certificationLevel: certificationLevel.value,
    isActive: isActive.value,
    duration: duration.value,
    startDate: startDate.value,
    lastUpdated: lastUpdated.value,
    courseProvider: courseProvider.value,
    amountDue: amountDue.value,
  });
};

const goBack = () => {
  router.push('/certifications');
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Edit Certification</h1>
      <BaseButton :icon="mdiArrowLeft" label="Back to Certifications" @click="goBack" color="contrast" />
    </div>

    <form @submit.prevent="saveChanges">
      <div class="mb-4">
        <label class="block font-medium mb-1">Certification Title</label>
        <input v-model="certificationTitle" type="text" class="w-full p-2 border rounded" placeholder="Enter certification title" />
      </div>

      <div class="mb-4">
        <label class="block font-medium mb-1">Certification Description</label>
        <textarea v-model="certificationDescription" class="w-full p-2 border rounded" placeholder="Enter certification description"></textarea>
      </div>

      <div class="mb-4">
        <label class="block font-medium mb-1">Certification Rating</label>
        <input v-model="certificationRating" type="number" class="w-full p-2 border rounded" min="1" max="5" placeholder="Enter rating (1-5)" />
      </div>

      <div class="mb-4">
        <label class="block font-medium mb-1">Certification Level</label>
        <select v-model="certificationLevel" class="w-full p-2 border rounded">
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block font-medium mb-1">Active Status</label>
        <input v-model="isActive" type="checkbox" class="mr-2" /> Active
      </div>

      <!-- Duration Field with dayjs Formatting -->
      <div class="mb-4">
        <label class="block font-medium mb-1">Duration (HH:mm)</label>
        <input
          v-model="duration"
          type="time"
          class="w-full p-2 border rounded"
          placeholder="Enter duration in HH:mm"
        />
      </div>

      <div class="mb-4">
        <label class="block font-medium mb-1">Start Date & Time</label>
        <input v-model="startDate" type="datetime-local" class="w-full p-2 border rounded" />
      </div>

      <div class="mb-4">
        <label class="block font-medium mb-1">Last Updated Date & Time</label>
        <input v-model="lastUpdated" type="datetime-local" class="w-full p-2 border rounded" />
      </div>

      <div class="mb-4">
        <label class="block font-medium mb-1">Course Provider</label>
        <input v-model="courseProvider" type="text" class="w-full p-2 border rounded" placeholder="Enter course provider name" />
      </div>

      <div class="mb-4">
        <label class="block font-medium mb-1">Amount Due</label>
        <input v-model="amountDue" type="number" class="w-full p-2 border rounded" placeholder="Enter amount due" />
      </div>

      <div class="flex justify-end mt-6">
        <BaseButton label="Save Changes" color="primary" />
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Styling for form */
.w-full {
  width: 100%;
}
</style>
