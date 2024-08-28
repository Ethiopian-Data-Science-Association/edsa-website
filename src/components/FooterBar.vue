<template>
  <footer class="py-2 px-6 text-center">
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
      <div class="mb-2 sm:mb-0">
        <b>&copy;{{ year }} <a href="https://github.com/Ethiopian-Data-Science-Association/edsa-website" target="_blank">All rights reserved Ethiopian Data Science Association</a>.</b>
      </div>
      <div class="flex flex-col sm:flex-row sm:space-x-4">
        <router-link to="/faq" class="text-sm hover:underline">FAQ</router-link>
        <router-link to="/privacy-policy" class="text-sm hover:underline">Privacy Policy</router-link>
        <router-link to="/terms-and-conditions" class="text-sm hover:underline">Terms and Conditions</router-link>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
/* Remove any custom styles; Tailwind will handle responsiveness */
</style>
