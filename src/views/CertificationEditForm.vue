<template>
  <LayoutAuthenticated>
    <div>
      <SectionMain>
        <div class="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Edit Certification</h1>
            <BaseButton :icon="mdiArrowLeft" label="Back to Certifications" @click="goBack" color="contrast" />
          </div>

          <CardBox is-form @submit.prevent="saveChanges" class="mb-4 p-4 border border-black-500 rounded" :isCustomClass="isDarkMode"
            :custom-class="'rounded-2xl flex-col flex bg-gray-100 text-black dark:bg-slate-800 dark:text-white'">
            <div v-if="generalError" class="mb-4 p-4 text-rose-500 bg-rose-300 border border-red-400 rounded">
              {{ generalError }}
            </div>

            <!-- Certification Title -->
            <FormField label="Certification Title">
              <div class="flex flex-col gap-y-1.5">
                <FormControl v-model="title" name="title" placeholder="Enter certification title" :icon="mdiAccount"
                  :disabled="isSubmitting || isLoading" />
                <p v-if="titleError" class="text-red-500">{{ titleError }}</p>
              </div>
            </FormField>

            <!-- Certification Description -->
            <FormField label="Certification Description">
              <div class="flex flex-col gap-y-1.5">
                <FormControl v-model="description" type="textarea" placeholder="Enter certification description"
                  :disabled="isSubmitting || isLoading" />
                <p v-if="descriptionError" class="text-red-500">{{ descriptionError }}</p>

              </div>
            </FormField>

            <!-- Certification Rating -->
            <FormField label="Certification Rating">
              <div class="flex flex-col gap-y-1.5">
                <FormControl v-model="rating" type="number" placeholder="Enter rating (1-5)" :icon="mdiStar" min="1"
                  max="5" :disabled="isSubmitting || isLoading" />
                <p v-if="ratingError" class="text-red-500">{{ ratingError }}</p>

              </div>
            </FormField>

            <!-- Certification Level -->
            <FormField label="Certification Level">
              <div class="flex flex-col gap-y-1.5">
                <FormControl v-model="level" type="select" :options="['Beginner', 'Intermediate', 'Advanced']"
                  :disabled="isSubmitting || isLoading" />
                <p v-if="levelError" class="text-red-500">{{ levelError }}</p>

              </div>
            </FormField>

            <!-- Active Status Toggle -->
            <FormField label="Active Status">
              <div class="flex flex-col gap-y-1.5">
                <FormControl v-model="isActive" type="checkbox" label="Is Active"
                  :disabled="isSubmitting || isLoading" />
                <p v-if="isActiveError" class="text-red-500">{{ isActiveError }}</p>
              </div>
            </FormField>

            <!-- Duration Field with Dropdown for Time Selection -->
            <FormField label="Duration (HH:mm)">
              <div class="flex flex-col gap-y-1.5">
                <FormControl v-model="duration" type="time" placeholder="Enter duration in HH:mm" :icon="mdiClock"
                  :disabled="isSubmitting || isLoading" />
                <p v-if="durationError" class="text-red-500">{{ durationError }}</p>
              </div>
            </FormField>

            <!-- Start Date and Time -->
            <FormField label="Start Date & Time">
              <div class="flex flex-col gap-y-1.5">
                <FormControl v-model="startDate" type="datetime-local" :icon="mdiCalendar"
                  :disabled="isSubmitting || isLoading" />
                <p v-if="startDateTimeError" class="text-red-500">{{ startDateTimeError }}</p>

              </div>
            </FormField>

            <!-- Last Updated Date and Time -->
            <FormField label="Last Updated Date & Time">
              <div class="flex flex-col gap-y-1.5">
                <FormControl v-model="lastUpdated" type="datetime-local" :icon="mdiCalendar"
                  :disabled="isSubmitting || isLoading" />
                <p v-if="lastUpdatedError" class="text-red-500">{{ lastUpdatedError }}</p>

              </div>
            </FormField>

            <!-- Course Provider -->
            <FormField label="Course Provider">
              <div class="flex flex-col gap-y-1.5">
                <FormControl v-model="courseProvider" placeholder="Enter course provider name" :icon="mdiSchool"
                  :disabled="isSubmitting || isLoading" />
                <p v-if="courseProviderError" class="text-red-500">{{ courseProviderError }}</p>

              </div>
            </FormField>

            <!-- Amount Due -->
            <FormField label="Amount Due">
              <div class="flex flex-col gap-y-1.5">
                <FormControl v-model="amountDue" type="number" placeholder="Enter amount due" :icon="mdiCash"
                  :disabled="isSubmitting || isLoading" />
                <p v-if="amountDueError" class="text-red-500">{{ amountDueError }}</p>

              </div>
            </FormField>

            <template #footer>
              <BaseDivider />
              <BaseButton class="mr-6" type="submit" color="info" label="Save Changes"
                :disabled="isSubmitting || isLoading" />
              <BaseButton type="reset" color="info" outline label="Reset" @click="resetForm" />
            </template>
          </CardBox>
        </div>
      </SectionMain>
    </div>
  </LayoutAuthenticated>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { computed } from 'vue'
