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
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
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
    mdiTwitter, mdiInstagram, mdiYoutube
} from '@mdi/js';
import SectionMain from '@/components/SectionMain.vue';
import CardBox from '@/components/CardBox.vue';
import FormField from '@/components/FormField.vue';
import FormControl from '@/components/FormControl.vue';
import BaseDivider from '@/components/BaseDivider.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseButtons from '@/components/BaseButtons.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';

const store = useStore();
const userId = ref('Anonymous');

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
            userId.value = userData.uid; // Store user ID for submission
            form.name = userData.name || 'Anonymous';
            form.email = userData.email || 'Anonymous';
        } else {
            console.error('User data not found in local storage.');
            form.name = 'Anonymous';
            form.email = 'Anonymous';
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    }
};

onMounted(fetchUser);

const submit = async () => {
    debugger;
    try {
        const contactData = {
            name: form.name || 'Anonymous',
            email: form.email || 'Anonymous',
            phone: form.phone || '',
            questionType: form.questionType.label,
            question: form.question,
            userId: userId.value
        };

        await store.dispatch('contact/addContactSubmission', contactData);
        alert('Your question has been submitted successfully.');
    } catch (error) {
        console.error('Error submitting question:', error);
    }
};
</script>
