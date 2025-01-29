<template>
    <LayoutAuthenticated>
        <div class="flex flex-col min-h-screen">
            <SectionMain :IsCustomized="true" :customClass="customClass">
                <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Post a Job" main>
                    <BaseButton class="ml-12" label="Back to Jobs" color="contrast" rounded-full small
                        @click="backToJobsPage" />
                </SectionTitleLineWithButton>

                <!-- Notification Bar -->
                <div v-if="notificationMessage" class="mb-4">
                    <NotificationBar :color="notificationColor" :icon="notificationIcon"
                        :outline="notificationsOutline">
                        <b>{{ notificationTitle }}</b>. {{ notificationMessage }}
                        <template #right>
                            <BaseButton label="Dismiss" :color="notificationsOutline ? notificationColor : 'white'"
                                :outline="notificationsOutline" rounded-full small @click="clearNotification" />
                        </template>
                    </NotificationBar>
                </div>

                <CardBox is-form @submit.prevent="submit" class="mb-4 p-4 border border-black-500 rounded"
                    :isCustomClass="isDarkMode"
                    :custom-class="'rounded-2xl flex-col flex bg-gray-100 text-black dark:bg-slate-800 dark:text-white'">

                    <div v-if="generalError" class="mb-4 p-4 text-rose-500 border border-red-400 rounded">
                        {{ generalError }}
                    </div>

                    <!-- Job Title -->
                    <FormField label="Job Title" class="dark:text-gray-200">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="title" name="title" placeholder="Enter Job Title" :icon="mdiBook"
                                class="bg-gray-200 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 border dark:border-gray-700 rounded"
                                :disabled="isSubmitting || isLoading" />
                            <p v-if="titleError" class="text-red-500">{{ titleError }}</p>
                        </div>
                    </FormField>

                    <!-- Job Description -->
                    <FormField label="Job Description" class="dark:text-gray-200">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="description" type="textarea"
                                placeholder="Enter Job Description (1,000 characters allowed)" maxlength="1000"
                                class="bg-gray-200 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 border dark:border-gray-700 rounded"
                                :disabled="isSubmitting || isLoading" />
                            <p v-if="descriptionError" class="text-red-500">{{ descriptionError }}</p>
                        </div>
                    </FormField>

                    <!-- Job Link -->
                    <FormField label="Application Link" class="dark:text-gray-200">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="link" placeholder="Job Application URL" :icon="mdiLinkVariant"
                                class="bg-gray-200 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 border dark:border-gray-700 rounded"
                                :disabled="isSubmitting || isLoading" />
                            <p v-if="linkError" class="text-red-500">{{ linkError }}</p>
                        </div>
                    </FormField>

                    <!-- Submit and Reset Buttons -->
                    <template #footer>
                        <BaseDivider />
                        <BaseButtons class="mr-6">
                            <BaseButton type="submit" color="info" label="Submit"
                                :disabled="isSubmitting || isLoading" />
                            <BaseButton type="reset" color="info" outline label="Reset" @click="resetForm" />
                        </BaseButtons>
                    </template>
                </CardBox>
            </SectionMain>
        </div>
    </LayoutAuthenticated>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import { mdiBallotOutline, mdiBook, mdiLinkVariant, mdiAlertCircle } from '@mdi/js';
import SectionMain from '@/components/SectionMain.vue';
import CardBox from '@/components/CardBox.vue';
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import BaseDivider from '@/components/BaseDivider.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import * as yup from 'yup';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import localforage from 'localforage';
import { useDarkModeStore } from '@/pinia/darkMode.js';

const router = useRouter();
const store = useStore();
const isLoading = ref(false);
const userId = ref('Anonymous'); // Store user ID
const customClass = ref("xl:max-w-6xl ml-[15%]");
const generalError = ref('');
const notificationMessage = ref('');
const notificationTitle = ref('');
const notificationColor = ref('');
const notificationIcon = ref('');
const notificationsOutline = ref(true);

const schema = yup.object({
    title: yup.string().required("Job title is required.").min(5, "Job title must be at least 5 characters long."),
    description: yup.string().required("Job description is required.").max(1000, "Job description cannot exceed 1,000 characters."),
    link: yup.string().url("Enter a valid URL for the job application link.").required("Application link is required."),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
    validationSchema: toTypedSchema(schema),
});

const { value: title, errorMessage: titleError } = useField('title');
const { value: description, errorMessage: descriptionError } = useField('description');
const { value: link, errorMessage: linkError } = useField('link');

const showNotification = (title, message, color, icon) => {
    notificationTitle.value = title;
    notificationMessage.value = message;
    notificationColor.value = color;
    notificationIcon.value = icon;
};

const clearNotification = () => {
    notificationMessage.value = '';
    notificationTitle.value = '';
    notificationColor.value = '';
    notificationIcon.value = '';
};

const submit = handleSubmit(async (values) => {
    try {
        isLoading.value = true;
        const jobId = `job_${Date.now()}`;

        const jobData = {
            id: jobId,
            title: values.title,
            description: values.description,
            link: values.link,
            createdBy: userId.value,
            createdAt: new Date().toISOString(),
            isApproved: false,
            isDeclined: false,
            isClosed: false,
        };

        await store.dispatch('job/addJob', jobData);
        showNotification('Success', 'Job posted successfully.', 'success', mdiBook);
        router.push('/jobs');
    } catch (error) {
        generalError.value = error.message;
        showNotification('Error', 'Failed to post job. Please try again.', 'danger', mdiAlertCircle);
    } finally {
        isLoading.value = false;
    }
});

const backToJobsPage = () => {
    router.back();
};

const isDarkMode = computed(() => useDarkModeStore().isEnabled);

onMounted(async () => {
    const userData = await localforage.getItem('user');
    userId.value = userData?.uid || 'Anonymous';
});
</script>

<style scoped>
.text-red-500 {
    color: #f87171;
}
</style>
