<template>
  <LayoutAuthenticated>
    <div class="flex flex-col min-h-screen">
      <!-- Main Content -->
      <SectionMain class="flex-grow">
        <!-- Header with Title and Button -->
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold">Our Certifications</h2>
          <BaseButton v-if="isAdmin" label="Create" :icon="mdiPlus" color="success"
            class="rounded-full bg-green-500 text-white hover:bg-green-600 ml-12" @click="goToCreatePage" />
          <BaseButton :label="isShowingAll ? 'My Certificates' : 'All Certifications'" :icon="mdiCertificate"
            color="primary" class="rounded-full bg-blue-500 text-white hover:bg-blue-600"
            @click="toggleCertifications" />
        </div>

        <!-- Certifications Grid or Empty State -->
        <div v-if="displayedCertifications.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardBoxWidget v-for="(certification, index) in displayedCertifications" :key="certification.id"
            :title="certification.title" :description="certification.description"
            :imageUrl="certification.image || favicon" buttonColor="text-blue-500 dark:text-blue-400"
            buttonFontWeight="font-medium" buttonText="View Details" @click="viewCertificationDetail(certification)" />
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center text-center py-16">
          <img :src="favicon" alt="No certifications available" class="w-24 h-24 mb-4" />
          <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">No certifications available</p>
          <p class="text-gray-500 dark:text-gray-400">Check back later or enroll in a certification program.</p>
          <BaseButton v-if="isAdmin" label="Create Certification" :icon="mdiPlus" color="success"
            class="mt-4 rounded-full bg-green-500 text-white hover:bg-green-600" @click="goToCreatePage" />
        </div>
      </SectionMain>
    </div>
  </LayoutAuthenticated>
</template>

<script setup>
import favicon from '@/assets/favicon.png';
import { ref, computed, onMounted } from 'vue';
import { roles } from "@/shared/constants/roles";
import { useStore } from 'vuex';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import SectionMain from '@/components/SectionMain.vue';
import CardBoxWidget from '@/components/CardBoxWidget.vue';
import BaseButton from '@/components/BaseButton.vue';
import { mdiPlus, mdiCertificate } from '@mdi/js';
import { useRouter } from 'vue-router';
import localforage from 'localforage';

const isAdmin = ref(false); // Assume admin status for demonstration
const router = useRouter();
const store = useStore();

const certifications = ref([]);
const myCertificates = ref([]);
const displayedCertifications = ref([]);
const isShowingAll = ref(true);

const fetchUserCertifications = async () => {
  try {
    // Fetch user data from local storage
    const { uid } = await localforage.getItem('user');
    await store.dispatch('user/getUser', uid);
    const userData = store.state.user.userData;

    if (userData && userData.certifications?.length > 0) {
      const userCertificationIds = userData.certifications.map((cert) => cert.cid);
      // Fetch certifications based on user certification IDs
      await store.dispatch('certification/fetchCertificationsByIds', userCertificationIds);
      myCertificates.value = store.state.certification.certifications;
    } else {
      myCertificates.value = [];
    }
  } catch (error) {
    console.error('Error fetching user certifications:', error);
    myCertificates.value = [];
  }
};

// Fetch user 
const fetchUser = async () => {
  try {
    const userData = await localforage.getItem('user')
    if (userData && userData.uid) {
      await store.dispatch('user/getUser', userData.uid)
    } else {
      console.error('User data not found in local storage.')
    }
  } catch (error) {
    console.error('Error fetching user:', error)
  }
};

// Fetch the User ACL
const fetchUserAcl = async () => {
  await fetchUser().then(async () => {
    const user = computed(() => store.getters['user/userData']);
    if (user) {
      const userAcl = await store.dispatch('user/getUserAcl', user.value)
      isAdmin.value = (userAcl === roles.ADMIN ? true : false);
    }
  })
};

onMounted(async () => {
  await fetchUserAcl(); // we ought to know if the user is an ADMIN 
  await store.dispatch('certification/fetchCertifications');
  certifications.value = store.state.certification.certifications || [];
  displayedCertifications.value = certifications.value; // Show all certifications by default
});

const goToCreatePage = () => {
  router.push('/certification-create-form');
};

const toggleCertifications = async () => {
  if (isShowingAll.value) {
    // Show only "My Certifications"
    if (!myCertificates.value.length) {
      await fetchUserCertifications();
    }
    displayedCertifications.value = myCertificates.value;
  } else {
    // Show "All Certifications"
    displayedCertifications.value = certifications.value;
  }
  isShowingAll.value = !isShowingAll.value; // Toggle the state
};

const viewCertificationDetail = (certification) => {
  router.push({ name: 'certification-detail', params: { id: certification.id } });
};
</script>

<style scoped>
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
