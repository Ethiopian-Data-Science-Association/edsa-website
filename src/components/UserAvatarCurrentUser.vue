<script setup>
import UserAvatar from '@/components/UserAvatar.vue'
import { useMainStore } from '@/pinia/main';

const mainStore = useMainStore()
const props = defineProps({
  avatarUrl: {
    type: String,
    default: '' 
  },
  username: {
    type: String,
    required: true
  },
})
</script>

<template>
  <UserAvatar :username="props.userName" :avatar="props.avatarUrl">
    <slot />
  </UserAvatar>
</template>
