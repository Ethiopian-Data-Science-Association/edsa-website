<script setup>
import { mdiAccount, mdiAsterisk, mdiEmail } from '@mdi/js'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { toTypedSchema } from '@vee-validate/yup'
import { ref } from 'vue'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'

const signupSchema = yup.object({
  name: yup.string().required().label('Full name').min(2).max(50),
  email: yup.string().required().label('Email').email(),
  password: yup.string().required().label('Password').min(8).max(50),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match.')
    .required('Confirm password is required.')
})

const auth = useFirebaseAuth()
const isLoading = ref(false)
const errorMessage = ref('')

const { handleSubmit, isSubmitting  } = useForm({
  validationSchema: toTypedSchema(signupSchema)
})

const { value: name, errorMessage: nameError } = useField('name')
const { value: email, errorMessage: emailError } = useField('email')
const { value: password, errorMessage: passwordError } = useField('password')
const { value: confirmPassword, errorMessage: confirmPasswordError } = useField('confirmPassword') // New confirm password field

const router = useRouter()

const submit = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    const { user } = await createUserWithEmailAndPassword(auth, values.email, values.password)
    await updateProfile(user, { displayName: values.name })
    router.replace('/dashboard')
  } catch (error) {
    console.log(error)
    errorMessage.value(error.message)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <div v-if="generalError" class="mb-4 p-4 text-rose-500 bg-rose-300 border border-red-400 rounded">
          {{ errorMessage }} 
        </div>
        <FormField label="Fullname" help="Please enter your fullname">
          <div class="flex flex-col gap-y-1.5">
            <FormControl
              v-model="name"
              :icon="mdiAccount"
              name="name"
              :disabled="isSubmitting"
            />
            <p v-if="nameError" class="mt-1 text-sm text-rose-500">{{ nameError }}</p>
          </div>
        </FormField>
        <FormField label="Email" help="Please enter your email">
          <div class="flex flex-col gap-y-1.5">
            <FormControl
              v-model="email"
              :icon="mdiEmail"
              name="email"
              :disabled="isSubmitting"
            />
            <p v-if="emailError" class="text-sm text-rose-500">{{ emailError }}</p>
          </div>
        </FormField>

        <FormField label="Password" help="Please enter your password">
          <div class="flex flex-col gap-y-1.5">
            <FormControl
              v-model="password"
              :icon="mdiAsterisk"
              type="password"
              name="password"
              :disabled="isSubmitting"
            />
            <p v-if="passwordError" class="mt-1 text-sm text-rose-500">{{ passwordError }}</p>
          </div>
        </FormField>
        <FormField label="Confirm Password" help="Please confirm your password">
          <div class="flex flex-col gap-y-1.5">
            <FormControl
              v-model="confirmPassword"
              :icon="mdiAsterisk"
              type="password"
              name="confirmPassword"
            />
            <p v-if="confirmPasswordError" class="mt-1 text-sm text-rose-500">
              {{ confirmPasswordError }}
            </p>
          </div>
        </FormField>

        <template #footer>
          <BaseButtons>
            <BaseButton
              type="submit"
              color="info"
              :label="isLoading ? 'Loading...' : 'Signup'"
              :disabled="isSubmitting"
            />
            <BaseButton
              to="/dashboard"
              color="info"
              outline
              label="Back"
              :disabled="isSubmitting"
            />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
