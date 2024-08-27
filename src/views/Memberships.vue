<script setup>
import { useRouter } from 'vue-router'
import { useDarkModeStore } from '@/stores/darkMode.js'
import { gradientBgPurplePink } from '@/colors.js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'

const memberships = ['Regular', 'Institutional']

const darkModeStore = useDarkModeStore()

darkModeStore.set(false)

const router = useRouter()

const handleSelectedMembership = (selection) => {
  // Regular member
  if(selection === memberships[0]){
    router.push('/regular-membership-form')
  }else{
    router.push('/institution-membership-form')
  } 
}
</script>

<template>
  <LayoutGuest>
    <div :class="gradientBgPurplePink" class="flex min-h-screen items-center justify-center">
      <SectionMain>
        <h1 class="text-4xl md:text-5xl text-center text-white font-bold mt-12 mb-3 lg:mt-0">
          Pick a Membership Type
        </h1>
        <h2 class="text-xl md:text-xl text-center text-white mb-12">
          Membership approval is subject to EDSA.
        </h2>
        <div class="grid gap-6 grid-cols-1 lg:grid-cols-2 px-6 max-w-6xl mx-auto">
          <CardBox
            v-for="membership in memberships"
            :key="membership"
            class="cursor-pointer bg-gray-50"
            is-hoverable
            @click="handleSelectedMembership(membership)"
          >
            <div class="mb-3 md:mb-6">
              <img
                :src="`https://static.justboil.me/templates/one/small/white-v3.png`"
                width="1280"
                height="720"
              />
            </div>

            <h1 class="text-xl md:text-2xl font-black capitalize">
              {{ membership }}
            </h1>
            <h2 class="text-lg md:text-xl">Membership</h2>
          </CardBox>
        </div>
      </SectionMain>
    </div>
  </LayoutGuest>
</template>
