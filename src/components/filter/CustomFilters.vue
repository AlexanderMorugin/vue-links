<template>
  <section class="md:flex gap-5 justify-center block mb-3">
    <div class="mb-3 flex items-center gap-2">
      <Checkbox
        v-model="linksStore.isPopular"
        inputId="sortByPopular"
        name="sortByPopular"
        binary
        @change="updateFilters"
      />
      <label for="sortByPopular">Сначала популярные</label>
    </div>
    <div class="mb-3 flex items-center gap-2">
      <Checkbox
        v-model="linksStore.isOnlyFavorite"
        inputId="onlyFavorite"
        name="onlyFavorite"
        binary
        @change="updateFilters"
      />
      <label for="onlyFavorite">Только избранные</label>
    </div>
  </section>
</template>

<script setup>
import { useLinkStore } from '@/stores/link-store'
import Checkbox from 'primevue/checkbox'

const linksStore = useLinkStore()

const updateFilters = () => {
  linksStore.loadLinks()
}
</script>
