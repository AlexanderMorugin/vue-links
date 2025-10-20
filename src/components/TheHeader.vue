<template>
  <CategoriesModal v-model="isCategoriesModalOpen" />
  <CreateLinkModal v-model="isCreateLinkModalOpen" />
  <Toast />
  <header class="mb-5">
    <Menubar>
      <template #start>
        <div class="flex items-center gap-2">
          <span class="font-bold">Vue Links</span>
          <div class="flex items-center gap-2">
            <Button icon="pi pi-link" rounded="true" @click="isCreateLinkModalOpen = true" />
            <Button icon="pi pi-folder" rounded="true" @click="isCategoriesModalOpen = true" />
          </div>
        </div>
      </template>

      <template #end>
        <div class="flex items-center gap-2">
          <Avatar :label="emailFirstLetter" size="large" shape="circle" />
          <Button
            icon="pi pi-sign-out"
            rounded="true"
            severity="secondary"
            @click="handleSignOut"
          />
        </div>
      </template>
    </Menubar>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Menubar from 'primevue/menubar'
import Toast from 'primevue/toast'
import { useUserStore } from '@/stores/user-store'
import { useAuth } from '@/composables/use-auth'
import { useToastNotify } from '@/composables/use-toast-notify'
import CategoriesModal from './modal/CategoriesModal.vue'
import CreateLinkModal from './modal/CreateLinkModal.vue'

const router = useRouter()
const userStore = useUserStore()
const { showToast } = useToastNotify()
const { errorMessage, signout } = useAuth()

const isCategoriesModalOpen = ref(false)
const isCreateLinkModalOpen = ref(false)

const emailFirstLetter = computed(() => {
  return userStore.user?.email ? userStore.user.email[0].toUpperCase() : ''
})

const handleSignOut = async () => {
  try {
    await signout()
    userStore.resetUser()
    await router.replace({ name: 'AuthView' })
  } catch (error) {
    showToast('error', 'Ошибка разлогирования', errorMessage.value)
    console.log(error)
  }
}
</script>
