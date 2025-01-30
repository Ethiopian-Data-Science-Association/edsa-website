<script setup>
import { ref, onMounted } from 'vue'
import { paths } from '@/shared/constants/paths';
import { useStore } from 'vuex'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { toTypedSchema } from '@vee-validate/yup'
import localforage from 'localforage'
import {
  mdiFlag, mdiPhone, mdiFax, mdiAccountCircle, mdiFilePdfBox, mdiEmail, mdiHome,
  mdiCheckCircle, mdiAlertCircle
} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadioGroup from '@/components/FormCheckRadioGroup.vue'
import FormFilePicker from '@/components/FormFilePicker.vue'
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
  firstName: yup.string().required('First name is required'),
  middleName: yup.string().required('Middle name is required'),
  lastName: yup.string().required('Last name is required'),
  gender: yup.string().required('Gender is required'),
  membershipType: yup.string().required('Membership Type is required. The default one is Regular Membership.'),
  birthDate: yup.date().required('Birth date is required').max(new Date(), 'Birth date cannot be in the future'),
  nationality: yup.string().required('Nationality is required'),
  maritalStatus: yup.string().required('Marital status is required'),
  educationLevel: yup.string().required('Education level is required'),
  addressRegion: yup.string().required('Region is required'),
  addressZone: yup.string().required('Zone is required'),
  addressWoreda: yup.string().required('Woreda is required'),
  addressKebele: yup.string(),
  addressHouseNumber: yup.string(),
  addressPhoneNumber: yup.string(),
  addressMobileNumber: yup.string().matches(/^\d{9,15}$/, 'Enter a valid mobile number').required('Mobile number is required. Example: 0927716801'),
  addressFaxNumber: yup.string(),
  addressPostalCode: yup.string(),
  addressEmail: yup.string().email('Enter a valid email address').required('Email is required'),
  workPlaceName: yup.string(),
  workPlaceRegion: yup.string(),
  workPlaceZone: yup.string(),
  workPlaceWoreda: yup.string(),
  workPlaceKebele: yup.string(),
  workPlacePhoneNumber: yup.string(),
  passportPhoto: yup.mixed().nullable(), //.required('Passport photo is required'),
  fullName: yup.string().required('Full name is required'),
  signDate: yup.date().required('Signature date is required').max(new Date(), 'Date cannot be in the future'),
})

//   **Initialize Form Validation**
const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: toTypedSchema(formSchema),
})

// ✅ **Fields with Validation**
const { value: firstName, errorMessage: firstNameError } = useField('firstName')
const { value: middleName, errorMessage: middleNameError } = useField('middleName')
const { value: lastName, errorMessage: lastNameError } = useField('lastName')
const { value: gender, errorMessage: genderError } = useField('gender')
const { value: membershipType, errorMessage: membershipTypeError } = useField('membershipType')
const { value: birthDate, errorMessage: birthDateError } = useField('birthDate')
const { value: nationality, errorMessage: nationalityError } = useField('nationality')
const { value: maritalStatus, errorMessage: maritalStatusError } = useField('maritalStatus')
const { value: educationLevel, errorMessage: educationLevelError } = useField('educationLevel')
const { value: addressRegion, errorMessage: addressRegionError } = useField('addressRegion')
const { value: addressZone, errorMessage: addressZoneError } = useField('addressZone')
const { value: addressWoreda, errorMessage: addressWoredaError } = useField('addressWoreda')
const { value: addressKebele } = useField('addressKebele')
const { value: addressHouseNumber } = useField('addressHouseNumber')
const { value: addressPhoneNumber } = useField('addressPhoneNumber')
const { value: addressMobileNumber, errorMessage: addressMobileNumberError } = useField('addressMobileNumber')
const { value: addressFaxNumber } = useField('addressFaxNumber')
const { value: addressPostalCode } = useField('addressPostalCode')
const { value: addressEmail, errorMessage: addressEmailError } = useField('addressEmail')
const { value: workPlaceName } = useField('workPlaceName')
const { value: workPlaceRegion } = useField('workPlaceRegion')
const { value: workPlaceZone } = useField('workPlaceZone')
const { value: workPlaceWoreda } = useField('workPlaceWoreda')
const { value: workPlaceKebele } = useField('workPlaceKebele')
const { value: workPlacePhoneNumber } = useField('workPlacePhoneNumber')
const { value: passportPhoto } = useField('passportPhoto')
//TODO:: const { value: passportPhoto, errorMessage: passportPhotoError } = useField('passportPhoto')
const { value: fullName, errorMessage: fullNameError } = useField('fullName')
const { value: signDate, errorMessage: signDateError } = useField('signDate')

