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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return data
    })
  }

  // Логин GitHub
  const signinGitHub = async () => {
    return await handleRequest(async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
      })

      if (error) throw error
      return data
    })
  }

  // Логаут
  const signout = async () => {
    return await handleRequest(async () => {
      const { data, error } = await supabase.auth.signOut()

      if (error) throw error
      return data
    })
  }

  // Сброс пароля
  const resetpassword = async (email) => {
    return await handleRequest(async () => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:5173/reset-password',
      })

      if (error) throw error
      return data
    })
  }

  // Обновление пароля
  const updatepassword = async (password) => {
    return await handleRequest(async () => {
      const { data, error } = await supabase.auth.updateUser({ password })

      if (error) throw error
      return data
    })
  }

  return {
    loading,
    errorMessage,
    signup,
    signin,
    signinGitHub,
    signout,
    resetpassword,
    updatepassword,
  }
}
