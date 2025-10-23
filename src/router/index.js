import { supabase } from '@/supabase'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/auth',
    name: 'AuthView',
    component: () => import('../views/AuthView.vue'),
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/ResetPassword.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession()
  const session = data.session

  if (to.meta.requiresAuth && !session) {
    return next({ name: 'AuthView' })
  }

  if (!to.meta.requiresAuth && session) {
    return next({ name: 'HomeView' })
  }
  next()
})

export default router
