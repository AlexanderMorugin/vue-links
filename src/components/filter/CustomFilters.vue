<template>
  <section class="flex gap-5 justify-center mb-3 bg-yellow-600 rounded-md">
    <div class="my-3 flex items-center gap-2">
      <Checkbox
        v-model="linksStore.isPopular"
        inputId="sortByPopular"
        name="sortByPopular"
        binary
        @change="updateFilters"
      />
      <label for="sortByPopular">Сначала популярные</label>
    </div>
    <div class="my-3 flex items-center gap-2">
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
  linksStore.loadLinks(true)
}
</script>
