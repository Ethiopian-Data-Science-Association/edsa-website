<template>
    <LayoutAuthenticated>
        <div class="flex flex-col min-h-screen">
            <SectionMain>
                <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Create Certification" main>
                    <BaseButton label="Back to Certifications" color="contrast" rounded-full small
                        @click="backToCertificationPage" />
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

                    <!-- Certification Title -->
                    <FormField label="Certification Title" class="dark:text-gray-200">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="title" name="title" placeholder="Enter certification title"
                                :icon="mdiAccount"
                                class="bg-gray-200 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 border dark:border-gray-700 rounded"
                                :disabled="isSubmitting || isLoading" />
                            <p v-if="titleError" class="text-red-500">{{ titleError }}</p>
                        </div>
                    </FormField>

                    <!-- Certification Description -->
                    <FormField label="Certification Description" class="dark:text-gray-200">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="description" type="textarea"
                                placeholder="Enter certification description" :disabled="isSubmitting || isLoading" />
                            <p v-if="descriptionError" class="text-red-500">{{ descriptionError }}</p>
                        </div>
                    </FormField>

                    <!-- Certification Rating -->
                    <FormField label="Certification Rating">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="rating" type="number" placeholder="Enter rating (1-5)" :icon="mdiStar"
                                min="1" max="5" :disabled="isSubmitting || isLoading" />
                            <p v-if="ratingError" class="text-red-500">{{ ratingError }}</p>
                        </div>
                    </FormField>

                    <!-- Certification Level -->
                    <FormField label="Certification Level">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="level" type="select"
                                :options="['Beginner', 'Intermediate', 'Advanced']"
                                :disabled="isSubmitting || isLoading" />
                            <p v-if="levelError" class="text-red-500">{{ levelError }}</p>
                        </div>
                    </FormField>

                    <!-- Active Status -->
                    <FormField label="Active Status">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="isActive" type="checkbox" label="Is Active"
                                :disabled="isSubmitting || isLoading" />
                            <p v-if="isActiveError" class="text-red-500">{{ isActiveError }}</p>
                        </div>
                    </FormField>

                    <!-- Duration -->
                    <FormField label="Duration (HH:mm)">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="duration" type="time" placeholder="Enter duration in HH:mm"
                                :icon="mdiClock" :disabled="isSubmitting || isLoading" />
                            <p v-if="durationError" class="text-red-500">{{ durationError }}</p>
                        </div>
                    </FormField>

                    <!-- Start Date and Time -->
                    <FormField label="Start Date & Time">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="startDateTime" type="datetime-local" :icon="mdiCalendar"
                                class="text-white" :disabled="isSubmitting || isLoading" />
                            <p v-if="startDateTimeError" class="text-red-500">{{ startDateTimeError }}</p>
                        </div>
                    </FormField>

                    <!-- End Date and Time -->
                    <FormField label="Last Updated Date & Time">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="endDateTime" type="datetime-local" :icon="mdiCalendar"
                                :disabled="isSubmitting || isLoading" />
                            <p v-if="endDateTimeError" class="text-red-500">{{ endDateTimeError }}</p>
                        </div>
                    </FormField>

                    <!-- Instructor Name -->
                    <FormField label="Course Given By">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="instructorName" placeholder="Instructor's name" :icon="mdiSchool"
                                :disabled="isSubmitting || isLoading" />
                            <p v-if="instructorNameError" class="text-red-500">{{ instructorNameError }}</p>
                        </div>
                    </FormField>

                    <!-- Attach Syllabus -->
                    <FormField label="Attach Syllabus">
                        <FormControl type="file" v-model="syllabus" :icon="mdiFile" placeholder="Upload syllabus"
                            :disabled="isSubmitting || isLoading" @change="onSyllabusUpload" />
                        <p v-if="syllabusError" class="text-red-500">{{ syllabusError }}</p>
                    </FormField>

                    <!-- Amount Due -->
                    <FormField label="Amount Due">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="amountDue" type="number" placeholder="Enter amount in USD"
                                :icon="mdiCash" :disabled="isSubmitting || isLoading" />
                            <p v-if="amountDueError" class="text-red-500">{{ amountDueError }}</p>
                        </div>
                    </FormField>

                    <!-- Submit and Reset Buttons -->
                    <template #footer>
                        <BaseDivider />
                        <BaseButton class="mr-6" type="submit" color="info" label="Submit"
                            :disabled="isSubmitting || isLoading" />
                        <BaseButton type="reset" color="info" outline label="Reset" @click="resetForm" />
                    </template>
                </CardBox>
            </SectionMain>
        </div>
    </LayoutAuthenticated>
