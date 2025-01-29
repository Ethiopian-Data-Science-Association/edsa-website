<template>
    <SectionMain>
        <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Contact Us" main>
            <div class="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-4">
                <BaseButton href="https://github.com/Ethiopian-Data-Science-Association/edsa-website" target="_blank"
                    :icon="mdiGithub" color="contrast" rounded-full small />
                <BaseButton href="https://twitter.com/your-profile" target="_blank" :icon="mdiTwitter" color="contrast"
                    rounded-full small />
                <BaseButton href="https://linkedin.com/in/your-profile" target="_blank" :icon="mdiLinkedin"
                    color="contrast" rounded-full small />
                <BaseButton href="https://facebook.com/your-profile" target="_blank" :icon="mdiFacebook"
                    color="contrast" rounded-full small />
                <BaseButton href="https://instagram.com/your-profile" target="_blank" :icon="mdiInstagram"
                    color="contrast" rounded-full small />
                <BaseButton href="https://youtube.com/" target="_blank" :icon="mdiYoutube" color="contrast" rounded-full
                    small />
            </div>
        </SectionTitleLineWithButton>

        <!-- Notification Bar -->
        <div v-if="notificationMessage !== ''" class="mb-4">
            <NotificationBar :color="notificationColor" :icon="notificationIcon" :outline="notificationsOutline">
                <b>{{ notificationTitle }}</b>. {{ notificationMessage }}
                <template #right>
                    <BaseButton label="Dismiss" :color="notificationsOutline ? notificationColor : 'white'"
                        :outline="notificationsOutline" rounded-full small @click="clearNotification" />
                </template>
            </NotificationBar>
        </div>

        <CardBox is-form @submit.prevent="submit">
            <FormField label="Name and Email">
                <FormControl v-model="form.name" :icon="mdiAccount" placeholder="Full name" />
                <FormControl v-model="form.email" type="email" :icon="mdiMail" placeholder="john.doe@example.com" />
            </FormField>

            <FormField label="Phone Number" help="Example: 0927716801">
                <FormControl v-model="form.phone" type="tel" placeholder="Your phone number" />
            </FormField>

            <FormField label="Help Type">
                <FormControl v-model="form.questionType" :options="selectOptions" />
            </FormField>

            <BaseDivider />

            <FormField label="Question" help="Your question. Max 1000 characters">
                <FormControl v-model="form.question" type="textarea" placeholder="Explain how we can help you"
                    maxlength="1000" />
            </FormField>

            <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" :disabled="isSubmitting" />
                <BaseButton type="reset" color="info" outline label="Reset" @click="resetForm" />
            </BaseButtons>
        </CardBox>
    </SectionMain>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import localforage from 'localforage';
import {
    mdiBallotOutline, mdiAccount, mdiMail, mdiGithub, mdiLinkedin, mdiFacebook,
    mdiTwitter, mdiInstagram, mdiYoutube, mdiCheckCircle, mdiAlertCircle
} from '@mdi/js';
import SectionMain from '@/components/SectionMain.vue';
import CardBox from '@/components/CardBox.vue';
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import BaseDivider from '@/components/BaseDivider.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import NotificationBar from '@/components/NotificationBar.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';

const store = useStore();
const isSubmitting = ref(false);
const userId = ref('');
const notificationMessage = ref('');
const notificationTitle = ref('');
const notificationColor = ref('');
const notificationIcon = ref('');
const notificationsOutline = ref(true);

const selectOptions = [
    { id: 1, label: 'Technical Support' },
    { id: 2, label: 'Membership Inquiries' },
    { id: 3, label: 'Data Science Training' },
    { id: 4, label: 'Research Collaboration' },
    { id: 5, label: 'Event Participation' },
    { id: 6, label: 'Networking Opportunities' },
    { id: 7, label: 'Career Advice' },
    { id: 8, label: 'Project Partnerships' },
    { id: 9, label: 'Volunteering Opportunities' },
    { id: 10, label: 'Other' }
];

const form = reactive({
    name: '',
    email: '',
    phone: '',
    questionType: selectOptions[0],
    question: ''
});

// Fetch user data
const fetchUser = async () => {
    try {
        const userData = await localforage.getItem('user');
        if (userData && userData.uid) {
            await store.dispatch('user/getUser', userData.uid);
            userId.value = userData.uid;
            form.name = userData.name || '';
            form.email = userData.email || '';
        } else {
            console.error('User data not found in local storage.');
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};

onMounted(fetchUser);

// Show notification
const showNotification = (title, message, color, icon) => {
    notificationTitle.value = title;
    notificationMessage.value = message;
    notificationColor.value = color;
    notificationIcon.value = icon;
};

// Clear notification
const clearNotification = () => {
    notificationMessage.value = '';
    notificationTitle.value = '';
    notificationColor.value = '';
    notificationIcon.value = '';
};

// Reset form after submission
const resetForm = () => {
    form.name = userId.value ? form.name : '';
    form.email = userId.value ? form.email : '';
    form.phone = '';
    form.questionType = selectOptions[0];
    form.question = '';
};

// Submit form
const submit = async () => {
    try {
        isSubmitting.value = true;
        const contactData = {
            name: form.name || '',
            email: form.email || '',
            phone: form.phone || '',
            questionType: form.questionType.label,
            question: form.question,
            userId: userId.value || 'Anonymous',
            createdAt: new Date().toISOString()
        };

        await store.dispatch('contact/addContactSubmission', contactData);
        showNotification('Success', 'Your question has been submitted successfully.', 'success', mdiCheckCircle);
        resetForm();
    } catch (error) {
        console.error('Error submitting question:', error);
        showNotification('Error', 'Failed to submit your question. Please try again.', 'danger', mdiAlertCircle);
    } finally {
        isSubmitting.value = false;
    }
};
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
</style>