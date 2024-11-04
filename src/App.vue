<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';
import { store } from './store';

onMounted(() => {
  store.commit("setLocalforageConfig");
});
</script>

<template>
  <RouterView />
</template>
