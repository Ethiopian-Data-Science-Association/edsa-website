<template>
    <SectionMain>
        <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Contact Us" main>
            <div class="grid grid-cols-6 gap-4">
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
                <BaseButton href="https://youtube.com/" target="_blank" :icon="mdiYoutube" color="contrast"
                    rounded-full small />
            </div>

        </SectionTitleLineWithButton>
        <CardBox form @submit.prevent="submit">
            <FormField label="Name and Email">
                <FormControl v-model="form.name" :icon="mdiAccount" placeholder="Full name" />
                <FormControl v-model="form.email" type="email" :icon="mdiMail" placeholder="john.doe@example.com" />
            </FormField>

            <FormField label="Phone Number" help="Example: 0927716801">
                <FormControl v-model="form.phone" type="tel" placeholder="Your phone number" />
            </FormField>

            <FormField label="Help Type">
                <FormControl v-model="form.department" :options="selectOptions" />
            </FormField>

            <BaseDivider />

            <FormField label="Question" help="Your question. Max 400 characters">
                <FormControl type="textarea" placeholder="Explain how we can help you" maxlength="400" />
            </FormField>
            <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
            </BaseButtons>
        </CardBox>
    </SectionMain>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { mdiBallotOutline, mdiAccount, mdiMail, mdiGithub, mdiLinkedin, mdiFacebook, mdiTwitter, mdiInstagram, mdiYoutube } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadioGroup from '@/components/FormCheckRadioGroup.vue'
import FormFilePicker from '@/components/FormFilePicker.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import NotificationBarInCard from '@/components/NotificationBarInCard.vue'

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
]

const form = reactive({
    name: '',
    email: '',
    phone: '',
    department: selectOptions[0],
    subject: '',
    question: ''
})

const customElementsForm = reactive({
    checkbox: ['lorem'],
    radio: 'one',
    switch: ['one'],
    file: null
})

const submit = () => {
    //
}

const formStatusWithHeader = ref(true)

const formStatusCurrent = ref(0)

const formStatusOptions = ['info', 'success', 'danger', 'warning']

const formStatusSubmit = () => {
    formStatusCurrent.value = formStatusOptions[formStatusCurrent.value + 1]
        ? formStatusCurrent.value + 1
        : 0
}
</script>
