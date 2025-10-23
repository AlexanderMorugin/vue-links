<template>
  <Dialog modal :header="textHeader" v-model:visible="modelValue" :style="{ width: '25rem' }">
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
        <div v-if="!categoryList.length" class="font-bold text-center">
          Сначала добавьте категории.
        </div>
        <div v-else>
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
            <Button type="submit" :label="textButton" :loading="isLoadingButton" />
          </div>
        </div>
      </template>
    </Form>
  </Dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
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
import { supabase } from '@/supabase'
import { useToastNotify } from '@/composables/use-toast-notify'
import CustomLoader from '../loader/CustomLoader.vue'
import { useUserStore } from '@/stores/user-store'
import { useLinkStore } from '@/stores/link-store'

const { showToast } = useToastNotify()
const modelValue = defineModel()
const userStore = useUserStore()
const linksStore = useLinkStore()

const { isEdit, id } = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  id: {
    type: Number,
    required: false,
  },
})

const formData = ref({
  name: '',
  url: '',
  description: '',
  category: null,
  isFavorite: false,
})

const isLoading = ref(false)
const isLoadingButton = ref(false)
const categoryList = ref([])

const rules = z.object({
  name: z.string('Заполните поле').min(1, { message: 'Введите название ссылки' }),
  url: z.string('Заполните поле').url(6, { message: 'Некорректная ссылка' }),
})

const resolver = ref(zodResolver(rules))

const cleanFormInputs = () => {
  formData.value = {
    name: '',
    url: '',
    description: '',
    category: null,
    isFavorite: false,
  }
}

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

const getDomaine = (url) => {
  const { hostname } = new URL(url)
  const parts = hostname.split('.')
  if (parts.length > 2) {
    return parts.slice(-2).join('.')
  }

  return hostname
}

const textHeader = computed(() => {
  return isEdit ? 'Редактирование ссылки' : 'Создание ссылки'
})

const textButton = computed(() => {
  return isEdit ? 'Сохранить' : 'Добавить'
})

const getLink = async () => {
  try {
    const { data, error } = await supabase.from('links').select().eq('id', id)
    if (error) throw error
    formData.value.name = data[0].name
    formData.value.url = data[0].url
    formData.value.description = data[0].description
    formData.value.category = categoryList.value.find((item) => item.id === data[0].category)
    formData.value.isFavorite = data[0].is_favorite
  } catch (error) {
    console.log(error)
    showToast('error', 'Ошибка', 'Не удалось получить данные.')
  }
}

const loadModal = async () => {
  isLoading.value = true
  await getCategories()
  if (isEdit) await getLink()
  isLoading.value = false
}

const addNewLink = async () => {
  isLoadingButton.value = false
  const staticName = getDomaine(formData.value.url)

  const payload = {
    name: formData.value.name,
    url: formData.value.url,
    description: formData.value.description,
    category: formData.value.category.id,
    click_count: 0,
    is_favorite: formData.value.isFavorite,
    preview_image: `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${staticName}&size=128`,
    user_id: userStore.user.id,
  }

  try {
    const { error } = await supabase.from('links').insert(payload).select()
    if (error) throw error
    modelValue.value = false
    showToast('success', 'Поздравляем!', 'Ссылка успешно добавлена!')
    cleanFormInputs()
  } catch (error) {
    console.log(error)
    showToast('error', 'Ошибка', 'Не удалось добавить ссылку.')
  } finally {
    isLoadingButton.value = false
  }
}

const updateLink = async () => {
  isLoadingButton.value = false

  const payload = {
    name: formData.value.name,
    url: formData.value.url,
    description: formData.value.description,
    category: formData.value.category.id,
    is_favorite: formData.value.isFavorite,
  }

  try {
    isLoadingButton.value = true
    const { error } = await supabase.from('links').update(payload).eq('id', id)
    if (error) throw error
    showToast('success', 'Поздравляем!', 'Ссылка успешно обновлена!')
  } catch (error) {
    console.log(error)
    showToast('error', 'Ошибка', 'Не удалось обновить ссылку.')
  } finally {
    isLoadingButton.value = false
  }
}

const submitLinkForm = async () => {
  if (isEdit) {
    await updateLink()
  } else {
    await addNewLink()
  }

  await linksStore.loadLinks(true, true)
}

watch(modelValue, async (newValue) => {
  if (newValue) await loadModal()
})
</script>
