import { AxiosError } from 'axios'
import type { ApiErrorResponse } from '@/types/api-error'

export const getApiErrorMessage = (error: unknown, fallback = 'Something went wrong') => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined
    if (data?.message) return data.message
  }

  if (error instanceof Error && error.message) return error.message

  return fallback
}
