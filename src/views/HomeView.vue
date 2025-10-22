<template>
  <CustomLoader v-if="linksStore.isLoading && linksStore.offset === 0" />
  <main v-else>
    <h1 v-if="!linksStore.links?.length" class="font-bold text-center">Пока ссылок нет.</h1>
    <template v-else>
      <CustomFilters />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <LinkCard v-for="link in linksStore.links" :key="link.id" :link="link" />
      </div>
      <div class="flex justify-center mt-5">
        <Button
          v-if="linksStore.hasMore"
          :loading="linksStore.isLoading"
          label="Показать еще"
          @click="linksStore.loadLinks()"
        />
      </div>
    </template>
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import Button from 'primevue/button'
import { useLinkStore } from '@/stores/link-store'
import CustomLoader from '@/components/loader/CustomLoader.vue'
import LinkCard from '@/components/link/LinkCard.vue'
import CustomFilters from '@/components/filter/CustomFilters.vue'

const linksStore = useLinkStore()

onMounted(async () => {
  if (window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')

    if (accessToken) {
      window.history.replaceState(null, null, window.location.pathname)
    }
  }
  await linksStore.loadLinks()
})
</script>
