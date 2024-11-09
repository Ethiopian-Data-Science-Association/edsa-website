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
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-800">
    <!-- Sidebar and Main Content Area -->
    <div class="flex flex-grow">
      <!-- Aside Menu with Full Height and Scrollable Content -->
      <AsideMenu
        :is-aside-mobile-expanded="isAsideMobileExpanded"
        :is-aside-lg-active="isAsideLgActive"
        :menu="menuAside"
        class="h-full overflow-y-auto bg-gray-50 dark:bg-slate-800 fixed xl:static w-60"
        @menu-click="menuClick"
        @aside-lg-close-click="isAsideLgActive = false"
      />

      <!-- Main Content and Navbar -->
      <div
        :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
        class="flex flex-col w-full transition-position lg:w-auto"
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
        <main class="flex-grow p-6">
          <slot />
        </main>
      </div>
    </div>

    <!-- Footer Section -->
    <div class="flex justify-end bg-gray-50 dark:bg-slate-800 p-4 text-gray-600 dark:text-gray-400 text-sm">
      <FooterBar />
    </div>
  </div>
</template>

<style scoped>
/* Ensures that the layout spans the full height without causing scrolling */
.min-h-screen {
  min-height: 100vh;
}

/* Sidebar styling for a consistent full-height look */
.h-full {
  height: 100vh;
}
</style>
