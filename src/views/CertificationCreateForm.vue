<template>
    <SectionMain>
        <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Create Certification" main>
            <BaseButton label="Back to Certifications" color="contrast" rounded-full small
                @click="backToCertificationPage" />
        </SectionTitleLineWithButton>
        <CardBox is-form @submit.prevent="submit">
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

            <!-- Duration -->
            <FormField label="Duration (Hours)">
                <div class="flex flex-col gap-y-1.5">
                    <FormControl v-model="duration" type="number" placeholder="Enter duration in hours" :icon="mdiClock"
                        :disabled="isSubmitting || isLoading" />
                    <p v-if="durationError" class="text-red-500">{{ durationError }}</p>
                </div>
            </FormField>

            <!-- Start Date and Time -->
            <FormField label="Start Date & Time">
                <div class="flex flex-col gap-y-1.5">
                    <FormControl v-model="startDateTime" type="datetime-local" :icon="mdiCalendar"
                        :disabled="isSubmitting || isLoading" />
                    <p v-if="startDateTimeError" class="text-red-500">{{ startDateTimeError }}</p>
                </div>
            </FormField>

            <!-- Update Date and Time -->
            <FormField label="Last Updated Date & Time">
                <div class="flex flex-col gap-y-1.5">
                    <FormControl v-model="updateDateTime" type="datetime-local" :icon="mdiCalendar"
                        :disabled="isSubmitting || isLoading" />
                    <p v-if="updateDateTimeError" class="text-red-500">{{ updateDateTimeError }}</p>
                </div>
            </FormField>

            <!-- Instructor Name -->
            <FormField label="Course Given By">
                <div class="flex flex-col gap-y-1.5">
                    <FormControl v-model="givenBy" placeholder="Instructor's name" :icon="mdiSchool"
                        :disabled="isSubmitting || isLoading" />
                    <p v-if="givenByError" class="text-red-500">{{ givenByError }}</p>
                </div>
            </FormField>

            <!-- Attach Syllabus -->
            <FormField label="Attach Syllabus">
                <FormControl type="file" v-model="syllabus" :icon="mdiFile" placeholder="Upload syllabus"
                    :disabled="isSubmitting || isLoading" />
                <p v-if="syllabusError" class="text-red-500">{{ syllabusError }}</p>
            </FormField>

            <!-- Amount Due -->
            <FormField label="Amount Due">
                <div class="flex flex-col gap-y-1.5">
                    <FormControl v-model="amountDue" type="number" placeholder="Enter amount in USD" :icon="mdiCash"
                        :disabled="isSubmitting || isLoading" />
                    <p v-if="amountDueError" class="text-red-500">{{ amountDueError }}</p>
                </div>
            </FormField>

            <!-- Submit and Reset Buttons -->
            <template #footer>
                <BaseDivider />
                <BaseButton class="mr-6" type="submit" color="info" label="Submit" :disabled="isSubmitting || isLoading" />
                <BaseButton type="reset" color="info" outline label="Reset" @click="resetForm" />
            </template>
        </CardBox>
    </SectionMain>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { mdiBallotOutline, mdiAccount, mdiCalendar, mdiClock, mdiFile, mdiStar, mdiCash, mdiSchool } from '@mdi/js';
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
const isLoading = ref(false);
const generalError = ref('');

// Define the validation schema using yup
const schema = yup.object({
    title: yup.string().required().label('title'),
    description: yup.string().required("Description is required"),
    rating: yup.number().min(1).max(5).required("Rating must be between 1 and 5"),
    level: yup.string().required("Level is required"),
    isActive: yup.boolean(),
    duration: yup.number().min(1, "Duration must be at least 1 hour").required("Duration is required"),
    startDateTime: yup.date().required("Start date & time is required"),
    updateDateTime: yup.date(),
    givenBy: yup.string().required("Instructor's name is required"),
    syllabus: yup.mixed().required("Please attach a syllabus"),
    amountDue: yup.number().min(0, "Amount due must be at least 0").required("Amount due is required"),
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
    validationSchema: toTypedSchema(schema)
});

// Define individual fields with error message handling
const { value: title, errorMessage: titleError } = useField('title');
const { value: description, errorMessage: descriptionError } = useField('description');
const { value: rating, errorMessage: ratingError } = useField('rating');
const { value: level, errorMessage: levelError } = useField('level');
const { value: isActive, errorMessage: isActiveError } = useField('isActive');
const { value: duration, errorMessage: durationError } = useField('duration');
const { value: startDateTime, errorMessage: startDateTimeError } = useField('startDateTime');
const { value: updateDateTime, errorMessage: updateDateTimeError } = useField('updateDateTime');
const { value: givenBy, errorMessage: givenByError } = useField('givenBy');
const { value: syllabus, errorMessage: syllabusError } = useField('syllabus');
const { value: amountDue, errorMessage: amountDueError } = useField('amountDue');

const submit = handleSubmit(async (values) => {
    try {
        isLoading.value = true;
        // Form submission logic 
    } catch (error) {
        generalError.value = error.message;
    } finally {
        isLoading.value = false;
    }
});

const backToCertificationPage = () => {
    router.back();
};
</script>

<style scoped>
.text-red-500 {
    color: #f87171;
}
</style>
