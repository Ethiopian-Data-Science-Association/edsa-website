  <template>
  <LayoutAuthenticated>
    <SectionMain class="p-6 mb-6" >
      <div
        v-if="generalError"
        class="mb-4 p-4 text-rose-500 bg-rose-300 border border-red-400 rounded"
      >
      </div>
      <FormField label="Title" help="Please enter your title">
        <div class="flex flex-col gap-y-1.5">
          <FormControl
            v-model="title"
            name="title"
            :disabled="isSubmitting || isLoading"
          />
          <p v-if="titleError" class="mt-1 text-sm text-rose-500">{{ titleError }}</p>
        </div>
      </FormField>
      <div>
        <FormField label="Content" help="Please enter your content">
          <div class="flex flex-col gap-y-1.5">
            <QuillEditor
              v-model="content"
              name="content"
              onchange="onContentChange"
              v-on:update:content="onContentChange"
              theme="snow"
              class="my-4 dark:border-gray-300 border-gray-500 rounded-md text-gray-800 dark:text-white lg:text-xl text-lg"
            />
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
import SectionMain from '@/components/SectionMain.vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { object, string, array } from 'yup'
import { toTypedSchema } from '@vee-validate/yup'
import { useForm, useField } from 'vee-validate'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'

const isLoading = ref(false)
const generalError = ref('')

const blogSchema = object({
  title: string()
    .required()
    .label('Title')
    .min(5, 'Title must be at least 5 characters long')
    .max(100, 'Title must not exceed 100 characters'),
  content: object({
    ops: array()
      .of(
        object({
          insert: string()
            .test(
              'non-empty-string',
              'Content is a required field',
              (value) => value && value.trim() !== ''
            ),
        }).required("Content is a required field")
      )
      .required("Content is a required field"),
  })
  .required("Content is a required field")
  .label('Content')
})
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(blogSchema)
})

const { value: title, errorMessage: titleError } = useField('title')
const { value: content, errorMessage: contentError } = useField('content')

const onContentChange = (newContent) => {
  console.log(newContent)
  content.value = newContent
}

const submit = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    // Your submission logic here, using values.title and content.value
  } catch (error) {
    generalError.value = error.message
  } finally {
    isLoading.value = false
  }
})
</script>