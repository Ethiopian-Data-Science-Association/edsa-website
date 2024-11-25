<template>
  <LayoutAuthenticated>
    <div>
      <div class="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-10">
        <!-- Payment Summary Header -->
        <h2 class="text-2xl font-bold mb-4">Payment Summary</h2>
        <hr class="border-gray-300 dark:border-gray-600 mb-6" />

        <!-- Payment Details -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div class="flex flex-col col-span-1">
            <label class="font-medium text-gray-700 dark:text-gray-300">Mode of Payment</label>
            <select v-model="selectedMode" :class="toggleClass" @change="openModal">
              <option disabled value="">Select Mode</option>
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <div class="flex flex-col col-span-1 sm:col-span-2 md:flex-row md:items-center">
            <div class="flex-1 mb-4 md:mb-0">
              <label class="font-medium text-gray-700 dark:text-gray-300">Registering for</label>
              <p class="mt-2">{{ certificationTitle }}</p>
            </div>
            <div class="flex-1">
              <label class="font-medium text-gray-700 dark:text-gray-300">Paying To</label>
              <p class="mt-2">Ethiopian Data Science Association (EDSA)</p>
            </div>
          </div>

          <div class="flex flex-col">
            <label class="font-medium text-gray-700 dark:text-gray-300">Total Fee (in Ethiopian Birr)</label>
            <p class="mt-2">{{ amountDue }} ETB</p>
          </div>

          <div class="flex flex-col col-span-2">
            <label class="font-medium text-gray-700 dark:text-gray-300">Total Payable (in Ethiopian Birr)</label>
            <p class="mt-2 text-blue-600 font-semibold">{{ amountDue }} ETB</p>
          </div>

          <div class="flex flex-col col-span-2">
            <label class="font-medium text-gray-700 dark:text-gray-300">You are registering for</label>
            <p class="mt-2">{{ formattedStartDate }}</p>
          </div>

          <div class="flex flex-col">
            <label class="font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <p class="mt-2">{{ email }}</p>
          </div>

          <div class="flex flex-col">
            <label class="font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
            <p class="mt-2">{{ phoneNumber }}</p>
          </div>
        </div>

        <!-- Register Button -->
        <button @click="register" :disabled="!paymentConfirmed"
          class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed mt-6">
          Register
        </button>

        <!-- Modal for Payment Instructions -->
        <CardBoxModal v-model="modalOneActive" title="Please confirm action" button-label="Confirm" has-cancel
          @confirm="confirmPayment">
          <p class="mb-4">Please confirm that you understand the payment instructions.</p>
          <FormCheckRadio v-model="paymentConfirmed" type="checkbox" name="confirmation" input-value="understand"
            label="I understand, continue to payment" />
        </CardBoxModal>
      </div>
    </div>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import localforage from 'localforage';
import { useDarkModeStore } from '@/pinia/darkMode.js';
import CardBoxModal from '@/components/CardBoxModal.vue';
import FormCheckRadio from '@/components/FormCheckRadio.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';

const route = useRoute();
const router = useRouter();
const store = useStore();

// Retrieve certification ID from the route
const certificationId = route.params.id;

// Certification Data
const certificationTitle = ref('');
const amountDue = ref(0);
const startDate = ref('');

// User Data
const uid = ref('');
const email = ref('');
const phoneNumber = ref('--'); // Default to '--'

// Payment Mode & Modal Controls
const selectedMode = ref('');
const modalOneActive = ref(false);
const paymentConfirmed = ref(false);

const fetchUserData = async () => {
  try {
    const user = await localforage.getItem('user');
    if (user) {
      await store.dispatch('user/getUser', user.uid);
      const userData = store.state.user.userData;

      uid.value = userData.uid;
      email.value = userData.email || '--';
      phoneNumber.value = userData.phoneNumber || '--';
    } else {
      console.error('User data not found in localforage.');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

onMounted(async () => {
  try {
    // Fetch certification data
    await store.dispatch('certification/fetchCertification', certificationId);
    const certification = store.state.certification.certificationData;
    certificationTitle.value = certification.title || 'N/A';
    amountDue.value = certification.amountDue || 0;
    startDate.value = certification.startDateTime.seconds * 1000; // Convert to milliseconds

    // Fetch user data
    await fetchUserData();
  } catch (error) {
    console.error('Error fetching certification or user data:', error);
  }
});

const formattedStartDate = computed(() =>
  startDate.value ? new Date(startDate.value).toLocaleString() : '--'
);

const openModal = () => {
  if (selectedMode.value) {
    modalOneActive.value = true;
  }
};

const confirmPayment = () => {
  modalOneActive.value = false;
};

const register = async () => {
  // since we are missing uid we have to go and redo the step
  if (uid.value === '') {
    router.back()
    return
  }
  const userId = uid.value; // Retrieved userId  
  const certificationId = route.params.id;

  try {
    // Register user to certification
    await store.dispatch('certification/registerUserToCertification', { certificationId, userId });

    // Add certification to user
    await store.dispatch('user/registerCertificationToUser', { userId, certificationId });
    router.push('/certifications'); // Redirect after registration
  } catch (error) {
    console.error('Error during registration:', error);
  }
};


const toggleClass = computed(() =>
  useDarkModeStore().isEnabled
    ? 'bg-black text-white focus:bg-[#1a1a1a] hover:bg-[#333] focus:outline-none w-full mt-2 p-2 border rounded'
    : 'select-bg-dark w-full mt-2 p-2 border rounded'
);
</script>

<style scoped>
.mt-10 {
  margin-top: 2.5rem;
}

.bg-blue-500 {
  background-color: #3b82f6;
}

.hover\:bg-blue-600:hover {
  background-color: #2563eb;
}
</style>
