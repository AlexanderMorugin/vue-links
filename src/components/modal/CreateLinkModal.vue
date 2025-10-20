<template>
  <Toast />
  <Dialog modal header="Создание ссылки" v-model:visible="modelValue" :style="{ width: '25rem' }">
    <Form
      v-slot="$form"
      initial-values="formData"
      :resolver="resolver"
      :validate-on-blur="true"
      :validate-on-value-update="false"
      @submit="submitLinkForm"
    >
      <CustomLoader v-if="isLoading" />
      <template v-else>
        <div class="mb-3">
          <InputText
            name="name"
            type="text"
            v-model="formData.name"
            class="w-full"
            autocomplete="off"
            placeholder="Название ссылки"
          />
          <Message v-if="$form.name?.invalid" severity="error" variant="simple" size="small">{{
            $form.name.error.message
          }}</Message>
        </div>
        <div class="mb-3">
          <InputText
            name="url"
            type="text"
            v-model="formData.url"
            class="w-full"
            autocomplete="off"
            placeholder="Ссылка"
          />
          <Message v-if="$form.url?.invalid" severity="error" variant="simple" size="small">{{
            $form.url.error.message
          }}</Message>
        </div>
        <div class="mb-3">
          <Select
            v-model="formData.category"
            :options="categoryList"
            optionLabel="name"
            placeholder="Выбурите категорию"
            class="w-full"
          />
        </div>
        <div class="mb-3">
          <Textarea
            v-model="formData.description"
            class="w-full"
            style="resize: none"
            placeholder="Описание"
          />
        </div>
        <div class="mb-3 flex items-center gap-2">
          <Checkbox v-model="formData.isFavorite" inputId="isFavorite" binary />
          <label for="isFavorite">Добавить в избранное</label>
        </div>
        <div class="flex justify-end gap-2 my-4">
          <Button type="submit" label="Добавить" :loading="isLoading" />
        </div>
      </template>
    </Form>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import { Form } from '@primevue/forms'
import * as z from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import Message from 'primevue/message'
import Toast from 'primevue/toast'
import { supabase } from '@/supabase'
import { useToastNotify } from '@/composables/use-toast-notify'
import CustomLoader from '../loader/CustomLoader.vue'

const { showToast } = useToastNotify()
const modelValue = defineModel()

const formData = ref({
  name: '',
  url: '',
  description: '',
  category: null,
  isFavorite: false,
})

const isLoading = ref(false)
const categoryList = ref(null)

const rules = z.object({
  name: z.string('Заполните поле').min(1, { message: 'Введите название ссылки' }),
  url: z.string('Заполните поле').url(6, { message: 'Некорректная ссылка' }),
})

const resolver = ref(zodResolver(rules))

const getCategories = async () => {
  isLoading.value = false
  try {
    isLoading.value = true

    const { data, error } = await supabase.from('categories').select()
    if (error) throw error
    categoryList.value = data
    formData.value.category = categoryList.value[0]
  } catch (error) {
    console.log(error)
    showToast('error', 'Ошибка', 'Не удалось загрузить категории.')
  } finally {
    isLoading.value = false
  }
}

const submitLinkForm = async () => {
  console.log('saveLink')
}

watch(modelValue, async (newValue) => {
  if (newValue) await getCategories()
})
</script>