</template>

<script setup>
import { ref, watch } from 'vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useDarkModeStore } from '@/pinia/darkMode.js';
import { useRouter } from 'vue-router';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import { mdiBallotOutline, mdiAccount, mdiCalendar, mdiClock, mdiStar, mdiCash, mdiSchool, mdiFile, mdiCheckCircle, mdiAlertCircle } from '@mdi/js';
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

const router = useRouter();
const store = useStore();
const isLoading = ref(false);
const generalError = ref('');
const syllabusPath = ref('');
const notificationMessage = ref('');
const notificationTitle = ref('');
const notificationColor = ref('');
const notificationIcon = ref('');
const notificationsOutline = ref(true);

const schema = yup.object({
    title: yup.string().required().label('title'),
    description: yup.string().required("Description is required"),
    rating: yup.number().min(1).max(5).required("Rating must be between 1 and 5"),
    level: yup.string().required("Level is required").oneOf(['Beginner', 'Intermediate', 'Advanced']),
    isActive: yup.boolean(),
    duration: yup.string().required("Duration is required"),
    startDateTime: yup.date().required("Start date & time is required"),
    endDateTime: yup.date().required("Tentative end date is required"),
    instructorName: yup.string().required("Instructor's name is required"),
    syllabus: yup.string().required("Please upload a syllabus").default(''),
    amountDue: yup.number().min(0, "Amount due must be at least 0").required("Amount due is required"),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
    validationSchema: toTypedSchema(schema),
});

const { value: title, errorMessage: titleError } = useField('title');
const { value: description, errorMessage: descriptionError } = useField('description');
const { value: rating, errorMessage: ratingError } = useField('rating');
const { value: level, errorMessage: levelError } = useField('level');
const { value: isActive, errorMessage: isActiveError } = useField('isActive');
const { value: duration, errorMessage: durationError } = useField('duration');
const { value: startDateTime, errorMessage: startDateTimeError } = useField('startDateTime');
const { value: endDateTime, errorMessage: endDateTimeError } = useField('endDateTime');
const { value: instructorName, errorMessage: instructorNameError } = useField('instructorName');
const { value: syllabus, errorMessage: syllabusError } = useField('syllabus');
const { value: amountDue, errorMessage: amountDueError } = useField('amountDue');

watch(syllabusPath, (newPath) => {
    if (newPath) {
        syllabus.value = newPath;
    }
});

const onSyllabusUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
        const payload = {
            document: file,
            documentUrl: 'certifications/syllabus/',
            documentName: file.name,
            metadata: file.type,
        };
        await store.dispatch('shared/uploadDocument', { payload });
        syllabusPath.value = store.state.shared.documentPath;
        showNotification('Success', 'Syllabus uploaded successfully.', 'success', mdiCheckCircle);
    } catch (error) {
        console.error('Error uploading syllabus:', error);
        showNotification('Error', 'Failed to upload syllabus. Please try again.', 'danger', mdiAlertCircle);
    }
};

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
    console.log('value',values);
    return 
    try {
        isLoading.value = true;
        const certificationId = `cert_${Date.now()}`;
        const certificationData = {
            id: certificationId,
            title: values.title,
            description: values.description,
            rating: values.rating,
            level: values.level,
            isActive: values.isActive,
            duration: values.duration,
            startDateTime: values.startDateTime,
            endDateTime: values.endDateTime,
            instructorName: values.instructorName,
            syllabus: syllabusPath.value,
            amountDue: values.amountDue,
        };

        await store.dispatch('certification/addCertification', certificationData);
        showNotification('Success', 'Certification created successfully.', 'success', mdiCheckCircle);
        router.push('/certifications');
    } catch (error) {
        generalError.value = error.message;
        showNotification('Error', 'Failed to create certification. Please try again.', 'danger', mdiAlertCircle);
    } finally {
        isLoading.value = false;
    }
});

const backToCertificationPage = () => {
    router.back();
};

const isDarkMode = computed(() => useDarkModeStore().isEnabled);
</script>

<style scoped>
.text-red-500 {
    color: #f87171;
}
</style>