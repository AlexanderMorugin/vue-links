<template>
  <Toast />
  <TheHeader v-if="userStore.user" />
  <RouterView />
</template>

<script setup>
import { onMounted } from 'vue'
import Toast from 'primevue/toast'
import TheHeader from './components/TheHeader.vue'
import { useUserStore } from './stores/user-store'

const userStore = useUserStore()

onMounted(async () => {
  await userStore.getUser()
})
</script>
