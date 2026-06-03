import { useEffect, useState } from 'react'
import { AUTH_SESSION_CHANGED_EVENT, getSession } from '@/lib/auth-storage'

export const useAuth = () => {
  const [session, setSession] = useState(getSession)

  useEffect(() => {
    const syncSession = () => setSession(getSession())
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, syncSession)
    return () => window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, syncSession)
  }, [])

  return {
    user: session?.user ?? null,
    role: session?.user?.role ?? null,
    isAuthenticated: !!session?.accessToken,
  }
}
