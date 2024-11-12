<script setup>
import { mdiForwardburger, mdiBackburger, mdiMenu } from '@mdi/js';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signOut } from 'firebase/auth';
import { useFirebaseAuth } from 'vuefire';
import menuAside from '@/menuAside.js';
import menuNavBar from '@/menuNavBar.js';
import { useDarkModeStore } from '@/pinia/darkMode.js';
import BaseIcon from '@/components/BaseIcon.vue';
import NavBar from '@/components/NavBar.vue';
import NavBarItemPlain from '@/components/NavBarItemPlain.vue';
import AsideMenu from '@/components/AsideMenu.vue';
import FooterBar from '@/components/FooterBar.vue';

const layoutAsidePadding = 'xl:pl-60';
const darkModeStore = useDarkModeStore();
const router = useRouter();
const auth = useFirebaseAuth();

const isAsideMobileExpanded = ref(false);
const isAsideLgActive = ref(false);

router.beforeEach(() => {
  isAsideMobileExpanded.value = false;
  isAsideLgActive.value = false;
});

const menuClick = (event, item) => {
  if (item.isToggleLightDark) {
    darkModeStore.set();
  }

  if (item.isLogout) {
    signOut(auth)
      .then(() => {
        router.push('/login');
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
};
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header, Navigation, and Sidebar -->
    <div :class="{'overflow-hidden lg:overflow-visible': isAsideMobileExpanded}">
      <div
        :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
        class="pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100 flex-grow"
      >
        <NavBar
          :menu="menuNavBar"
          :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
          @menu-click="menuClick"
        >
          <NavBarItemPlain
            display="flex lg:hidden"
            @click.prevent="isAsideMobileExpanded = !isAsideMobileExpanded"
          >
            <BaseIcon :path="isAsideMobileExpanded ? mdiBackburger : mdiForwardburger" size="24" />
          </NavBarItemPlain>
          <NavBarItemPlain display="hidden lg:flex xl:hidden" @click.prevent="isAsideLgActive = true">
            <BaseIcon :path="mdiMenu" size="24" />
          </NavBarItemPlain>
        </NavBar>
        <AsideMenu
          :is-aside-mobile-expanded="isAsideMobileExpanded"
          :is-aside-lg-active="isAsideLgActive"
          :menu="menuAside"
          @menu-click="menuClick"
          @aside-lg-close-click="isAsideLgActive = false"
        />
        <slot />
      </div>
    </div>

    <!-- Footer Section -->
    <div class="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-4 text-gray-600 dark:text-gray-400 text-sm">
      <!-- Empty Space on the Left for Justification -->
      <div></div>

      <!-- Footer Content on the Right -->
      <FooterBar />
    </div>
  </div>
</template>

<style scoped>
/* Ensures the footer is aligned at the bottom and spans the full width */
.min-h-screen {
  min-height: 100h;
}
</style>