const genderOptions = {
  female: 'ሴት',
  male: 'ወንድ'
};

const membershipOptions = {
  regular: roles.REGULAR + ' (መደበኛ)',
  honorary: roles.HONORARY + ' (ክብር)',
  student: roles.STUDENT + ' (ተማሪ)'
}

const maritalStatusOptions = {
  married: 'ያገባ/ች',
  single: 'ያላገባ/ች'
};

const educationLevelOptions = {
  "below-degree": 'ከመጀመሪያ ዲግሪ በታች',
  "bachelor": 'መጀመሪያ ዲግሪ',
  "master": 'ማስተርስ ዲግሪ',
  "doctorate": 'ከማስተርስ ዲግሪ በላይ',
};

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

// **Photo Upload Handling**
const onPhotoUploadCompleted = async () => {
  passportPhoto.value = store.getters['shared/documentPath']
  showNotification('Success', 'Photo uploaded successfully.', 'success', mdiCheckCircle)
}

const onPhotoUploadFailed = async () => {
  showNotification('Error', 'Failed to upload photo. Please try again.', 'danger', mdiAlertCircle)
}

const generatePDF = () => {
  console.log("Generating PDF...");
};

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
      membershipType: values.membershipType?.split(' ')[0].toUpperCase(), // split only the necessary role type like REGULAR
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
        <div class="text-center text-lg mb-4">የኢትዮጵያ ዳታ ሳይንስ ማህበር የመደበኛ አባልነት ቅጽ</div>
        <BaseDivider />
        <FormField label="ፎቶ ግራፍ (የፓስፖርት መጠን ያለው)">
          <FormFilePicker v-model="passportPhoto" :icon="mdiAccountCircle" :is-round-icon="true"
            :disabled="isSubmitting || isLoading" :documentStoragePath="paths.REGULAR_MEMBER_UPLOAD_PATH"
            @file-upload-success="onPhotoUploadCompleted" @file-upload-error="onPhotoUploadFailed" />
          <!-- <p v-if="passportPhotoError" class="text-red-500">{{ passportPhotoError }}</p> -->
        </FormField>

        <!-- Name -->
        <FormField label="1. ስም">
          <FormControl v-model="firstName" placeholder="የመጀመሪያ ስም" />
          <p v-if="firstNameError" class="text-red-500">{{ firstNameError }}</p>

          <FormControl v-model="middleName" placeholder="የአባት ስም" />
          <p v-if="middleNameError" class="text-red-500">{{ middleNameError }}</p>

          <FormControl v-model="lastName" placeholder="የአያት ስም" />
          <p v-if="lastNameError" class="text-red-500">{{ lastNameError }}</p>
        </FormField>

        <!-- membershipType -->
        <FormField label="2. የአባልነት አይነት">
          <FormCheckRadioGroup v-model="membershipType" name="membershipType" type="radio"
            :options="membershipOptions" />
          <p v-if="membershipTypeError" class="text-red-500">{{ membershipTypeError }}</p>
        </FormField>

        <!-- Gender -->
        <FormField label="3. ጾታ">
          <FormCheckRadioGroup v-model="gender" name="gender" type="radio" :options="genderOptions" />
          <p v-if="genderError" class="text-red-500">{{ genderError }}</p>
        </FormField>

        <!-- Birth Date -->
        <FormField label="4. የትውልድ ጊዜ">
          <FormControl v-model="birthDate" type="date" />
          <p v-if="birthDateError" class="text-red-500">{{ birthDateError }}</p>
        </FormField>

        <!-- Nationality -->
        <FormField label="5. ዜግነት">
          <FormControl v-model="nationality" placeholder="ዜግነት" :icon="mdiFlag" />
          <p v-if="nationalityError" class="text-red-500">{{ nationalityError }}</p>
        </FormField>

        <FormField label="6. የትዳር ሁኔታ">
          <FormCheckRadioGroup v-model="maritalStatus" name="maritalStatus" type="radio"
            :options="maritalStatusOptions" />
          <p v-if="maritalStatusError" class="text-red-500">{{ maritalStatusError }}</p>
        </FormField>

        <FormField label="7. የትምህርት ደረጃ">
          <FormCheckRadioGroup v-model="educationLevel" name="educationLevel" type="radio"
            :options="educationLevelOptions" />
          <p v-if="educationLevelError" class="text-red-500">{{ educationLevelError }}</p>
        </FormField>

        <FormField label="8. ቋሚ የመኖሪያ አድራሻ">
          <div class="grid grid-cols-4 gap-4">
            <FormControl v-model="addressRegion" placeholder="ክልል/ከተማ አስተዳድር" />
            <p v-if="addressRegionError" class="text-red-500">{{ addressRegionError }}</p>

            <FormControl v-model="addressZone" placeholder="ዞን/ክ/ከተማ" />
            <p v-if="addressZoneError" class="text-red-500">{{ addressZoneError }}</p>

            <FormControl v-model="addressWoreda" placeholder="ወረዳ" />
            <p v-if="addressWoredaError" class="text-red-500">{{ addressWoredaError }}</p>

            <FormControl v-model="addressKebele" placeholder="ቀበሌ" />
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <FormControl v-model="addressHouseNumber" placeholder="የቤት ቁጥር" :icon="mdiHome" />
            <FormControl v-model="addressPhoneNumber" type="tel" placeholder="ስልክ ቁጥር (ቤት)" :icon="mdiPhone" />
          </div>
          <div class="grid grid-cols-1 gap-4 mt-4">
            <FormControl v-model="addressMobileNumber" type="tel" placeholder="ስልክ ቁጥር (ሞባይል)" :icon="mdiPhone" />
            <p v-if="addressMobileNumberError" class="text-red-500">{{ addressMobileNumberError }}</p>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <FormControl v-model="addressFaxNumber" placeholder="ፋክስ ቁጥር" :icon="mdiFax" />
            <FormControl v-model="addressPostalCode" placeholder="ፖ.ሣ.ቁጥር" />
          </div>
          <div class="grid grid-cols-1 gap-4 mt-4">
            <FormControl v-model="addressEmail" type="email" placeholder="ኢ-ሜይል" :icon="mdiEmail" />
            <p v-if="addressEmailError" class="text-red-500">{{ addressEmailError }}</p>
          </div>
        </FormField>

        <FormField label="9. የሥራ አድራሻ (ካለ)">
          <FormControl v-model="workPlaceName" placeholder="የመስሪያ ቤቱ ስም" />
          <div class="grid grid-cols-4 gap-4 mt-4">
            <FormControl v-model="workPlaceRegion" placeholder="ክልል/ከተማ አስተዳድር" />
            <FormControl v-model="workPlaceZone" placeholder="ዞን/ክ/ከተማ" />
            <FormControl v-model="workPlaceWoreda" placeholder="ወረዳ" />
            <FormControl v-model="workPlaceKebele" placeholder="ቀበሌ" />
          </div>
          <div class="grid grid-cols-1 gap-4 mt-4">
            <FormControl v-model="workPlacePhoneNumber" type="tel" placeholder="ስልክ ቁጥር" />
          </div>
        </FormField>

        <div class="mt-8 mb-4">
          <p class="text-sm">እኔ ከዚህ በላይ ስሜ እና አዳራሻዬ የተገለፀው የሰጠሁት መረጃ በሙሉ ትክክለኛና እውነተኛ
            ስለመሆኑ አረጋግጣለሁ፡፡ ይህ ክፍል እንደ ፊርማ ያገለግላል።</p>
        </div>

        <FormField label="ሙሉ ስም">
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
          <BaseButton type="button" color="info" outline label="Generate PDF" :icon="mdiFilePdfBox"
            @click="generatePDF" />
        </template>

      </CardBox>


    </SectionMain>
  </LayoutAuthenticated>
</template>