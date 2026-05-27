import { api } from '@/lib/api'
import type { LoginRequest, AuthSession, RegisterRequest } from '@/types/auth'

export const login = async (
  data: LoginRequest
): Promise<AuthSession> => {
  const res = await api.post('/auth/login', data)
  return res.data
}

export const register = async (
  data: RegisterRequest
): Promise<AuthSession> => {
  const res = await api.post('/auth/register', data)
  return res.data
}

export const refresh = async (
  refreshToken: string
): Promise<AuthSession> => {
  const res = await api.post('/auth/refresh', {
    refreshToken,
  })
  return res.data
}

export const forgotPassword = async (email: string): Promise<string> => {
  const res = await api.post<string>('/auth/forgot-password', { email })
  return res.data
}

export const resetPassword = async (token: string, newPassword: string): Promise<string> => {
  const res = await api.post<string>('/auth/reset-password', { token, newPassword })
  return res.data
}
