import { supabase } from '@/supabase'
import { useRequest } from './use-request'

export function useAuth() {
  const { loading, errorMessage, handleRequest } = useRequest()

  const signup = async ({ email, password, firstname }) => {
    return await handleRequest(async () => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { first_name: firstname },
        },
      })

      if (error) throw error
      return data
    })
  }

  return { loading, errorMessage, signup }
}
