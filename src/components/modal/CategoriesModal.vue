<template>
  <Toast />
  <Dialog header="Категории" v-model:visible="modelValue" :style="{ width: '25rem' }">
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

      <div v-for="item in categoryList" :key="item.id" class="grid grid-cols-[1fr_32px] mb-1 gap-5">
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
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { Form } from '@primevue/forms'
import Toast from 'primevue/toast'
import { supabase } from '@/supabase'
import { useToastNotify } from '@/composables/use-toast-notify'

const { showToast } = useToastNotify()
const modelValue = defineModel()

const isLoading = ref(false)
const categoryField = ref(null)
const categoryList = ref([
  {
    id: 1,
    name: 'Category One',
  },
  {
    id: 2,
    name: 'Category Two',
  },
])

const deleteCategory = (id) => {
  console.log(id)
}
const submitCategoryForm = async () => {
  isLoading.value = false

  try {
    isLoading.value = true

    const { data, error } = await supabase.from('categories').insert({ name: categoryField.value })

    if (error) throw error

    showToast('success', 'Поздравляем!', 'Категория успешно добавлена!')
    categoryField.value = null
  } catch (error) {
    console.log(error)
    showToast('error', 'Ошибка', 'Не удалось добавить категорию.')
  } finally {
    isLoading.value = false
  }
}
</script>
