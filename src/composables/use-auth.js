import { supabase } from '@/supabase'
import { useRequest } from './use-request'

export function useAuth() {
  const { loading, errorMessage, handleRequest } = useRequest()

  // Регистрация
  const signup = async ({ email, password, firstname }) => {
    return await handleRequest(async () => {
      // Создаем пользователя в supabase authentication
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { first_name: firstname },
        },
      })

      // Создаем пользователя в supabase database users
      await supabase.from('users').insert([{ id: data.user.id, email, firstname }])

      if (error) throw error
      return data
    })
  }

  // Логин
  const signin = async ({ email, password }) => {
    return await handleRequest(async () => {
      // Логиним пользователя в supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return data
    })
  }

  // Сброс пароля
  const resetpassword = async (email) => {
    return await handleRequest(async () => {
      // Логиним пользователя в supabase authentication
      const { data, error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) throw error
      return data
    })
  }

  return { loading, errorMessage, signup, signin, resetpassword }
}
