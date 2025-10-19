<template>
  <Form
    v-slot="$form"
    initial-values="formData"
    :resolver="resolver"
    :validate-on-blur="true"
    :validate-on-value-update="false"
    @submit="submitResetPasswordForm"
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
    <div class="grid grid-cols-2 gap-3">
      <Button type="submit" class="w-full" label="Сброс пароля" :loading="loading" />
    </div>
  </Form>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { Form } from '@primevue/forms'
import * as z from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import Message from 'primevue/message'
import { useToastNotify } from '@/composables/use-toast-notify'
import { useAuth } from '@/composables/use-auth'

const { showToast } = useToastNotify()
const { loading, errorMessage, resetpassword } = useAuth()

const formData = ref({
  email: '',
})

const rules = z.object({
  email: z.string('Заполните поле').email({ message: 'Некорректный email' }),
})

const resolver = ref(zodResolver(rules))

const submitResetPasswordForm = async ({ valid }) => {
  if (!valid) return

  try {
    await resetpassword(formData.value.email)
    showToast('success', 'Ссылка на сброс пароля отправлен на указанную почту')
  } catch (error) {
    showToast('error', 'Ошибка сброса пароля', errorMessage.value)
    console.log(error)
  }
}
</script>
