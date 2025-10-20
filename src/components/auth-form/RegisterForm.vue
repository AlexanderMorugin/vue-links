<template>
  <Toast />
  <Form
    v-slot="$form"
    initial-values="formData"
    :resolver="resolver"
    :validate-on-blur="true"
    :validate-on-value-update="false"
    @submit="submitRegisterForm"
  >
    <div class="mb-3">
      <InputText
        name="firstname"
        placeholder="Введите имя"
        type="text"
        v-model="formData.firstname"
        class="w-full"
      />
      <Message v-if="$form.firstname?.invalid" severity="error" variant="simple" size="small">{{
        $form.firstname.error?.message
      }}</Message>
    </div>
    <div class="mb-3">
      <InputText
        name="email"
        placeholder="Введите email"
        type="text"
        v-model="formData.email"
        class="w-full"
      />
      <Message v-if="$form.email?.invalid" severity="error" variant="simple" size="small">{{
        $form.email.error?.message
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
        $form.password.error?.message
      }}</Message>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <Button type="submit" class="w-full" label="Регистрация" :loading="loading" />
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
import { Form } from '@primevue/forms'
import Toast from 'primevue/toast'
import * as z from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import Message from 'primevue/message'
import { useToastNotify } from '@/composables/use-toast-notify'
import { useAuth } from '@/composables/use-auth'

const router = useRouter()

const { showToast } = useToastNotify()
const { loading, errorMessage, signup, signinGitHub } = useAuth()

const formData = ref({
  firstname: '',
  email: '',
  password: '',
})

const rules = z.object({
  firstname: z.string('Заполните поле').min(2, { message: 'Не менее 2 символов' }),
  email: z.string('Заполните поле').email({ message: 'Некорректный email' }),
  password: z.string('Заполните поле').min(6, { message: 'Не менее 6 символов' }),
})

const resolver = ref(zodResolver(rules))

const submitRegisterForm = async ({ valid }) => {
  if (!valid) return

  try {
    await signup({
      email: formData.value.email,
      password: formData.value.password,
      firstname: formData.value.firstname,
    })

    router.replace({ name: 'HomeView' })
  } catch (error) {
    showToast('error', 'Ошибка регистрации', errorMessage.value)
    console.log(error)
  }
}
</script>
