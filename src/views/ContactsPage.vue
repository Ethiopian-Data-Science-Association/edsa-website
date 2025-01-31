<template>
    <LayoutAuthenticated>
        <div class="flex flex-col min-h-screen">
            <SectionMain class="flex-grow">
                <!-- Header -->
                <div class="flex items-center justify-between mb-8">
                    <h1 class="text-3xl font-bold">Contact Submissions</h1>
                </div>

                <!-- Contact Submissions Table -->
                <div v-if="contactSubmissions.length">
                    <table class="w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="p-4 text-left dark:bg-gray-700">Name</th>
                                <th class="p-4 text-left dark:bg-gray-700">Email</th>
                                <th class="p-4 text-left dark:bg-gray-700">Phone</th>
                                <th class="p-4 text-left dark:bg-gray-700">Type</th>
                                <th class="p-4 text-left dark:bg-gray-700">Submitted At</th>
                                <th class="p-4 text-left dark:bg-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="contact in paginatedContacts" :key="contact.id" class="border-b">
                                <td class="p-4">{{ contact.name || 'Anonymous' }}</td>
                                <td class="p-4">{{ contact.email || 'Anonymous' }}</td>
                                <td class="p-4">{{ contact.phone || 'N/A' }}</td>
                                <td class="p-4">{{ contact.questionType }}</td>
                                <td class="p-4">{{ formatDate(contact.createdAt) }}</td>
                                <td class="p-4">
                                    <BaseButtons>
                                        <BaseButton color="info" label="View" small @click="openModal(contact)" />
                                    </BaseButtons>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
                    <BaseLevel>
                        <BaseButtons>
                            <BaseButton v-for="page in totalPages" :key="page" :active="page === currentPage"
                                :label="page" :color="page === currentPage ? 'lightDark' : 'whiteDark'" small
                                @click="currentPage = page" />
                        </BaseButtons>
                        <small>Page {{ currentPage }} of {{ totalPages }}</small>
                    </BaseLevel>
                </div>

                <!-- Empty State -->
                <div v-if="contactSubmissions.length === 0" class="flex flex-col items-center text-center py-16">
                    <img src="/public/favicon.png" alt="No contacts available" class="w-24 h-24 mb-4" />
                    <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">No contact submissions yet</p>
                    <p class="text-gray-500 dark:text-gray-400">Check back later for new submissions.</p>
                </div>
            </SectionMain>
        </div>

        <!-- Modal for Viewing Full Contact Submission -->
        <CardBoxModal v-model="isModalActive" :title="selectedContact?.name || 'Contact Details'" :footerDisplayed="false">
            <p><strong>Email:</strong> {{ selectedContact?.email || 'Anonymous' }}</p>
            <p><strong>Phone:</strong> {{ selectedContact?.phone || 'N/A' }}</p>
            <p><strong>Type:</strong> {{ selectedContact?.questionType }}</p>
            <p class="mt-4"><strong>Question:</strong></p>
            <p class="text-gray-700 dark:text-gray-300">{{ selectedContact?.question }}</p>
        </CardBoxModal>
    </LayoutAuthenticated>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionMain from "@/components/SectionMain.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseLevel from "@/components/BaseLevel.vue";

const store = useStore();
const contactSubmissions = ref([]);
const isModalActive = ref(false);
const selectedContact = ref(null);
const currentPage = ref(1);
const perPage = 5;

// Fetch contact submissions from Firestore
const fetchContactSubmissions = async () => {
    try {
        contactSubmissions.value = await store.dispatch("contact/fetchContactSubmissions");
    } catch (error) {
        console.error("Error fetching contact submissions:", error);
    }
};

// Open modal for full question view
const openModal = (contact) => {
    selectedContact.value = contact;
    isModalActive.value = true;
};

// Pagination logic
const totalPages = computed(() => Math.ceil(contactSubmissions.value.length / perPage));
const paginatedContacts = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    return contactSubmissions.value.slice(start, start + perPage);
});

// Format date for better readability
const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
};

onMounted(fetchContactSubmissions);
</script>

<style scoped>
.text-gray-500 {
    color: #6b7280;
}

.text-gray-700 {
    color: #374151;
}

.bg-gray-100 {
    background-color: #f3f4f6;
}

.bg-gray-700 {
    background-color: #374151;
}

.p-4 {
    padding: 1rem;
}
</style>
