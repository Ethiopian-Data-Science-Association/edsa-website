<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useMainStore } from '@/pinia/main'
import localforage from 'localforage'
import {
  mdiAccount,
  mdiMail,
  mdiAsterisk,
  mdiFormTextboxPassword,
  mdiGithub,
  mdiCheckCircle,
  mdiAlertCircle,
  mdiAccountCircle
} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import FormFilePicker from '@/components/FormFilePicker.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import UserCard from '@/components/UserCard.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import * as yup from 'yup'
import { useForm, useField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import { useStore } from 'vuex'
import NotificationBar from '@/components/NotificationBar.vue'
import { paths } from '@/shared/constants/paths'

const mainStore = useMainStore()

const store = useStore()

const profileForm = reactive({
  uid: '',
  name: '',
  email: '',
  avatar: mainStore.userAvatar || null
})

const isLoading = ref(false)
const passportPhoto = ref(null)
const generalError = ref('')
const notificationMessage = ref('')
const notificationTitle = ref('')
const notificationColor = ref('')
const notificationIcon = ref('')
const notificationsOutline = ref(true)

const showNotification = (title, message, color, icon) => {
  notificationTitle.value = title
  notificationMessage.value = message
  notificationColor.value = color
  notificationIcon.value = icon
}

const clearNotification = () => {
  notificationMessage.value = ''
  notificationTitle.value = ''
  notificationColor.value = ''
  notificationIcon.value = ''
}

const passwordSchema = yup.object({
  passwordCurrent: yup
    .string()
    .required('Current password is required')
    .min(8, 'Minimum 8 characters')
    .max(50, 'Maximum 50 characters'),
  password: yup
    .string()
    .required('New password is required')
    .min(8, 'Minimum 8 characters')
    .max(50, 'Maximum 50 characters'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required')
})

const { resetForm, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(passwordSchema)
})

const { value: passwordCurrent, errorMessage: passwordCurrentError } = useField('passwordCurrent')
const { value: password, errorMessage: passwordError } = useField('password')
const { value: confirmPassword, errorMessage: confirmPasswordError } = useField('confirmPassword')

const submitProfile = async () => {
  try {
    await store.dispatch('user/updateUserProfile', profileForm)
    showNotification('Success', 'Profile updated successfully.', 'success', mdiCheckCircle)
  } catch (error) {
    showNotification('Error', 'Failed to update profile.', 'danger', mdiAlertCircle)
  }
}

const submitPass = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    const passwordData = {
      currentPassword: values.passwordCurrent,
      newPassword: values.password,
      confirmNewPassword: values.confirmPassword
    }
    const passwordUpdateResponse = await store.dispatch('auth/updateUserPassword', passwordData)
    showNotification('Success', passwordUpdateResponse, 'success', mdiCheckCircle)
  } catch (error) {
    generalError.value = error.message
    showNotification(
      'Error',
      'Failed to update password. Please try again.',
      'danger',
      mdiAlertCircle
    )
  } finally {
    isLoading.value = false
  }
})


onMounted(() => {
  fetchUser();
});

