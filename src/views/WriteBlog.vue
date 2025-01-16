  <template>
  <LayoutAuthenticated>
    <SectionMain class="p-6 mb-6">
      <!-- Notification Bar -->
      <div v-if="notificationMessage !== ''" class="mb-4">
        <NotificationBar
          :color="notificationColor"
          :icon="notificationIcon"
          :outline="notificationsOutline"
        >
          <b>{{ notificationTitle }}</b
          >. {{ notificationMessage }}
          <template #right>
            <BaseButton
              label="Dismiss"
              :color="notificationsOutline ? notificationColor : 'white'"
              :outline="notificationsOutline"
              rounded-full
              small
              @click="clearNotification"
            />
          </template>
        </NotificationBar>
      </div>
      <div
        v-if="generalError"
        class="mb-4 p-4 text-rose-500 bg-rose-300 border border-red-400 rounded"
      >
        {{ generalError }}
      </div>
      <FormField label="Title" help="Please enter your title">
        <div class="flex flex-col gap-y-1.5">
          <FormControl v-model="title" name="title" :disabled="isSubmitting || isLoading" />
          <p v-if="titleError" class="mt-1 text-sm text-rose-500">{{ titleError }}</p>
        </div>
      </FormField>
      <div>
        <FormField label="Content" help="Please enter your content">
          <div class="flex flex-col gap-y-1.5">
            <Tiptap v-model="content" />
            <p v-if="contentError" class="mt-1 text-sm text-rose-500">{{ contentError }}</p>
          </div>
        </FormField>
      </div>
      <div class="flex justify-end py-6">
        <BaseButton type="submit" color="info" label="Submit" @click="submit" />
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
   
<script setup>
import { ref } from 'vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import BaseButton from '@/components/BaseButton.vue'
import Tiptap from '@/components/Tiptap.vue'
import SectionMain from '@/components/SectionMain.vue'
import { object, string } from 'yup'
import { toTypedSchema } from '@vee-validate/yup'
import { useForm, useField } from 'vee-validate'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import slugify from 'slugify'
import { mdiCheckCircle } from '@mdi/js'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import localforage from "localforage"

const store = useStore()
const router = useRouter()
const isLoading = ref(false)
const generalError = ref('')
const notificationMessage = ref('')
const notificationTitle = ref('')
const notificationColor = ref('')
const notificationIcon = ref('')
const notificationsOutline = ref(true)

const blogSchema = object({
  title: string()
    .required()
    .label('Title')
    .min(5, 'Title must be at least 5 characters long')
    .max(100, 'Title must not exceed 100 characters'),
  content: string()
    .min(300, 'Blog content should be atleast 300 words.')
    .required('Content is a required field')
    .label('Content')
})
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(blogSchema)
})

const { value: title, errorMessage: titleError } = useField('title')
const { value: content, errorMessage: contentError } = useField('content')

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

const submit = handleSubmit(async (values) => {
  const { uid } = await localforage.getItem('user');
  const slug = slugify(values.title.toLowerCase())
  const blogsData = {
    isPublished: false,
    ownerId: uid,
    publishedAt:  Date.now(),
    updatedAt: Date.now(),
    slug,
    ...values
  }
  try {
    isLoading.value = true
    await store.dispatch('blogs/addBlog', blogsData)
    showNotification('Success', 'Blog created successfully.', 'success', mdiCheckCircle)
    router.push('/blogs/my-blogs')
  } catch (error) {
    generalError.value = error.message
  } finally {
    isLoading.value = false
  }
})
</script>


