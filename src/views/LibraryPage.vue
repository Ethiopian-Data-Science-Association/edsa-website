<template>
    <LayoutAuthenticated>
        <div class="flex flex-col min-h-screen">
            <!-- Main Content -->
            <SectionMain class="flex-grow">
                <!-- Header with Title and Button -->
                <div class="flex items-center justify-between mb-8">
                    <h1 class="text-3xl font-bold">Library</h1>
                    <BaseButton v-if="isAdmin" label="Add Resource" :icon="mdiPlus" color="success"
                        class="rounded-full bg-green-500 text-white hover:bg-green-600 ml-12"
                        @click="navigateToCreatePage" />
                </div>

                <!-- Category Filter Pills -->
                <div class="flex justify-center mb-6 space-x-4 cursor-pointer">
                    <PillTag v-for="category in categories" :key="category" :label="category"
                        :color="selectedCategory === category ? 'info' : 'lightDark'"
                        :outline="selectedCategory !== category" @click="selectCategory(category)" />
                </div>

                <!-- Resources Grid -->
                <div v-if="filteredResources.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CardBox v-for="resource in filteredResources" :key="resource.id"
                        class="shadow-md hover:shadow-lg transition-shadow">
                        <!-- Title with dynamic padding -->
                        <CardBoxComponentTitle :title="resource.title" :style="{
                            paddingBottom: resource.title.length > 50 ? '1.5rem' : '5.5rem',
                        }"></CardBoxComponentTitle>

                        <!-- Description with more lines -->
                        <p class="text-gray-500 mb-4 overflow-hidden"
                            style="display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; min-height: 150px;">
                            {{ resource.description }}
                        </p>

                        <!-- Clickable Link and Delete Button -->
                        <div class="flex justify-between items-center">
                            <!-- Open Resource Link -->
                            <a :href="resource.resourceLink" target="_blank" rel="noopener noreferrer"
                                class="text-blue-500 hover:underline text-md">
                                Open Resource
                            </a>

                            <!-- Delete Button -->
                            <BaseButton v-if="userId === resource.resourceUploadedBy" :icon="mdiDelete" color="danger" small rounded-full
                                @click="deleteResource(resource.id, resource.resourceUploadedBy)" />
                        </div>
                    </CardBox>
                </div>

                <!-- Load More Button -->
                <div v-if="filteredResources.length && !hasReachedEnd" class="mt-6 flex justify-center">
                    <BaseButton v-if="!isLoading" label="Load More" color="primary"
                        class="bg-blue-500 text-white hover:bg-blue-600" @click="loadMoreResources" />
                    <p v-else class="text-gray-500">Loading...</p>
                </div>

                <!-- Empty State -->
                <div v-if="filteredResources.length === 0" class="flex flex-col items-center text-center py-16">
                    <img src="/public/favicon.png" alt="No resources available" class="w-24 h-24 mb-4" />
                    <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">No resources available</p>
                    <p class="text-gray-500 dark:text-gray-400">Check back later or add a new resource.</p>
                    <BaseButton v-if="isAdmin" label="Add Resource" :icon="mdiPlus" color="success"
                        class="mt-4 rounded-full bg-green-500 text-white hover:bg-green-600"
                        @click="navigateToCreatePage" />
                </div>
            </SectionMain>
        </div>
    </LayoutAuthenticated>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import localforage from 'localforage';
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";
import BaseButton from "@/components/BaseButton.vue";
import PillTag from "@/components/PillTag.vue";
import { mdiPlus, mdiDelete } from "@mdi/js";

const router = useRouter();
const store = useStore();

const isAdmin = true; // Assume admin status for demonstration
const selectedCategory = ref("All");
const userId = ref('');
const categories = ref(['All','Academic Paper', 'External Course', 'Podcast', 'Slides', 'Video', 'White Paper']);
const isLoading = ref(false);
const hasReachedEnd = ref(false); // Track if all resources are loaded

// Fetch resources
const fetchResources = async (reset = false) => {
    isLoading.value = true;
    await store.dispatch("library/fetchResources", { reset });
    isLoading.value = false;

    // Determine if all resources are fetched
    const resources = store.getters["library/resources"];
    if (resources.length < 10 || resources.length % 10 !== 0) {
        hasReachedEnd.value = true;
    }
};

// Computed resources and filters
const resources = computed(() => store.getters["library/resources"]);
const filteredResources = computed(() =>
    selectedCategory.value === "All"
        ? resources.value
        : resources.value.filter((resource) => resource.resourceType === selectedCategory.value)
);

// Select category and reset resources
const selectCategory = (category) => {
    selectedCategory.value = category;
    hasReachedEnd.value = false; // Reset the end flag
    fetchResources(true); // Reset resources
};

// Load more resources
const loadMoreResources = () => {
    fetchResources();
};

// Delete resource
const deleteResource = async (id, resourceUploadedBy) => {
    if (confirm("Are you sure you want to delete this resource?") && (userId.value === resourceUploadedBy)) { // additional safety
        await store.dispatch("library/deleteResource", id);
        fetchResources(true); // Refresh resources
    }
};

// Navigate to create page
const navigateToCreatePage = () => {
    router.push("/library-create-form");
};

onMounted(() => {
    fetchResources(true); // Fetch initial resources
    fetchUser();
});

const fetchUser = async () => {
    try {
        const userData = await localforage.getItem('user')
        if (userData && userData.uid) {
            const userFound = await store.dispatch('user/getUser', userData.uid) // if returned true then pick it from the localForage
            if (userFound) userId.value = userData.uid;
        } else {
            console.error('User data not found in local storage.')
        }
    } catch (error) {
        console.error('Error fetching user:', error)
    }
}
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

.text-gray-500 {
    color: #6b7280;
}

.text-gray-700 {
    color: #374151;
}

.text-gray-300 {
    color: #d1d5db;
}

/* Ensure proper truncation with line clamps */
p[style*="-webkit-line-clamp"] {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>