import { useDarkModeStore } from '@/pinia/darkMode.js'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import { useRoute, useRouter } from 'vue-router';
import { mdiAccount, mdiCalendar, mdiClock, mdiStar, mdiCash, mdiSchool, mdiArrowLeft } from '@mdi/js';
import SectionMain from '@/components/SectionMain.vue';
import CardBox from '@/components/CardBox.vue';
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseDivider from '@/components/BaseDivider.vue';
import * as yup from 'yup';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';

const route = useRoute();
const router = useRouter();
const certificationId = route.params.id;
const isLoading = ref(false);
const generalError = ref('');

// Define validation schema
const schema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  rating: yup.number().min(1).max(5).required("Rating must be between 1 and 5"),
  level: yup.string().required("Level is required").oneOf(['Beginner', 'Intermediate', 'Advanced']),
  isActive: yup.boolean(),
  duration: yup.string().required("Duration is required"),
  startDate: yup.date().required("Start date & time is required"),
  lastUpdated: yup.date(),
  courseProvider: yup.string().required("Course provider is required"),
  amountDue: yup.number().min(0, "Amount due must be at least 0").required("Amount due is required"),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: toTypedSchema(schema),
});

// Define individual fields with error message handling
const { value: title, errorMessage: titleError } = useField('title');
const { value: description, errorMessage: descriptionError } = useField('description');
const { value: rating, errorMessage: ratingError } = useField('rating');
const { value: level, errorMessage: levelError } = useField('level');
const { value: isActive, errorMessage: isActiveError } = useField('isActive');
const { value: duration, errorMessage: durationError } = useField('duration');
const { value: startDate, errorMessage: startDateTimeError } = useField('startDate');
const { value: lastUpdated, errorMessage: lastUpdatedError } = useField('lastUpdated');
const { value: courseProvider, errorMessage: courseProviderError } = useField('courseProvider');
const { value: amountDue, errorMessage: amountDueError } = useField('amountDue');

// Mock fetch function to populate form with existing data
const fetchCertificationData = async (id) => {
  return {
    title: `Certification ${id}`,
    description: `Detailed description of certification ${id}.`,
    rating: 4,
    level: 'Intermediate',
    isActive: true,
    duration: '02:30',
    startDate: '2024-08-26T08:30',
    lastUpdated: '2024-08-26T08:30',
    courseProvider: 'Provider Name',
    amountDue: 100,
  };
};

// Populate form data on component mount
onMounted(async () => {
  const data = await fetchCertificationData(certificationId);
  title.value = data.title;
  description.value = data.description;
  rating.value = data.rating;
  level.value = data.level;
  isActive.value = data.isActive;
  duration.value = data.duration;
  startDate.value = data.startDate;
  lastUpdated.value = data.lastUpdated;
  courseProvider.value = data.courseProvider;
  amountDue.value = data.amountDue;
});

const saveChanges = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    // Form submission logic
  } catch (error) {
    generalError.value = error.message;
  } finally {
    isLoading.value = false;
  }
});

const goBack = () => {
  router.push('/certifications');
};

const isDarkMode = computed(() => {
  if (useDarkModeStore().isEnabled) {
    return true
  }
  return false
})
</script>

<style scoped>
.text-red-500 {
  color: #f87171;
}
</style>
