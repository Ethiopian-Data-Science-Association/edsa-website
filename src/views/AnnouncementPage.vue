<template>
  <LayoutAuthenticated>
    <div class="flex flex-col min-h-screen">
      <!-- Main Content -->
      <SectionMain class="flex-grow">
        <!-- Header with Title and Button -->
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold">Announcements</h1>
          <BaseButton v-if="isAdmin" label="Add Announcement" :icon="mdiPlus" color="success"
            class="rounded-full bg-green-500 text-white hover:bg-green-600 ml-12" @click="navigateToCreatePage" />
        </div>

        <!-- Category Filter Pills -->
        <div class="flex justify-center mb-6 space-x-4 cursor-pointer">
          <PillTag v-for="category in categories" :key="category" :label="category"
            :color="selectedCategory === category ? 'info' : 'lightDark'" :outline="selectedCategory !== category"
            @click="selectCategory(category)" />
        </div>

        <!-- Announcements Grid -->
        <div v-if="filteredAnnouncements.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardBox v-for="announcement in filteredAnnouncements" :key="announcement.id"
            class="cursor-pointer shadow-md hover:shadow-lg transition-shadow" @click="openModal(announcement)">
            <!-- Title with dynamic padding -->
            <CardBoxComponentTitle :title="announcement.title" :style="{
              paddingBottom: announcement.title.length > 50 ? '1.5rem' : '5.5rem',
            }"></CardBoxComponentTitle>

            <!-- Description with more lines -->
            <p class="text-gray-500 mb-4 overflow-hidden"
              style="display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; min-height: 150px;">
              {{ announcement.description }}
            </p>

            <!-- Delete Button -->
            <div class="flex justify-self-center">
              <BaseButton v-if="userId === announcement.createdBy" :icon="mdiDelete" color="danger" small rounded-full
                @click.stop="deleteAnnouncement(announcement.id, announcement.createdBy)" />
            </div>
          </CardBox>
        </div>

        <!-- Load More Button -->
        <div v-if="filteredAnnouncements.length && !hasReachedEnd" class="mt-6 flex justify-center">
          <BaseButton v-if="!isLoading" label="Load More" color="primary"
            class="bg-blue-500 text-white hover:bg-blue-600" @click="loadMoreAnnouncements" />
          <p v-else class="text-gray-500">Loading...</p>
        </div>

        <!-- Empty State -->
        <div v-if="filteredAnnouncements.length === 0" class="flex flex-col items-center text-center py-16">
          <img :src="favicon" alt="No announcements available" class="w-24 h-24 mb-4" />
          <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">No announcements available</p>
          <p class="text-gray-500 dark:text-gray-400">Check back later or add a new announcement.</p>
          <BaseButton v-if="isAdmin" label="Add Announcement" :icon="mdiPlus" color="success"
            class="mt-4 rounded-full bg-green-500 text-white hover:bg-green-600" @click="navigateToCreatePage" />
        </div>
      </SectionMain>

      <!-- Modal for Viewing Full Announcement -->
      <CardBoxModal v-model="modalActive" :title="selectedAnnouncement?.title || 'Announcement Details'">
        <p class="text-gray-700 dark:text-gray-300">{{ selectedAnnouncement?.description }}</p>
      </CardBoxModal>
    </div>
  </LayoutAuthenticated>
</template>

<script setup>
import favicon from '@/assets/favicon.png';
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import localforage from "localforage";
import { roles } from "@/shared/constants/roles";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import BaseButton from "@/components/BaseButton.vue";
import PillTag from "@/components/PillTag.vue";
import { mdiPlus, mdiDelete } from "@mdi/js";

const router = useRouter();
const store = useStore();

const isAdmin = ref(false);
const selectedCategory = ref("recent");
const categories = ref(["recent", "All"]);
const userId = ref("");
const isLoading = ref(false);
const hasReachedEnd = ref(false);
const modalActive = ref(false);
const selectedAnnouncement = ref(null);

// Fetch announcements
const fetchAnnouncements = async (reset = false) => {
  isLoading.value = true;
  await store.dispatch("announcement/fetchAnnouncements", { reset, category: selectedCategory.value });
  isLoading.value = false;

  const announcements = store.getters["announcement/announcements"];
  if (announcements.length < (selectedCategory.value === "recent" ? 5 : 10)) {
    hasReachedEnd.value = true;
  }
};

// Computed announcements and filters
const announcements = computed(() => store.getters["announcement/announcements"]);
const filteredAnnouncements = computed(() => announcements.value);

// Select category and reset announcements
const selectCategory = (category) => {
  selectedCategory.value = category;
  hasReachedEnd.value = false; // Reset the end flag
  fetchAnnouncements(true); // Reset announcements
};

// Load more announcements
const loadMoreAnnouncements = () => {
  fetchAnnouncements();
};

// Open modal with announcement details
const openModal = (announcement) => {
  selectedAnnouncement.value = announcement;
  modalActive.value = true;
};

// Delete announcement
const deleteAnnouncement = async (id, createdBy) => {
  if (confirm("Are you sure you want to delete this announcement?") && userId.value === createdBy) {
    await store.dispatch("announcement/deleteAnnouncement", id);
    fetchAnnouncements(true); // Refresh announcements
  }
};

// Navigate to create page
const navigateToCreatePage = () => {
  router.push("/announcement-create-form");
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
}

// Fetch the User ACL
const fetchUserAcl = async () => {
  await fetchUser().then(async () => {
    const user = computed(() => store.getters['user/userData']);
    if (user) {
      const userAcl = await store.dispatch('user/getUserAcl', user.value)
      isAdmin.value = (userAcl === roles.ADMIN ? true : false);
    }
  }).then(async () => {
    await fetchAnnouncements(true);
  })
}

// Fetch user data
onMounted(async () => {
  await fetchUserAcl(); // we ought to know if the user is an ADMIN 
}); 
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-700 {
  color: #374151;
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

p[style*="-webkit-line-clamp"] {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>