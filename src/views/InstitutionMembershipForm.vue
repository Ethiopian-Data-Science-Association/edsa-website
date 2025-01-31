<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { toTypedSchema } from '@vee-validate/yup'
import localforage from 'localforage'
import {
  mdiPhone, mdiPhoneClassic, mdiOfficeBuilding, mdiFilePdfBox, mdiEmail, mdiCheckCircle, mdiAlertCircle
} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButton from '@/components/BaseButton.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import NotificationBar from '@/components/NotificationBar.vue';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import { roles } from '@/shared/constants/roles';

// **Yup Validation Schema**
const formSchema = yup.object({
  institutionName: yup.string().required('Institution name is required'),
  headquarter: yup.string().required('headquarter location country name is required'),
  workPlaceEmail: yup.string().email('Enter a valid institution email address').required('Email is required'),
  workPlaceName: yup.string().required('Institution Name is required'),
  workPlaceRegion: yup.string().required('Region is required'),
  workPlaceZone: yup.string().required('Zone is required'),
  workPlaceWoreda: yup.string().required('Woreda is required'),
  workPlaceKebele: yup.string(),
  workPlacePhoneNumber: yup.string().matches(/^\d{9,15}$/, 'Phone or Mobile number is required. Example: 0116261087 , 0927716801'),
  workPlaceMobileNumber: yup.string(),
  fullName: yup.string().required('Full name is required'),
  signDate: yup.date().required('Signature date is required').max(new Date(), 'Date cannot be in the future'),
})

//   **Initialize Form Validation**
const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: toTypedSchema(formSchema),
})

// ✅ **Fields with Validation**
const { value: institutionName, errorMessage: institutionNameError } = useField('institutionName')
const { value: headquarter, errorMessage: headquarterError } = useField('headquarter')
const { value: workPlaceEmail, errorMessage: workPlaceEmailError } = useField('workPlaceEmail')
const { value: workPlaceName, errorMessage: workPlaceNameError } = useField('workPlaceName')
const { value: workPlaceRegion, errorMessage: workPlaceRegionError } = useField('workPlaceRegion')
const { value: workPlaceZone, errorMessage: workPlaceZoneError } = useField('workPlaceZone')
const { value: workPlaceWoreda, errorMessage: workPlaceWoredaError } = useField('workPlaceWoreda')
const { value: workPlaceKebele, errorMessage: workPlaceKebeleError } = useField('workPlaceKebele')
const { value: workPlacePhoneNumber, errorMessage: workPlacePhoneNumberError } = useField('workPlacePhoneNumber')
const { value: workPlaceMobileNumber } = useField('workPlaceMobileNumber')
const { value: fullName, errorMessage: fullNameError } = useField('fullName')
const { value: signDate, errorMessage: signDateError } = useField('signDate')


const isLoading = ref(false);

// **Firestore Integration**
const store = useStore()
const userId = ref('')

// **Fetch User Function**
const fetchUser = async () => {
  try {
    const userData = await localforage.getItem('user')
    if (userData && userData.uid) {
      const userFound = await store.dispatch('user/getUser', userData.uid)
      if (userFound) userId.value = userData.uid
    } else {
      console.error('User data not found in local storage.')
    }
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}


// **Notifications**
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

// **Submit Form**
const submit = handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    if (!userId.value) {
      showNotification('Error', 'User authentication is required. Please go to Login page and Sign In or Sign Up.', 'danger', mdiAlertCircle)
      return
    }

    // Check if membership already exists
    const existingMember = await store.dispatch('member/checkMembership', userId.value)
    if (existingMember) {
      showNotification('Error', 'You have already registered for membership.', 'danger', mdiAlertCircle)
      return
    }

    // Store data
    const memberData = {
      uid: userId.value,
      membershipType: roles.INSTITUTION,
      ...values,
      createdAt: new Date().toISOString()
    }

    await store.dispatch('member/addMember', memberData)
    showNotification('Success', 'Membership registered successfully.', 'success', mdiCheckCircle)
    resetForm()
  } catch (error) {
    console.error('Error submitting membership:', error)
    showNotification('Error', 'Failed to register membership. Please try again.', 'danger', mdiAlertCircle)
  } finally {
    isLoading.value = false;
  }
})

