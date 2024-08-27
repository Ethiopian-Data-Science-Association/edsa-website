<script setup>
import { containerMaxW } from '@/config.js'
import BaseLevel from '@/components/BaseLevel.vue'
import JustboilLogo from '@/components/JustboilLogo.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="py-2 px-6 text-center justify-center" :class="containerMaxW">
    <BaseLevel>
      <div class="text-center md:text-center">
        <b>&copy;{{ year }} <a href="https://github.com/Ethiopian-Data-Science-Association/edsa-website" target="_blank">All rights reserved Ethiopian Data Science Association</a>.</b>
        <slot />
      </div>
      <!-- <div class="md:py-2">
        <a href="https://github.com/Ethiopian-Data-Science-Association/edsa-website">
          <JustboilLogo class="w-auto h-8 md:h-6" />
        </a>
      </div> -->
    </BaseLevel>
  </footer>
</template>
