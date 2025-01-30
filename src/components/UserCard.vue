<script setup>
import { computed, ref, onMounted } from 'vue'
import { mdiCheckDecagram, mdiCardAccountDetails } from '@mdi/js'
import BaseLevel from '@/components/BaseLevel.vue'
import UserAvatarCurrentUser from '@/components/UserAvatarCurrentUser.vue'
import CardBox from '@/components/CardBox.vue'
import PillTag from '@/components/PillTag.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import { store } from '@/store'
import localforage from 'localforage'
import { roles } from '@/shared/constants/roles'

const user = computed(() => store.state.user.userData)
const userId = ref('')
const modalActive = ref(false)
const membershipData = ref(null)
const membershipType = ref('')

/** Fetch user details */
const fetchUser = async () => {
  try {
    const userData = await localforage.getItem('user')
    if (userData && userData.uid) {
      await store.dispatch('user/getUser', userData.uid)
      userId.value = userData.uid
    } else {
      console.error('User data not found in local storage.')
    }
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}

/** Fetch Membership Details */
const fetchMembership = async () => {
  try {
    if (!userId.value) return
    const membership = await store.dispatch('member/getUserMembership', userId.value)

    if (!membership) {
      console.error('No membership found for user')
      return
    }
    membershipType.value = membership.membershipType?.toUpperCase() || 'UNKNOWN'
    membershipData.value = membership
    modalActive.value = true
  } catch (error) {
    console.error('Error fetching membership details:', error)
  }
}

onMounted(fetchUser)
</script>

<template>
  <CardBox :rounded="''">
    <BaseLevel type="justify-around lg:justify-center">
      <UserAvatarCurrentUser class="lg:mx-12" :username="user?.fullName" :avatarUrl="user?.profilePicture" />
      <div class="space-y-3 text-center md:text-left lg:mx-12">
        <h1 class="text-2xl">
          Hello, <b>{{ user?.fullName }}</b>!
        </h1>
        <div class="flex justify-center md:block space-x-2">
          <PillTag label="Verified" color="info" :icon="mdiCheckDecagram" />
          <PillTag label="Membership" color="success" :icon="mdiCardAccountDetails" @click="fetchMembership"
            class="cursor-pointer" />
        </div>
      </div>
    </BaseLevel>
  </CardBox>

  <!-- Membership Details Modal -->
  <CardBoxModal v-model="modalActive" title="Membership Details"  :footerDisplayed="false">
    <div v-if="membershipData" class="space-y-4">
      <p><b>Membership Type:</b> {{ membershipType }}</p>

      <template v-if="membershipType === roles.REGULAR || membershipType === roles.HONORARY || membershipType === roles.STUDENT">
        <p><b>Full Name:</b> {{ membershipData.fullName }}</p>
        <p><b>Gender:</b> {{ membershipData.gender }}</p>
        <p><b>Date of Birth:</b> {{ new Date(membershipData.birthDate.seconds * 1000).toLocaleDateString() }}</p>
        <p><b>Nationality:</b> {{ membershipData.nationality }}</p>
        <p><b>Marital Status:</b> {{ membershipData.maritalStatus }}</p>
        <p><b>Education Level:</b> {{ membershipData.educationLevel }}</p>
        <p><b>Email:</b> {{ membershipData.addressEmail }}</p>
        <p><b>Mobile Number:</b> {{ membershipData.addressMobileNumber }}</p>
        <p><b>Region:</b> {{ membershipData.addressRegion }}</p>
        <p><b>Zone:</b> {{ membershipData.addressZone }}</p>
        <p><b>Woreda:</b> {{ membershipData.addressWoreda }}</p>
        <p><b>Workplace:</b> {{ membershipData.workPlaceName }}</p>
        <p><b>Workplace Phone:</b> {{ membershipData.workPlacePhoneNumber }}</p>
        <p><b>Signature:</b> {{ membershipData.signature }}</p>
        <p><b>Sign Date:</b> {{ new Date(membershipData.signDate.seconds * 1000).toLocaleDateString() }}</p>
      </template>

      <template v-else-if="membershipType === roles.INSTITUTION">
        <p><b>Institution Name:</b> {{ membershipData.institutionName }}</p>
        <p><b>Headquarters:</b> {{ membershipData.headquarter }}</p>
        <p><b>Email:</b> {{ membershipData.workPlaceEmail }}</p>
        <p><b>Phone Number:</b> {{ membershipData.workPlacePhoneNumber }}</p>
        <p><b>Region:</b> {{ membershipData.workPlaceRegion }}</p>
        <p><b>Zone:</b> {{ membershipData.workPlaceZone }}</p>
        <p><b>Woreda:</b> {{ membershipData.workPlaceWoreda }}</p>
        <p><b>Signature:</b> {{ membershipData.signature }}</p>
        <p><b>Sign Date:</b> {{ new Date(membershipData.signDate.seconds * 1000).toLocaleDateString() }}</p>
      </template>

      <template v-else>
        <p class="text-red-500">Unknown Membership Type</p>
      </template>
    </div>
    <div v-else class="text-center text-gray-500">Loading membership details...</div>
  </CardBoxModal>
</template>
