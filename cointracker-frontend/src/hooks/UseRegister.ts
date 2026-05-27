import { register } from '@/lib/auth-api'
import { useMutation } from '@tanstack/react-query'

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  })
}