const fetchUser = async () => {
  try {
    const userData = await localforage.getItem('user');
    if (userData && userData.uid) {
      const userFound = await store.dispatch('user/getUser', userData.uid);
      if (userFound) {
        const user = computed(() => store.getters['user/userData']);
        profileForm.uid = user.value.uid;
        profileForm.name = user.value.fullName || '';
        profileForm.email = user.value.email;
      }
    } else {
      console.error('User data not found in local storage.');
    }
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

// **Photo Upload Handling**
const avatarSizeLimit = 500 * 1024 // 500KB
const avatarError = ref('')

const onAvatarUpload = async (file) => {
  if (file.size > avatarSizeLimit) {
    avatarError.value = 'File size exceeds 500KB limit.'
    showNotification('Error', avatarError.value, 'danger', mdiAlertCircle)
    return
  }
  avatarError.value = ''
  profileForm.avatar = file
  // Upload file via shared module
  try {
    const metadata = { contentType: file.type.toString() };
    const uploadPath = `${paths.PROFILE_UPLOAD_PATH}${Date.now()}_${file.name}`; // Unique upload path
    await store.dispatch('shared/uploadDocument', {
      payload: {
        document: file,
        documentStoragePath: uploadPath,
        metadata,
      },
    });
    showNotification('Success', 'Avatar uploaded successfully.', 'success', mdiCheckCircle);
  } catch (error) { // emit failed to upload event
    showNotification('Error', 'Failed to upload avatar.', 'danger', mdiAlertCircle);
  }
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAccount" title="Profile" main>
      </SectionTitleLineWithButton>

      <UserCard class="mb-6" />

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

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <CardBox is-form @submit.prevent="submitProfile" :rounded="''">
          <!-- **Avatar Upload** -->
          <FormField label="Avatar" help="Max 500KB">
            <FormFilePicker label="Upload" v-model="passportPhoto" :icon="mdiAccountCircle" :is-round-icon="true"
              :disabled="isSubmitting || isLoading" :documentStoragePath="paths.PROFILE_UPLOAD_PATH"
              @update:modelValue="onAvatarUpload" />
            <p v-if="avatarError" class="text-red-500 text-sm">{{ avatarError }}</p>
          </FormField>
          <FormField label="Name" help="Required. Your Full Name." placeholder="Name">
            <FormControl v-model="profileForm.name" :icon="mdiAccount" name="username" required
              autocomplete="username" />
          </FormField>
          <FormField label="E-mail" help="Required. Your e-mail address can not be edited.">
            <FormControl v-model="profileForm.email" :icon="mdiMail" type="email" name="email" required
              :is-read-only="true" autocomplete="email" />
          </FormField>

          <template #footer>
            <BaseButtons>
              <BaseButton color="info" type="submit" label="Submit" />
              <BaseButton color="info" label="Cancel" outline :onclick="resetForm" />
            </BaseButtons>
          </template>
        </CardBox>

        <CardBox is-form @submit.prevent="submitPass" :rounded="''">
          <div v-if="generalError" class="mb-4 p-4 text-rose-500 bg-rose-300 border border-red-400 rounded">
            {{ generalError }}
          </div>
          <FormField label="Current password" help="Required. Your current password">
            <div class="flex flex-col gap-y-1.5">
              <FormControl v-model="passwordCurrent" :icon="mdiAsterisk" name="passwordCurrent" type="password"
                autocomplete="current-password" :disabled="isSubmitting || isLoading" />
              <p v-if="passwordCurrentError" class="mt-1 text-sm text-rose-500">
                {{ passwordCurrentError }}
              </p>
            </div>
          </FormField>
          <BaseDivider />

          <FormField label="New password" help="Required. New password">
            <div class="flex flex-col gap-y-1.5">
              <FormControl v-model="password" :icon="mdiFormTextboxPassword" name="password" type="password"
                autocomplete="new-password" :disabled="isSubmitting || isLoading" />
              <p v-if="passwordError" class="mt-1 text-sm text-rose-500">{{ passwordError }}</p>
            </div>
          </FormField>

          <FormField label="Confirm password" help="Required. New password one more time">
            <div class="flex flex-col gap-y-1.5">
              <FormControl v-model="confirmPassword" :icon="mdiFormTextboxPassword" name="confirmPassword"
                type="password" autocomplete="new-password" :disabled="isSubmitting || isLoading" />
              <p v-if="confirmPasswordError" class="mt-1 text-sm text-rose-500">
                {{ confirmPasswordError }}
              </p>
            </div>
          </FormField>

          <template #footer>
            <BaseButtons>
              <BaseButton type="submit" color="info" label="Submit" :disabled="isSubmitting || isLoading" />
              <BaseButton color="info" label="Cancel" outline :disabled="isSubmitting || isLoading"
                :onclick="resetForm" />
            </BaseButtons>
          </template>
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