// **Fetch user data on mount**
onMounted(fetchUser)
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitle title="የሲቪል ማኅበረሰብ ድርጅቶች ባለስልጣን ምዝገባ ፎርም" />
      <div v-if="notificationMessage !== ''" class="mb-4">
        <NotificationBar :color="notificationColor" :icon="notificationIcon" :outline="notificationsOutline">
          <b>{{ notificationTitle }}</b>. {{ notificationMessage }}
          <template #right>
            <BaseButton label="Dismiss" :color="notificationsOutline ? notificationColor : 'white'"
              :outline="notificationsOutline" rounded-full small @click="clearNotification" />
          </template>
        </NotificationBar>
      </div>
      <CardBox is-form @submit.prevent="submit">
        <div class="flex justify-center">
          <div class="text-2xl font-bold">ክፍል አንድ</div>
        </div>
        <div class="text-center text-lg mb-4">የኢትዮጵያ ዳታ ሳይንስ ማህበር የተቋም አባልነት ቅጽ</div>
        <BaseDivider />

        <!-- Name -->
        <FormField label="1. የተቋሙ ስም">
          <FormControl v-model="institutionName" placeholder="የተቋሙ ስም" />
          <p v-if="institutionNameError" class="text-red-500">{{ institutionNameError }}</p>
        </FormField>

        <!-- Headquarter -->
        <FormField label="2. ዋና መሥሪያ ቤት መገኛ">
          <FormControl v-model="headquarter" placeholder="ዋና መሥሪያ ቤት መገኛ" :icon="mdiOfficeBuilding" />
          <p v-if="headquarterError" class="text-red-500">{{ headquarterError }}</p>
        </FormField>

        <FormField label="3. ተቋም ኢሜል">
          <div class="grid grid-cols-1 gap-4 mt-4">
            <FormControl v-model="workPlaceEmail" type="email" placeholder="ኢ-ሜይል" :icon="mdiEmail" />
            <p v-if="workPlaceEmailError" class="text-red-500">{{ workPlaceEmailError }}</p>
          </div>
        </FormField>

        <FormField label="4. የሥራ አድራሻ">
          <FormControl v-model="workPlaceName" placeholder="የመስሪያ ቤቱ ስም" />
          <p v-if="workPlaceNameError" class="text-red-500">{{ workPlaceNameError }}</p>

          <div class="grid grid-cols-4 gap-4 mt-4">
            <FormControl v-model="workPlaceRegion" placeholder="ክልል/ከተማ አስተዳድር" />
            <p v-if="workPlaceRegionError" class="text-red-500">{{ workPlaceRegionError }}</p>

            <FormControl v-model="workPlaceZone" placeholder="ዞን/ክ/ከተማ" />
            <p v-if="workPlaceZoneError" class="text-red-500">{{ workPlaceZoneError }}</p>

            <FormControl v-model="workPlaceWoreda" placeholder="ወረዳ" />
            <p v-if="workPlaceWoredaError" class="text-red-500">{{ workPlaceWoredaError }}</p>

            <FormControl v-model="workPlaceKebele" placeholder="ቀበሌ" />
            <p v-if="workPlaceKebeleError" class="text-red-500">{{ workPlaceKebeleError }}</p>

          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <FormControl v-model="workPlacePhoneNumber" type="tel" placeholder="ስልክ ቁጥር" :icon="mdiPhoneClassic" />
            <p v-if="workPlacePhoneNumberError" class="text-red-500">{{ workPlacePhoneNumberError }}</p>
            <FormControl v-model="workPlaceMobileNumber" type="tel" placeholder="ስልክ ቁጥር (ሞባይል)" :icon="mdiPhone" />
          </div>
        </FormField>

        <div class="mt-8 mb-4">
          <p class="text-sm">እኔ ከዚህ በላይ ስሜ እና አዳራሻዬ የተገለፀው የሰጠሁት መረጃ በሙሉ ትክክለኛና እውነተኛ
            ስለመሆኑ አረጋግጣለሁ፡፡ ይህ ክፍል እንደ ፊርማ ያገለግላል።</p>
        </div>

        <FormField label="የተቋሙ ወኪል ሙሉ ስም">
          <FormControl v-model="fullName" type="text" placeholder="ሙሉ ስም" />
          <p v-if="fullNameError" class="text-red-500">{{ fullNameError }}</p>
        </FormField>

        <FormField label="ቀን">
          <FormControl v-model="signDate" type="date" hint="ቀን/ወር/ዓ.ም" />
          <p v-if="signDateError" class="text-red-500">{{ signDateError }}</p>
        </FormField>

        <ol class="list-decimal pl-6 mt-4 text-sm">
          <li>ሁሉም የድርጅቱን ስራ አመራር ቦርድ አባላት፣ ስራ አስፈፃሚ ኮሚቴ አባላት እና ስራ አስኪያጅ (ተመርጦ ከቀረበ ብቻ) ያጠቃልላል፤</li>
          <li>ሙሉ ስም ከነማዕረጉ መፃፍ ይኖርበታል፤</li>
          <li>የድርጅቱ መስራች፣ ስራ አመራር ቦርድ አባል ወይም ስራ አስፈፃሚ ኮሚቴ አባል ወይም ስራ አስኪያጅ ተብሎ ይሞላል፤</li>
          <li>በሲቪል ማህበረሰብ ድርጅቶች አዋጅ ቁጥር 1113/2011 እንቀፅ 59(1)(መ) እና 59(7) መሰረት በሀሰት የተዘጋጀ ወይም የተጭበረበረ ሰነድ
            ማቅረብ የምዝገባ ጥያቄን ውድቅ የሚያደርግ ሲሆን በማታለል ወይም በማጭበርበር መመዝገብ ድርጅቱ እንዲፈርስ ምክንያት ይሆናል፤ የህግ
            ተጠያቂነትም ይኖረዋል፤</li>
        </ol>
        <!-- Submit , Generate and Reset Buttons -->
        <template #footer>
          <BaseDivider />
          <BaseButton class="mr-6" type="submit" color="info" outline label="Submit"
            :disabled="isSubmitting || isLoading" />
          <BaseButton class="mr-6" type="reset" color="info" outline label="Reset" @click="resetForm" />
        </template>

      </CardBox>


    </SectionMain>
  </LayoutAuthenticated>
</template>