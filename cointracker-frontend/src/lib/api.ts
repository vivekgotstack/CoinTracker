import axios from 'axios'
import {
  getAccessToken,
  getRefreshToken,
  saveSession,
  clearSession,
} from './auth-storage'
import { queryClient } from './query-client'

import type { AuthSession } from '@/types/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/auth/refresh']

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let queue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

const processQueue = (error: unknown, token?: string) => {
  queue.forEach((p) => {
    if (error) p.reject(error)
    else p.resolve(token!)
  })
  queue = []
}

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config

    const requestPath = String(original?.url ?? '')
    const isAuthRequest = AUTH_PATHS.some((path) => requestPath.includes(path))

    if (error.response?.status !== 401 || original._retry || isAuthRequest) {
      return Promise.reject(error)
    }

    original._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject })
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      })
    }

    isRefreshing = true

    try {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        clearSession()
        queryClient.removeQueries()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      const res = await axios.post<AuthSession>(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken }
      )

      if (!res.data.accessToken) {
        throw new Error('Refresh response did not include an access token')
      }

      saveSession(res.data)
      processQueue(null, res.data.accessToken)

      original.headers.Authorization = `Bearer ${res.data.accessToken}`
      return api(original)

    } catch (err) {
      processQueue(err)
      clearSession()
      queryClient.removeQueries()
      window.location.href = '/login'
      return Promise.reject(err)

    } finally {
      isRefreshing = false
    }
  }
)
