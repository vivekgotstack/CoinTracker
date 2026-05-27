import { getSession } from '@/lib/auth-storage'

export const useAuth = () => {
  const session = getSession()

  return {
    user: session?.user ?? null,
    role: session?.user?.role ?? null,
    isAuthenticated: !!session?.accessToken,
  }
}
