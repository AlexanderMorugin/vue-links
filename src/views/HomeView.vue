<template>
  <main>
    <h1>HomeView</h1>
    <Button label="Submit" severity="warn" />
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import Button from 'primevue/button'

onMounted(() => {
  if (window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')

    if (accessToken) {
      window.history.replaceState(null, null, window.location.pathname)
    }
  }
})
</script>
