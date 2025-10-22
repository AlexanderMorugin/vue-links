<template>
  <CreateLinkModal v-model="isCreateLinkModalOpen" isEdit :id="link.id" />
  <Card class="relative border-2 border-amber-50" :style="{ backgroundColor: isFavoriteCard }">
    <template #title>
      <div class="flex items-center gap-2 pr-10">
        <img :src="link.preview_image" :alt="link.name" class="w-[52px]" />
        <a :href="link.url" target="_blank" @click="openLink">{{ link.name }}</a>
        <Speeddial
          :model="itemsMenuButton"
          :tooltipOptions="{ position: left }"
          direction="down"
          style="position: absolute; top: 20px; right: 20px"
        />
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-2">
        <div class="font-bold">{{ link.category.name }}</div>
        <div v-if="link.description" class="h-full">{{ link.description }}</div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed, ref } from 'vue'
import Card from 'primevue/card'
import Speeddial from 'primevue/speeddial'
import { useLinkStore } from '@/stores/link-store'
import { useToastNotify } from '@/composables/use-toast-notify'
import CreateLinkModal from '../modal/CreateLinkModal.vue'

const linksStore = useLinkStore()
const { showToast } = useToastNotify()

const { link } = defineProps(['link'])

const isCreateLinkModalOpen = ref(false)
const itemsMenuButton = ref([
  {
    label: 'Избранное',
    icon: 'pi pi-star',
    command: async () => {
      try {
        await linksStore.toggleIsFavorite(link.id)
        showToast('success', 'Поздравляем!', `Изменения успешно сохранены!`)
      } catch (error) {
        console.log(error)
        showToast('error', 'Ошибка', 'Не удалось сохранить изменения.')
      }
    },
  },
  {
    label: 'Копировать',
    icon: 'pi pi-link',
    command: () => copyToClipboard(),
  },
  {
    label: 'Редактировать',
    icon: 'pi pi-pencil',
    command: () => (isCreateLinkModalOpen.value = true),
  },
  {
    label: 'Удалить',
    icon: 'pi pi-trash',
    command: async () => {
      try {
        await linksStore.removeLink(link.id)
        showToast('success', 'Поздравляем!', `Ссылка успешно удалена!`)
      } catch (error) {
        console.log(error)
        showToast('error', 'Ошибка', 'Не удалось удалить ссылку.')
      }
    },
  },
])

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(link.url)
    showToast('success', 'Поздравляем!', `Скопирована ссылка ${link.name}`)
  } catch (error) {
    console.log(error)
    showToast('error', 'Ошибка', 'Не удалось скопировать ссылку.')
  }
}

const isFavoriteCard = computed(() => {
  return link.is_favorite ? 'var(--p-avatar-background' : ''
})

const openLink = () => linksStore.addClickCount(link.id)
</script>
