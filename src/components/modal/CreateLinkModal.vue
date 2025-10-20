<template>
  <Dialog modal header="Создание ссылки" v-model:visible="modelValue" :style="{ width: '25rem' }">
    <div class="mb-3">
      <InputText
        v-model="formInput.name"
        class="w-full"
        autocomplete="off"
        placeholder="Название ссылки"
      />
    </div>
    <div class="mb-3">
      <InputText v-model="formInput.url" class="w-full" autocomplete="off" placeholder="Ссылка" />
    </div>
    <div class="mb-3">
      <Select
        v-model="formInput.category"
        :options="categoryList"
        optionLabel="name"
        placeholder="Выбурите категорию"
        class="w-full"
      />
    </div>
    <div class="mb-3">
      <Textarea
        v-model="formInput.description"
        class="w-full"
        style="resize: none"
        placeholder="Описание"
      />
    </div>
    <div class="mb-3 flex items-center gap-2">
      <Checkbox v-model="formInput.isFavorite" inputId="isFavorite" binary />
      <label for="isFavorite">Добавить в избранное</label>
    </div>
    <div class="flex justify-end gap-2 my-4">
      <Button type="button" label="Добавить" :loading="isLoading" @click="saveLink" />
    </div>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import Checkbox from 'primevue/checkbox'
import { ref } from 'vue'

const modelValue = defineModel()

const formInput = ref({
  name: '',
  url: '',
  description: '',
  category: null,
  isFavorite: false,
})

const categoryList = ref([{ id: 1, name: 'TEST' }])

const saveLink = async () => {
  console.log('saveLink')
}
</script>
