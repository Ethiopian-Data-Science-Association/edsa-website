<template>
  <footer class="py-2 px-6 text-center justify-center">
    <div class="flex justify-between items-center">
      <div>
        <b>&copy;{{ year }} <a href="https://github.com/Ethiopian-Data-Science-Association/edsa-website" target="_blank">All rights reserved Ethiopian Data Science Association</a>.</b>
      </div>
      <div class="flex space-x-4">
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
footer {
  max-width: 800px;
  margin: 0 auto;
}
</style>
