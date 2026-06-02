import type { AuthSession } from "@/types/auth"

const AUTH_KEY = import.meta.env.VITE_AUTH_STORAGE_KEY ?? 'cointracker_session'
export const AUTH_SESSION_CHANGED_EVENT = 'cointracker:auth-session-changed'

const emitSessionChanged = () => {
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT))
}

export const saveSession = (session: AuthSession) => {
  if (!session.accessToken || !session.refreshToken) return
  localStorage.setItem(AUTH_KEY, JSON.stringify(session))
  emitSessionChanged()
}

export const getSession = (): AuthSession | null => {
  const raw = localStorage.getItem(AUTH_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    localStorage.removeItem(AUTH_KEY)
    return null
  }
}

export const clearSession = () => {
  localStorage.removeItem(AUTH_KEY)
  emitSessionChanged()
}

export const getAccessToken = () => getSession()?.accessToken ?? null

export const getRefreshToken = () => getSession()?.refreshToken ?? null

export const isAuthenticated = () => !!getAccessToken()
