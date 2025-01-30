<script setup>
import { reactive } from 'vue'
import { mdiFlag, mdiPhone, mdiFax, mdiAccountCircle, mdiFilePdfBox, mdiEmail, mdiHome } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadioGroup from '@/components/FormCheckRadioGroup.vue'
import FormFilePicker from '@/components/FormFilePicker.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import BaseButton from '@/components/BaseButton.vue'
import SectionTitle from '@/components/SectionTitle.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'

const form = reactive({
  firstName: '',
  middleName: '',
  lastName: '',
  gender: null,
  birthDate: '',
  nationality: '',
  maritalStatus: null,
  educationLevel: null,
  addressRegion: '',
  addressZone: '',
  addressWoreda: '',
  addressKebele: '',
  addressHouseNumber: '',
  addressPhoneNumber: '',
  addressMobileNumber: '',
  addressFaxNumber: '',
  addressPostalCode: '',
  addressEmail: '',
  workPlaceName: '',
  workPlaceRegion: '',
  workPlaceZone: '',
  workPlaceWoreda: '',
  workPlaceKebele: '',
  workPlacePhoneNumber: '',
  passportPhoto: null,
  fullName: '',
  signature: '',
  signDate: ''
});

const genderOptions = {
  female: 'ሴት',
  male: 'ወንድ'
};

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

const resetForm = () => {
  Object.keys(form).forEach(key => {
    if (typeof form[key] === 'string') {
      form[key] = '';
    } else if (typeof form[key] === 'boolean') {
      form[key] = false;
    } else if (Array.isArray(form[key])) {
      form[key] = [];
    } else if (typeof form[key] === 'object' && form[key] !== null) {
      form[key] = null
    }
  });
};

const generatePDF = () => {
  console.log("Generating PDF...");
};

const submit = () => {
  console.log(form);
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitle title="የሲቪል ማኅበረሰብ ድርጅቶች ባለስልጣን ምዝገባ ፎርም" />

      <CardBox is-form @submit.prevent="submit">
        <div class="flex justify-center">
          <div class="text-2xl font-bold">ክፍል ሁለት</div>
        </div>
        <div class="text-center text-lg mb-4">በድርጅቱ መስራቾች እና አመራር አባላት የሚሞላ</div>
        <BaseDivider />
        <FormField label="ፎቶ ግራፍ (የድርጅቱ፣ የፓስፖርት መጠን ያለው)">
          <FormFilePicker v-model="form.passportPhoto" :icon="mdiAccountCircle" :is-round-icon="true" />
        </FormField>

        <FormField label="1. ስም">
          <div class="grid grid-cols-3 gap-4">
            <FormControl v-model="form.firstName" placeholder="የመጀመሪያ ስም" />
            <FormControl v-model="form.middleName" placeholder="የአባት ስም" />
            <FormControl v-model="form.lastName" placeholder="የአያት ስም" />
          </div>
        </FormField>

        <FormField label="2. ጾታ">
          <FormCheckRadioGroup v-model="form.gender" name="gender" type="radio" :options="genderOptions" />
        </FormField>

        <FormField label="3. የትውልድ ጊዜ">
          <FormControl v-model="form.birthDate" type="date" placeholder="ቀን/ወር/ዓ.ም" />
        </FormField>

        <FormField label="4. ዜግነት">
          <FormControl v-model="form.nationality" placeholder="ዜግነት" :icon="mdiFlag" />
        </FormField>

        <FormField label="5. የትዳር ሁኔታ">
          <FormCheckRadioGroup v-model="form.maritalStatus" name="maritalStatus" type="radio"
            :options="maritalStatusOptions" />
        </FormField>

        <FormField label="6. የትምህርት ደረጃ">
          <FormCheckRadioGroup v-model="form.educationLevel" name="educationLevel" type="radio"
            :options="educationLevelOptions" />
        </FormField>

        <FormField label="7. ቋሚ የመኖሪያ አድራሻ">
          <div class="grid grid-cols-4 gap-4">
            <FormControl v-model="form.addressRegion" placeholder="ክልል/ከተማ አስተዳድር" />
            <FormControl v-model="form.addressZone" placeholder="ዞን/ክ/ከተማ" />
            <FormControl v-model="form.addressWoreda" placeholder="ወረዳ" />
            <FormControl v-model="form.addressKebele" placeholder="ቀበሌ" />
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <FormControl v-model="form.addressHouseNumber" placeholder="የቤት ቁጥር" :icon="mdiHome" />
            <FormControl v-model="form.addressPhoneNumber" type="tel" placeholder="ስልክ ቁጥር (ቤት)" :icon="mdiPhone" />
          </div>
          <div class="grid grid-cols-1 gap-4 mt-4">
            <FormControl v-model="form.addressMobileNumber" type="tel" placeholder="ስልክ ቁጥር (ሞባይል)" :icon="mdiPhone" />
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <FormControl v-model="form.addressFaxNumber" placeholder="ፋክስ ቁጥር" :icon="mdiFax" />
            <FormControl v-model="form.addressPostalCode" placeholder="ፖ.ሣ.ቁጥር" />
          </div>
          <div class="grid grid-cols-1 gap-4 mt-4">
            <FormControl v-model="form.addressEmail" type="email" placeholder="ኢ-ሜይል" :icon="mdiEmail" />
          </div>
        </FormField>

        <FormField label="8. የሥራ አድራሻ (ካለ)">
          <FormControl v-model="form.workPlaceName" placeholder="የመስሪያ ቤቱ ስም" />
          <div class="grid grid-cols-4 gap-4 mt-4">
            <FormControl v-model="form.workPlaceRegion" placeholder="ክልል/ከተማ አስተዳድር" />
            <FormControl v-model="form.workPlaceZone" placeholder="ዞን/ክ/ከተማ" />
            <FormControl v-model="form.workPlaceWoreda" placeholder="ወረዳ" />
            <FormControl v-model="form.workPlaceKebele" placeholder="ቀበሌ" />
          </div>
          <div class="grid grid-cols-1 gap-4 mt-4">
            <FormControl v-model="form.workPlacePhoneNumber" type="tel" placeholder="ስልክ ቁጥር" />
          </div>
        </FormField>

        <div class="mt-8">
          <p class="text-sm">እኔ ከዚህ በላይ ስሜ እና አዳራሻዬ የተገለፀው የሰጠሁት መረጃ በሙሉ ትክክለኛና እውነተኛ
            ስለመሆኑ አረጋግጣለሁ፡፡</p>
        </div>

        <FormField label="ስም">
          <FormControl v-model="form.fullName" type="text" placeholder="ስም" />
        </FormField>

        <FormField label="ፊርማ">
          <FormControl v-model="form.signature" type="text" placeholder="እዚህ ላይ ይፈርሙ" />
        </FormField>

        <FormField label="ቀን">
          <FormControl v-model="form.signDate" type="date" hint="ቀን/ወር/ዓ.ም" />
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
          <BaseButton class="mr-6" type="submit" color="info" outline label="Submit" :disabled="isSubmitting || isLoading" />
          <BaseButton class="mr-6" type="reset" color="info" outline label="Reset" @click="resetForm" />
          <BaseButton type="button" color="info" outline label="Generate PDF" :icon="mdiFilePdfBox" @click="generatePDF" />
        </template>

      </CardBox>


    </SectionMain>
  </LayoutAuthenticated>
</template>