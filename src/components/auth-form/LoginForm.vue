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
      <Button type="submit" class="w-full" label="Вход" :loading="loading" />
      <Button
        icon="pi pi-github"
        class="w-full"
        label="GitHub"
        severity="contrast"
        :loading="loading"
        @click="signinGitHub"
      />
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
import { useUserStore } from '@/stores/user-store'

const userStore = useUserStore()
const router = useRouter()

const { showToast } = useToastNotify()
const { loading, errorMessage, signin, signinGitHub } = useAuth()

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

  try {
    await signin({
      email: formData.value.email,
      password: formData.value.password,
    })

    await userStore.getUser()
    router.replace({ name: 'HomeView' })
  } catch (error) {
    showToast('error', 'Ошибка логина', errorMessage.value)
    console.log(error)
  }
}
</script>
