import { supabase } from '@/supabase'
import { createRouter, createWebHistory } from 'vue-router'

let user = null

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

const getUser = async (next) => {
  user = await supabase.auth.getSession()

  if (user.data.session === null || user === null) {
    next({ name: 'AuthView' })
  } else {
    // console.log(user)
    next()
  }
}

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    await getUser(next)
  } else {
    next()
  }
})

export default router
