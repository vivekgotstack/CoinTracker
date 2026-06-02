import { login } from '@/lib/auth-api'
import { saveSession } from '@/lib/auth-storage'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,

    onSuccess: (data) => {
      queryClient.removeQueries()
      saveSession(data)
    },
  })
}
