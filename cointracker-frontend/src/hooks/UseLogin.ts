import { login } from '@/lib/auth-api'
import { saveSession } from '@/lib/auth-storage'
import { useMutation } from '@tanstack/react-query'

export const useLogin = () => {
  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      saveSession(data)
    },
  })
}