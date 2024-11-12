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
            <p class="mt-2">{{ startDate }}</p>
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
import { ref } from 'vue';
import { computed } from 'vue'
import { useDarkModeStore } from '@/pinia/darkMode.js'
import CardBoxModal from '@/components/CardBoxModal.vue';
import FormCheckRadio from '@/components/FormCheckRadio.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';

const certificationTitle = ref('Introduction to Data Science');
const amountDue = ref(675.00); // Example value
const startDate = ref('September 1, 2024');
const email = ref('user@example.com'); // Placeholder email
const phoneNumber = ref('123-456-7890'); // Placeholder phone number

// Payment Mode & Modal Controls
const selectedMode = ref('');
const modalOneActive = ref(false);
const paymentConfirmed = ref(false);

const openModal = () => {
  if (selectedMode.value) {
    modalOneActive.value = true;
  }
};

const confirmPayment = () => {
  modalOneActive.value = false;
};

const register = () => {
  if (paymentConfirmed.value) {
    alert('Registered successfully!'); // Placeholder for actual registration logic
  }
};

const toggleClass = computed(() => {
  if (useDarkModeStore().isEnabled) {
    return 'bg-black text-white focus:bg-[#1a1a1a] hover:bg-[#333] focus:outline-none w-full mt-2 p-2 border rounded'
  }
  return 'select-bg-dark w-full mt-2 p-2 border rounded'
})

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
