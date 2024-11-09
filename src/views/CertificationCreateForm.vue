<template>
    <SectionMain>
        <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Create Certification" main>
            <BaseButton label="Back to Certifications" color="contrast" rounded-full small
                @click="backToCertificationPage" />
        </SectionTitleLineWithButton>
        <CardBox form @submit.prevent="submit">
            <!-- Certification Title -->
            <FormField label="Certification Title">
                <FormControl v-model="form.title" placeholder="Enter certification title" :icon="mdiAccount" />
            </FormField>

            <!-- Certification Description -->
            <FormField label="Certification Description">
                <FormControl v-model="form.description" type="textarea" placeholder="Enter certification description" />
            </FormField>

            <!-- Certification Rating -->
            <FormField label="Certification Rating">
                <FormControl v-model="form.rating" type="number" placeholder="Enter rating (1-5)" :icon="mdiStar"
                    min="1" max="5" />
            </FormField>

            <!-- Certification Level -->
            <FormField label="Certification Level">
                <FormControl v-model="form.level" type="select" :options="['Beginner', 'Intermediate', 'Advanced']" />
            </FormField>

            <!-- Active Status Toggle -->
            <FormField label="Active Status">
                <FormControl v-model="form.isActive" type="checkbox" label="Is Active" />
            </FormField>

            <!-- Duration -->
            <FormField label="Duration (Hours)">
                <FormControl v-model="form.duration" type="number" placeholder="Enter duration in hours"
                    :icon="mdiClock" />
            </FormField>

            <!-- Start Date and Time -->
            <FormField label="Start Date & Time">
                <FormControl v-model="form.startDateTime" type="datetime-local" :icon="mdiCalendar" />
            </FormField>

            <!-- Update Date and Time -->
            <FormField label="Last Updated Date & Time">
                <FormControl v-model="form.updateDateTime" type="datetime-local" :icon="mdiCalendar" />
            </FormField>

            <!-- Instructor Name -->
            <FormField label="Course Given By">
                <FormControl v-model="form.givenBy" placeholder="Instructor's name" :icon="mdiSchool" />
            </FormField>

            <!-- Attach Syllabus -->
            <FormField label="Attach Syllabus">
                <FormControl type="file" v-model="form.syllabus" :icon="mdiFile" placeholder="Upload syllabus" />
            </FormField>

            <!-- Amount Due -->
            <FormField label="Amount Due">
                <FormControl v-model="form.amountDue" type="number" placeholder="Enter amount in USD" :icon="mdiCash" />
            </FormField>

            <!-- Submit and Reset Buttons -->
            <template #footer>
                <BaseDivider />
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
            </template>
        </CardBox>
    </SectionMain>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
import { mdiBallotOutline, mdiAccount, mdiCalendar, mdiClock, mdiFile, mdiStar, mdiCash, mdiSchool } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButton from '@/components/BaseButton.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'

const router = useRouter();

const form = reactive({
    title: '',
    description: '',
    rating: null,
    level: 'Intermediate',
    isActive: false,
    duration: '',
    startDateTime: '',
    updateDateTime: '',
    givenBy: '',
    syllabus: null,
    amountDue: ''
})

const submit = () => {
    // Submit form logic
}
const backToCertificationPage = () => {
    router.back()
}
</script>
