<script setup>
import { useRouter } from "vue-router";
import { mdiLogout, mdiClose } from '@mdi/js'
import { computed } from 'vue'
import AsideMenuList from '@/components/AsideMenuList.vue'
import AsideMenuItem from '@/components/AsideMenuItem.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import logo from '@/assets/favicon.png';

const router = useRouter();

defineProps({
  menu: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['menu-click', 'aside-lg-close-click'])

const logoutItem = computed(() => ({
  label: 'Logout',
  icon: mdiLogout,
  color: 'info',
  isLogout: true
}))

const menuClick = (event, item) => {
  emit('menu-click', event, item)
}

const asideLgCloseClick = (event) => {
  emit('aside-lg-close-click', event)
}

// Navigate to create page
const navigateToHomePage = () => {
  router.push("/");
};
</script>

<template>
  <aside id="aside" class="lg:py-2 lg:pl-2 w-60 fixed flex z-40 top-0 h-screen transition-position overflow-hidden">
    <div class="aside lg:rounded-2xl flex-1 flex flex-col overflow-hidden dark:bg-slate-800">
      <div
        class="aside-brand flex flex-col h-14 logo-align my-24 items-center justify-center dark:bg-slate-800 cursor-pointer"
        @click="navigateToHomePage">
        <div class="text-center flex-1 lg:text-left lg:pl-6 xl:text-center xl:pl-0">
          <b class="font-black text-xl">EDSA</b>
        </div>
        <img :src="logo" alt="EDSA Logo" class="rounded-full h-16 w-16 mt-6 bg-gray-100 dark:bg-slate-800" />
        <button class="hidden lg:inline-block xl:hidden p-3" @click.prevent="asideLgCloseClick">
          <BaseIcon :path="mdiClose" />
        </button>
      </div>
      <div class="flex-1 overflow-y-auto overflow-x-hidden aside-scrollbars dark:aside-scrollbars-[slate]">
        <AsideMenuList :menu="menu" @menu-click="menuClick" />
      </div>

      <ul>
        <AsideMenuItem :item="logoutItem" @menu-click="menuClick" />
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.logo-align {
  margin-left: -30px !important;
}
</style>
