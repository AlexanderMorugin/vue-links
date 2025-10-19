import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/supabase'

export const useUserStore = defineStore('userStore', () => {
  const user = ref(null)

  const getUser = async () => {
    const { data } = await supabase.auth.getUser()

    console.log(data)

    user.value = data?.user || null
  }

  const resetUser = () => (user.value = null)

  return { user, getUser, resetUser }
})
