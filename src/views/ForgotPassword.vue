<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <div
          v-if="generalError"
          class="mb-4 p-4 text-rose-500 bg-rose-300 border border-red-400 rounded"
        >
          {{ generalError }}
        </div>
        <FormField label="Email" help="Please enter your email">
          <div class="flex flex-col gap-y-1.5">
            <FormControl
              v-model="email"
              :icon="mdiAccount"
              name="email"
              autocomplete="username"
              :disabled="isSubmitting || isLoading"
            />
            <p v-if="emailError" class="mt-1 text-sm text-rose-500">{{ emailError }}</p>
          </div>
        </FormField>
        <template #footer>
          <BaseButtons class="flex flex-row">
            <BaseButton type="submit" color="info" label="Reset" />
            <BaseButton to="/" color="info" outline label="Back" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
<script>
import { GoogleAuthProvider } from 'firebase/auth'
export const googleAuthProvider = new GoogleAuthProvider()
</script>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount } from '@mdi/js'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import * as yup from 'yup'
import { toTypedSchema } from '@vee-validate/yup'
import { useForm, useField } from 'vee-validate'
import { useFirebaseAuth } from 'vuefire'
import { sendPasswordResetEmail } from 'firebase/auth'

const isLoading = ref(false)
const generalError = ref('')

const auth = useFirebaseAuth()

const forgetPasswordSchema = yup.object({
  email: yup.string().required().label('Email').email()
})
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(forgetPasswordSchema)
})

const { value: email, errorMessage: emailError } = useField('email')

const router = useRouter()

const submit = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    await sendPasswordResetEmail(auth, values.email, {
      url: import.meta.env.VITE_BASE_URL
    })
    router.replace('/')
  } catch (error) {
    generalError.value = error.message
  } finally {
    isLoading.value = false
  }
})
</script>
