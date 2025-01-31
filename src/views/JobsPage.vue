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

                <!-- Jobs Grid (Fixed alignment) -->
                <div v-if="filteredJobs.length"
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto max-w-7xl">
                    <CardBox v-for="job in filteredJobs" :key="job.id"
                        class="cursor-pointer shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col justify-between rounded-lg bg-white dark:bg-slate-900 w-full h-full min-h-[380px]"
                        @click="openModal(job)">

                        <!-- Job Title (Fixed height) -->
                        <CardBoxComponentTitle :title="job.title"
                            class="text-xl font-semibold text-gray-800 mb-2 min-h-[50px] text-center" />

                        <!-- Job Description (Fixed height for alignment) -->
                        <p class="text-gray-500 overflow-hidden line-clamp-4 min-h-[80px] mb-4 text-justify">
                            {{ job.description }}
                        </p>

                        <!-- Apply Now Link (Centered across all cards) -->
                        <div class="flex justify-center mb-4">
                            <a v-if="!job.isClosed" :href="job.link" target="_blank" rel="noopener noreferrer"
                                class="text-blue-500 hover:underline text-md font-semibold block text-center">
                                Apply Now
                            </a>
                            <PillTag v-if="job.isClosed" :color="'warning'" :label="'Closed'" :icon="mdiBookCancel" />
                        </div>

                        <!-- Admin Controls (Side-by-Side Buttons) -->
                        <div v-if="isAdmin" class="flex justify-center gap-3 mt-auto">
                            <BaseButton v-if="!job.isApproved" label="Approve" color="success" small rounded-full
                                @click.stop="approveJob(job.id)" />
                            <BaseButton v-if="!job.isApproved && !job.isDeclined" label="Decline" color="danger" small
                                rounded-full @click.stop="declineJob(job.id)" />
                            <BaseButton v-if="job.isApproved && !job.isClosed" label="Close" color="warning" small
                                rounded-full @click.stop="closeJob(job.id)" />
                            <PillTag v-if="job.isDeclined" :color="'warning'" :label="'Declined'"
                                :icon="mdiBookCancel" />
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
            <CardBoxModal v-model="modalActive" :title="selectedJob?.title || 'Job Details'" :footerDisplayed="false">
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
import { mdiPlus, mdiBookCancel } from "@mdi/js";
import PillTag from '@/components/PillTag.vue'

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
