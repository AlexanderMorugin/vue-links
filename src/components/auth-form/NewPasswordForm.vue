<template>
  <Toast />
  <Form
    v-slot="$form"
    initial-values="formData"
    :resolver="resolver"
    :validate-on-blur="true"
    :validate-on-value-update="false"
    @submit="submitNewPasswordForm"
  >
    <div class="mb-3">
      <InputText
        name="password"
        placeholder="Введите новый пароль"
        type="password"
        v-model="formData.password"
        class="w-full"
      />
      <Message v-if="$form.password?.invalid" severity="error" variant="simple" size="small">{{
        $form.password.error.message
      }}</Message>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <Button type="submit" class="w-full" label="Обновить" :loading="loading" />
    </div>
  </Form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import { Form } from '@primevue/forms'
import * as z from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import Message from 'primevue/message'
import { useToastNotify } from '@/composables/use-toast-notify'
import { useAuth } from '@/composables/use-auth'

const { showToast } = useToastNotify()
const { loading, errorMessage, updatepassword } = useAuth()

const router = useRouter()

const formData = ref({
  password: '',
})

const rules = z.object({
  password: z.string('Заполните поле').min(6, { message: 'Не менее 6 символов' }),
})

const resolver = ref(zodResolver(rules))

const submitNewPasswordForm = async ({ valid }) => {
  if (!valid) return

  try {
    await updatepassword(formData.value.password)

    router.replace('/auth')
  } catch (error) {
    showToast('error', 'Ошибка обновления пароля', errorMessage.value)
    console.log(error)
  }
}
</script>
