import 'primeicons/primeicons.css'
import '@/assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Aura from '@primeuix/themes/aura'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
  pt: {
    toast: {
      root: {
        style: 'max-width: calc(100vw - 40px)',
      },
    },
  },
})
app.use(ToastService)

app.mount('#app')
