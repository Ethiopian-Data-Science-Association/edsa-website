<script>
import { GoogleAuthProvider } from 'firebase/auth'
export const googleAuthProvider = new GoogleAuthProvider()
</script>
<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk, mdiGoogle } from '@mdi/js'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import * as yup from 'yup'
import { toTypedSchema } from '@vee-validate/yup'
import { useForm, useField } from 'vee-validate'
import { useFirebaseAuth } from 'vuefire'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'

const isLoading = ref(false);
const generalError = ref('');
const store = useStore();

const auth = useFirebaseAuth()

const loginSchema = yup.object({
  email: yup.string().required().label('Email').email(),
  password: yup.string().required().label('Password').min(8).max(50),
  remember: yup.boolean().default('true')
})
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(loginSchema)
})

const { value: email, errorMessage: emailError } = useField('email')
const { value: password, errorMessage: passwordError } = useField('password')
const { value: remember } = useField('remember')

const router = useRouter()

const submit = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    const { user } = await signInWithEmailAndPassword(auth, values.email, values.password);
    await store.dispatch('user/setUser', user);
    router.replace('/')
  } catch (error) {
    generalError.value = error.message
  } finally {
    isLoading.value = false
  }
})

const loginWithGoogle = async () => {
  try {
    isLoading.value = true
    const { user } = await signInWithPopup(auth, googleAuthProvider)
    await store.dispatch('user/setUser', user);
    await store.dispatch('user/checkUserAcl', user);
    router.replace('/')
  } catch (error) {
    generalError.value = error.message
  } finally { isLoading.value = false }

}
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <div v-if="generalError" class="mb-4 p-4 text-rose-500 bg-rose-300 border border-red-400 rounded">
          {{ generalError }}
        </div>
        <FormField label="Email" help="Please enter your email">
          <div class="flex flex-col gap-y-1.5">
            <FormControl v-model="email" :icon="mdiAccount" name="email" autocomplete="username"
              :disabled="isSubmitting || isLoading" />
            <p v-if="emailError" class="mt-1 text-sm text-rose-500">{{ emailError }}</p>
          </div>
        </FormField>

        <FormField label="Password" help="Please enter your password">
          <div class="flex flex-col gap-y-1.5">
            <FormControl v-model="password" :icon="mdiAsterisk" type="password" name="password"
              autocomplete="current-password" :disabled="isSubmitting || isLoading" />
            <p v-if="passwordError" class="mt-1 text-sm text-rose-500">{{ passwordError }}</p>
          </div>
        </FormField>

        <FormCheckRadio v-model="remember" name="remember" label="Remember" :input-value="true" />
        <div class="mt-3 text-base underline">
          <RouterLink to="/forgot-password">Forgot Password</RouterLink>
          <RouterLink to="/signup" class="ml-6">Create an Account!</RouterLink>
        </div>
        <template #footer>
          <div class="flex flex-col gap-y-3">
            <BaseButtons class="flex flex-row">
              <BaseButton type="submit" color="info" label="Login" />
              <BaseButton to="/" color="info" outline label="Back" />
            </BaseButtons>

            <div class="flex gap-x-2 justify-center items-center">
              <hr class="border-gray-700 w-full" />
              or
              <hr class="border-gray-700 w-full" />
            </div>
            <BaseButton :icon="mdiGoogle" color="info" outline label="Login with Google"
              :disabled="isSubmitting || isLoading" @click="loginWithGoogle" />
          </div>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
