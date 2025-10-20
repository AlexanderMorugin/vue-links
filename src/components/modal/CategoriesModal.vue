<template>
  <Toast />
  <Dialog modal header="Категории" v-model:visible="modelValue" :style="{ width: '25rem' }">
    <template v-if="isLoadingModal">
      <div class="grid grid-cols-[1fr_32px] items-center mt-3 mb-1 gap-5">
        <Skeleton width="100%" />
        <Skeleton shape="circle" size="2rem" /></div
    ></template>
    <template v-else>
      <Form @submit="submitCategoryForm">
        <InputText
          placeholder="Создание новой категории"
          v-model="categoryField"
          class="flex-auto w-full"
          autocomplete="off"
        />
        <div class="flex justify-end gap-2 my-4">
          <Button type="button" label="Добавить" :loading="isLoading" @click="submitCategoryForm" />
        </div>
        <div
          v-for="item in categoryList"
          :key="item.id"
          class="grid grid-cols-[1fr_32px] mb-1 gap-5"
        >
          {{ item.name }}
          <Button
            type="button"
            rounded
            size="small"
            variant="text"
            icon="pi pi-times"
            @click="deleteCategory(item.id)"
          />
        </div>
      </Form>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Skeleton from 'primevue/skeleton'
import { Form } from '@primevue/forms'
import Toast from 'primevue/toast'
import { supabase } from '@/supabase'
import { useToastNotify } from '@/composables/use-toast-notify'

const { showToast } = useToastNotify()
const modelValue = defineModel()

const isLoadingModal = ref(true)
const isLoading = ref(false)
const categoryField = ref(null)
const categoryList = ref([])

const deleteCategory = async (id) => {
  try {
    isLoadingModal.value = true

    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) throw error

    categoryList.value = categoryList.value.filter((item) => item.id !== id)
    showToast('success', 'Поздравляем!', 'Категория успешно удалена.')
  } catch (error) {
    console.log(error)
    showToast('error', 'Ошибка', 'Не удалось удалить категорию.')
  } finally {
    isLoadingModal.value = false
  }
}

const getCategories = async () => {
  isLoadingModal.value = true
  try {
    const { data, error } = await supabase.from('categories').select()

    if (error) throw error

    categoryList.value = data
    isLoadingModal.value = false
  } catch (err) {
    console.log(err)
    showToast('error', 'Ошибка', 'Не удалось получить категории.')
  }
}

const submitCategoryForm = async () => {
  isLoading.value = false

  try {
    isLoading.value = true

    const { data, error } = await supabase
      .from('categories')
      .insert({ name: categoryField.value })
      .select()

    if (error) throw error

    showToast('success', 'Поздравляем!', 'Категория успешно добавлена!')
    categoryField.value = null
    categoryList.value.push(data[0])
  } catch (error) {
    console.log(error)
    showToast('error', 'Ошибка', 'Не удалось добавить категорию.')
  } finally {
    isLoading.value = false
  }
}

watch(modelValue, async (newValue) => {
  if (newValue) await getCategories()
})
</script>
