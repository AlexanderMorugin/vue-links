<template>
  <Toast />
  <Form
    v-slot="$form"
    initial-values="formData"
    :resolver="resolver"
    :validate-on-blur="true"
    :validate-on-value-update="false"
    @submit="submitLoginForm"
  >
    <div class="mb-3">
      <InputText
        name="email"
        placeholder="Введите email"
        type="text"
        v-model="formData.email"
        class="w-full"
      />
      <Message v-if="$form.email?.invalid" severity="error" variant="simple" size="small">{{
        $form.email.error.message
      }}</Message>
    </div>
    <div class="mb-3">
      <InputText
        name="password"
        placeholder="Введите пароль"
        type="password"
        v-model="formData.password"
        class="w-full"
      />
      <Message v-if="$form.password?.invalid" severity="error" variant="simple" size="small">{{
        $form.password.error.message
      }}</Message>
    </div>
    <span class="mb-3 cursor-pointer block" @click="emit('resetPassword')">Забыли пароль?</span>
    <div class="grid grid-cols-2 gap-3">
      <Button type="submit" class="w-full" label="Вход" />
      <Button type="submit" icon="pi pi-github" class="w-full" label="GitHub" severity="contrast" />
    </div>
  </Form>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { Form } from '@primevue/forms'
import * as z from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import Message from 'primevue/message'

const toast = useToast()

const emit = defineEmits(['resetPassword'])

const formData = ref({
  email: '',
  password: '',
})

const rules = z.object({
  email: z.string('Заполните поле').email({ message: 'Некорректный email' }),
  password: z.string('Заполните поле').min(6, { message: 'Не менее 6 символов' }),
})

const resolver = ref(zodResolver(rules))

const submitLoginForm = async ({ valid }) => {
  if (!valid) return

  toast.add({ severity: 'info', summary: 'Логин', detail: 'Вход успешно выполнен', life: 5000 })

  console.log(valid)
}
</script>
