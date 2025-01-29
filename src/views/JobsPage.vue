<template>
    <LayoutAuthenticated>
        <div class="flex flex-col min-h-screen">
            <!-- Main Content -->
            <SectionMain class="flex-grow">
                <!-- Header with Title and Button -->
                <div class="flex items-center justify-between mb-8">
                    <h1 class="text-3xl font-bold">Jobs</h1>
                    <BaseButton v-if="isAdmin" label="Post a Job" :icon="mdiPlus" color="success"
                        class="rounded-full bg-green-500 text-white hover:bg-green-600 ml-12"
                        @click="navigateToCreatePage" />
                </div>

                <!-- Jobs Grid -->
                <div v-if="filteredJobs.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CardBox v-for="job in filteredJobs" :key="job.id"
                        class="cursor-pointer shadow-md hover:shadow-lg transition-shadow" @click="openModal(job)">
                        <!-- Job Title -->
                        <CardBoxComponentTitle :title="job.title" :style="{
                            paddingBottom: job.title.length > 50 ? '1.5rem' : '5.5rem',
                        }"></CardBoxComponentTitle>

                        <!-- Job Description -->
                        <p class="text-gray-500 mb-4 overflow-hidden"
                            style="display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; min-height: 100px;">
                            {{ job.description }}
                        </p>

                        <!-- Job Link and Admin Actions -->
                        <div class="flex justify-between items-center">
                            <a :href="job.link" target="_blank" rel="noopener noreferrer"
                                class="text-blue-500 hover:underline text-md">
                                Apply Now
                            </a>

                            <!-- Admin Controls -->
                            <div v-if="isAdmin" class="flex space-x-2">
                                <BaseButton v-if="!job.isApproved" label="Approve" color="success" small rounded-full
                                    @click.stop="approveJob(job.id)" />
                                <BaseButton v-if="!job.isApproved" label="Decline" color="danger" small rounded-full
                                    @click.stop="declineJob(job.id)" />
                                <BaseButton v-if="job.isApproved && !job.isClosed" label="Close" color="warning" small
                                    rounded-full @click.stop="closeJob(job.id)" />
                            </div>
                        </div>
                    </CardBox>
                </div>

                <!-- Load More Button -->
                <div v-if="filteredJobs.length && !hasReachedEnd" class="mt-6 flex justify-center">
                    <BaseButton v-if="!isLoading" label="Load More" color="primary"
                        class="bg-blue-500 text-white hover:bg-blue-600" @click="loadMoreJobs" />
                    <p v-else class="text-gray-500">Loading...</p>
                </div>

                <!-- Empty State -->
                <div v-if="filteredJobs.length === 0" class="flex flex-col items-center text-center py-16">
                    <img src="/public/favicon.png" alt="No jobs available" class="w-24 h-24 mb-4" />
                    <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">No jobs available</p>
                    <p class="text-gray-500 dark:text-gray-400">Check back later or post a new job.</p>
                    <BaseButton v-if="isAdmin" label="Post a Job" :icon="mdiPlus" color="success"
                        class="mt-4 rounded-full bg-green-500 text-white hover:bg-green-600"
                        @click="navigateToCreatePage" />
                </div>
            </SectionMain>

            <!-- Modal for Viewing Full Job Description -->
            <CardBoxModal v-model="modalActive" :title="selectedJob?.title || 'Job Details'">
                <p class="text-gray-700 dark:text-gray-300">{{ selectedJob?.description }}</p>
            </CardBoxModal>
        </div>
    </LayoutAuthenticated>
</template>

<script setup>
import { roles } from "@/shared/constants/roles";
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import localforage from "localforage";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/SectionMain.vue";
import CardBox from "@/components/CardBox.vue";
import CardBoxComponentTitle from "@/components/CardBoxComponentTitle.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import BaseButton from "@/components/BaseButton.vue";
import { mdiPlus } from "@mdi/js";

const router = useRouter();
const store = useStore();

const isAdmin = ref(false);
const isLoading = ref(false);
const hasReachedEnd = ref(false);
const modalActive = ref(false);
const selectedJob = ref(null);

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
        await fetchJobs(true);
    })
}

// Fetch jobs
const fetchJobs = async (reset = false) => {
    isLoading.value = true;
    await store.dispatch("job/fetchJobs", { reset, isAdmin: isAdmin.value });
    isLoading.value = false;

    const jobsList = store.getters["job/jobs"];
    if (jobsList.length < 10) {
        hasReachedEnd.value = true;
    }
};

// Computed jobs list
const jobs = computed(() => store.getters["job/jobs"]);
const filteredJobs = computed(() => jobs.value || []);

// Load more jobs
const loadMoreJobs = () => {
    fetchJobs();
};

// Open modal with job details
const openModal = (job) => {
    selectedJob.value = job;
    modalActive.value = true;
};

// Admin actions
const approveJob = async (id) => {
    await store.dispatch("job/approveJob", id);
    fetchJobs(true);
};

const declineJob = async (id) => {
    await store.dispatch("job/declineJob", id);
    fetchJobs(true);
};

const closeJob = async (id) => {
    const user = computed(() => store.getters['user/userData']);
    await store.dispatch("job/closeJob", { jobId: id, userId: user.value.uid, email: user.value.email });
    fetchJobs(true);
};

// Navigate to create page
const navigateToCreatePage = () => {
    router.push("/job-create-form");
};

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