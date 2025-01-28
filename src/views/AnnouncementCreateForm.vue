<template>
    <LayoutAuthenticated>
        <div class="flex flex-col min-h-screen">
            <SectionMain>
                <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Create Announcement" main>
                    <BaseButton class="ml-12" label="Back to Announcements" color="contrast" rounded-full small
                        @click="backToAnnouncementsPage" />
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

                    <!-- Announcement Title -->
                    <FormField label="Announcement Title" class="dark:text-gray-200">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="title" name="title" placeholder="Enter Announcement Title"
                                :icon="mdiBook"
                                class="bg-gray-200 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 border dark:border-gray-700 rounded"
                                :disabled="isSubmitting || isLoading" />
                            <p v-if="titleError" class="text-red-500">{{ titleError }}</p>
                        </div>
                    </FormField>

                    <!-- Announcement Description -->
                    <FormField label="Announcement Description" class="dark:text-gray-200">
                        <div class="flex flex-col gap-y-1.5">
                            <FormControl v-model="description" type="textarea"
                                placeholder="Enter Full Announcement Description (1,000 characters allowed)" :disabled="isSubmitting || isLoading"
                                maxlength="1000"
                                class="bg-gray-200 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 border dark:border-gray-700 rounded" />
                            <p v-if="descriptionError" class="text-red-500">{{ descriptionError }}</p>
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
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useDarkModeStore } from '@/pinia/darkMode.js';
import { useRouter } from 'vue-router';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import { mdiBallotOutline, mdiCheckCircle, mdiAlertCircle, mdiBook } from '@mdi/js';
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

onMounted(() => {
    fetchUser();
});

const router = useRouter();
const store = useStore();
const isLoading = ref(false);
const generalError = ref('');
const userId = ref('Anonymous');
const notificationMessage = ref('');
const notificationTitle = ref('');
const notificationColor = ref('');
const notificationIcon = ref('');
const notificationsOutline = ref(true);

const schema = yup.object({
    title: yup.string().required().label('Announcement title is required.'),
    description: yup.string().required("Announcement description is required.").max(1000),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
    validationSchema: toTypedSchema(schema),
});

const { value: title, errorMessage: titleError } = useField('title');
const { value: description, errorMessage: descriptionError } = useField('description');

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
        const announcementId = `ann_${Date.now()}`;

        const announcementData = {
            id: announcementId,
            title: values.title,
            description: values.description,
            createdBy: userId.value,
            createdAt: new Date().toISOString(),
        };

        await store.dispatch('announcement/addAnnouncement', announcementData);
        showNotification('Success', 'Announcement created successfully.', 'success', mdiCheckCircle);
        router.push('/announcements');
    } catch (error) {
        generalError.value = error.message;
        showNotification('Error', 'Failed to create announcement. Please try again.', 'danger', mdiAlertCircle);
    } finally {
        isLoading.value = false;
    }
});

const backToAnnouncementsPage = () => {
    router.back();
};

const isDarkMode = computed(() => useDarkModeStore().isEnabled);

const fetchUser = async () => {
    try {
        const userData = await localforage.getItem('user');
        if (userData && userData.uid) {
            const userFound = await store.dispatch('user/getUser', userData.uid);
            if (userFound) userId.value = userData.uid;
        } else {
            console.error('User data not found in local storage.');
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};
</script>

<style scoped>
.text-red-500 {
    color: #f87171;
}
</style>