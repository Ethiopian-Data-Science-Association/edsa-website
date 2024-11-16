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
            class="rounded-full bg-green-500 text-white hover:bg-green-600 ml-12" 
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

        <!-- Certifications Grid or Empty State -->
        <div v-if="certifications.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardBoxWidget
            v-for="(certification, index) in certifications"
            :key="certification.id"
            :title="certification.title"
            :description="certification.description"
            :imageUrl="certification.image || 'favicon.png'"
            buttonColor="text-blue-500 dark:text-blue-400"
            buttonFontWeight="font-medium"
            buttonText="View Details"
            @click="viewCertificationDetail(certification)"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center text-center py-16">
          <img src="/public/favicon.png" alt="No certifications available" class="w-24 h-24 mb-4" />
          <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">No certifications available</p>
          <p class="text-gray-500 dark:text-gray-400">Check back later or add a new certification.</p>
          <BaseButton
            v-if="isAdmin"
            label="Create Certification"
            :icon="mdiPlus"
            color="success"
            class="mt-4 rounded-full bg-green-500 text-white hover:bg-green-600"
            @click="goToCreatePage"
          />
        </div>

      </SectionMain>
    </div>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref , onMounted} from 'vue';
import { useStore } from 'vuex';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionMain from '@/components/SectionMain.vue';
import CardBoxWidget from '@/components/CardBoxWidget.vue';
import BaseButton from '@/components/BaseButton.vue';
import { mdiPlus, mdiCertificate } from '@mdi/js';
import { useRouter } from 'vue-router';

// Mock user role
const isAdmin = true; // Set to true if the user is an admin

const router = useRouter();

const store = useStore();

const certifications = ref([]);

const myCertificates = ref([]);


onMounted(async () => {
  await store.dispatch('certification/fetchCertifications');
  certifications.value = store.state.certification?.certifications || [];
  //TODO:: Logic to set myCertificates if needed
});

const displayedCertifications = ref(certifications.value);

const goToCreatePage = () => {
  router.push('/certification-create-form'); // Replace with the actual route for creating certifications
};

const showMyCertificates = () => {
  displayedCertifications.value = myCertificates.value;
};

const viewCertificationDetail = (certification) => {
  router.push({ name: 'certification-detail', params: { id: certification.id } });
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
