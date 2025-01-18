<template>
    <LayoutAuthenticated>
        <div class="flex flex-col min-h-screen">
            <SectionMain>
                <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Create Resource" main>
                    <BaseButton label="Back to Library" color="contrast" rounded-full small
                        @click="backToLibraryPage" />
                </SectionTitleLineWithButton>

                <!-- Notification Bar -->
                <div v-if="notificationMessage !== ''" class="mb-4">
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

                    <!-- Resource Title -->
                    <FormField label="Resource Title" class="dark:text-gray-200">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="title" name="title" placeholder="Enter Resource Title" :icon="mdiBook"
                                class="bg-gray-200 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 border dark:border-gray-700 rounded"
                                :disabled="isSubmitting || isLoading" />
                            <p v-if="titleError" class="text-red-500">{{ titleError }}</p>
                        </div>
                    </FormField>

                    <!-- Resource Description -->
                    <FormField label="Resource Description" class="dark:text-gray-200">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="description" type="textarea" placeholder="Enter Resource Description"
                                :disabled="isSubmitting || isLoading" />
                            <p v-if="descriptionError" class="text-red-500">{{ descriptionError }}</p>
                        </div>
                    </FormField>

                    <!-- Resource type -->
                    <FormField label="Resource Type">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="resourceType" type="select"
                                :options="['Academic Paper', 'External Course', 'Podcast', 'Slides', 'Video', 'White Paper']"
                                :disabled="isSubmitting || isLoading" />
                            <p v-if="resourceTypeError" class="text-red-500">{{ resourceTypeError }}</p>
                        </div>
                    </FormField>

                    <!-- Resource Link -->
                    <FormField label="Link to the Resource">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="resourceLink" placeholder="Resource Url" :icon="mdiSchool"
                                :disabled="isSubmitting || isLoading" />
                            <p v-if="resourceLinkError" class="text-red-500">{{ resourceLinkError }}</p>
                        </div>
                    </FormField>

                    <!-- Attach Resource -->
                    <FormField label="Attach Resource">
                        <FormControl type="file" v-model="resource" :icon="mdiFile" placeholder="Upload resource"
                            :disabled="isSubmitting || isLoading" :documentStoragePath="paths.LIBRARY_UPLOAD_PATH"
                            @file-upload-success="onResourceUploadCompletedEvent"
                            @file-upload-error="onResourceUploadFailedEvent" />
                        <p v-if="resourceError" class="text-white-500"> {{ resourceError }}</p>
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
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useDarkModeStore } from '@/pinia/darkMode.js';
import { useRouter } from 'vue-router';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import { mdiBallotOutline, mdiSchool, mdiFile, mdiCheckCircle, mdiAlertCircle, mdiBook } from '@mdi/js';
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
import { paths } from '@/shared/constants/paths';

onMounted(() => {
    fetchUser();
})

const router = useRouter();
const store = useStore();
const isLoading = ref(false);
const generalError = ref('');
const userId = ref('Anonyms');
const notificationMessage = ref('');
const notificationTitle = ref('');
const notificationColor = ref('');
const notificationIcon = ref('');
const notificationsOutline = ref(true);

const schema = yup.object({
    title: yup.string().required().label('Resource title is required.'),
    description: yup.string().required("Resource description is required."),
    resourceType: yup.string().required("resourceType is required.").oneOf(['Academic Paper', 'External Course', 'Podcast', 'Slides', 'Video', 'White Paper']),
    resourceLink: yup.string(),
    resource: yup.string(),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
    validationSchema: toTypedSchema(schema),
});

const { value: title, errorMessage: titleError } = useField('title');
const { value: description, errorMessage: descriptionError } = useField('description');
const { value: resourceType, errorMessage: resourceTypeError } = useField('resourceType');
const { value: resourceLink, errorMessage: resourceLinkError } = useField('resourceLink');
const { value: resource, errorMessage: resourceError } = useField('resource');

const onResourceUploadCompletedEvent = async () => {
    const documentPath = computed(() => store.getters['shared/documentPath']);
    resource.value = documentPath.value;
    showNotification('Success', 'Resource uploaded successfully.', 'success', mdiCheckCircle);
};

const onResourceUploadFailedEvent = async () => {
    showNotification('Error', 'Failed to upload resource. Please try again.', 'danger', mdiAlertCircle);
}

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
        const resourceId = `res_${Date.now()}`;

        /* TODO:: Place check again once uploading is allowed on the Firebase config
         if (!values.resource) {
             showNotification('Error', ' Resource should be uploaded. Upload Resource and try again.', 'danger', mdiAlertCircle);
             return;
         } */

        const resourceData = {
            id: resourceId,
            title: values.title,
            description: values.description,
            resourceType: values.resourceType,
            resourceLink: values.resourceLink || '',
            resource: values.resource || '', // empty string for DEVELOPMENT purposes only. So that create won't fail
            resourceUploadedBy: userId.value   // this is the user that Uploaded the resource
        };

        await store.dispatch('library/addResource', resourceData);
        showNotification('Success', 'Resource created successfully.', 'success', mdiCheckCircle);
        router.push('/library');
    } catch (error) {
        generalError.value = error.message;
        showNotification('Error', 'Failed to create resource. Please try again.', 'danger', mdiAlertCircle);
    } finally {
        isLoading.value = false;
    }
});

const backToLibraryPage = () => {
    router.back();
};

const isDarkMode = computed(() => useDarkModeStore().isEnabled);

const fetchUser = async () => {
    try {
        const userData = await localforage.getItem('user')
        if (userData && userData.uid) {
            const userFound = await store.dispatch('user/getUser', userData.uid) // if returned true then pick it from the localForage
            if(userFound) userId.value = userData.uid;
        } else {
            console.error('User data not found in local storage.')
        }
    } catch (error) {
        console.error('Error fetching user:', error)
    }
}
</script>

<style scoped>
.text-red-500 {
    color: #f87171;
}
</style>