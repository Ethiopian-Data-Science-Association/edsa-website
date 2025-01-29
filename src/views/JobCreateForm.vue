<template>
    <LayoutAuthenticated>
        <div class="flex flex-col min-h-screen">
            <SectionMain>
                <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Post a Job" main>
                    <BaseButton label="Back to Jobs" color="contrast" rounded-full small @click="backToJobsPage" />
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

                <CardBox is-form @submit.prevent="submit" class="mb-4 p-4 border border-black-500 rounded">
                    <div v-if="generalError" class="mb-4 p-4 text-rose-500 border border-red-400 rounded">
                        {{ generalError }}
                    </div>

                    <!-- Job Title -->
                    <FormField label="Job Title">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="title" name="title" placeholder="Enter Job Title" :icon="mdiBook"
                                class="border rounded" :disabled="isSubmitting || isLoading" />
                            <p v-if="titleError" class="text-red-500">{{ titleError }}</p>
                        </div>
                    </FormField>

                    <!-- Job Description -->
                    <FormField label="Job Description">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="description" type="textarea" placeholder="Enter Job Description"
                                :disabled="isSubmitting || isLoading" />
                            <p v-if="descriptionError" class="text-red-500">{{ descriptionError }}</p>
                        </div>
                    </FormField>

                    <!-- Job Link -->
                    <FormField label="Application Link">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="link" placeholder="Job Application URL" :icon="mdiLinkVariant"
                                :disabled="isSubmitting || isLoading" />
                            <p v-if="linkError" class="text-red-500">{{ linkError }}</p>
                        </div>
                    </FormField>

                    <!-- Submit and Reset Buttons -->
                    <template #footer>
                        <BaseDivider />
                        <BaseButton type="submit" color="info" label="Submit" :disabled="isSubmitting || isLoading" />
                        <BaseButton type="reset" color="info" outline label="Reset" @click="resetForm" />
                    </template>
                </CardBox>
            </SectionMain>
        </div>
    </LayoutAuthenticated>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { roles } from '@/shared/constants/roles';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import { mdiBallotOutline, mdiBook, mdiLinkVariant, mdiCheckCircle, mdiAlertCircle } from '@mdi/js';
import SectionMain from '@/components/SectionMain.vue';
import CardBox from '@/components/CardBox.vue';
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import BaseDivider from '@/components/BaseDivider.vue';
import BaseButton from '@/components/BaseButton.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import * as yup from 'yup';
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import localforage from 'localforage';

const router = useRouter();
const store = useStore();
const isLoading = ref(false);
const userId = ref('Anonymous'); // Store user ID
const userRole = ref('USER'); // Store user role

const schema = yup.object({
    title: yup.string().required("Job title is required.").min(5, "Job title must be at least 5 characters long."),
    description: yup.string().required("Job description is required.").min(20, "Description must be at least 20 characters."),
    link: yup.string().url("Enter a valid URL for the job application link.").required("Application link is required."),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
    validationSchema: toTypedSchema(schema),
});

const { value: title, errorMessage: titleError } = useField('title');
const { value: description, errorMessage: descriptionError } = useField('description');
const { value: link, errorMessage: linkError } = useField('link');

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
            isClosed: false,
        };

        await store.dispatch('job/addJob', jobData);
        router.push('/jobs');
    } finally {
        isLoading.value = false;
    }
});

onMounted(async () => {
    const userData = await localforage.getItem('user');
    userId.value = userData?.uid || 'Anonymous';
    userRole.value = userData?.role || roles.REGULAR;
});
</script>
