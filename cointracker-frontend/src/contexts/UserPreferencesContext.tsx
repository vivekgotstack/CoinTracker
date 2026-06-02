/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AUTH_SESSION_CHANGED_EVENT, getSession } from '@/lib/auth-storage'

type DigestFrequency = 'daily' | 'weekly' | 'monthly'

export type UserPreferences = {
  avatarEmoji: string
  displayName: string
  hideAmounts: boolean
  compactTables: boolean
  newsletterSubscribed: boolean
  digestEnabled: boolean
  digestFrequency: DigestFrequency
}

type UserPreferencesContextValue = {
  preferences: UserPreferences
  updatePreferences: (preferences: Partial<UserPreferences>) => void
}

const PREFERENCES_KEY = import.meta.env.VITE_PREFERENCES_STORAGE_KEY ?? 'cointracker_preferences'

const defaultPreferences: UserPreferences = {
  avatarEmoji: '\u{1F642}',
  displayName: '',
  hideAmounts: false,
  compactTables: false,
  newsletterSubscribed: true,
  digestEnabled: true,
  digestFrequency: 'weekly',
}

const UserPreferencesContext = createContext<UserPreferencesContextValue | null>(null)

const getPreferenceOwnerKey = () => {
  const user = getSession()?.user
  return user?.id ? `user:${user.id}` : 'guest'
}

const getStorageKey = (ownerKey: string) => `${PREFERENCES_KEY}:${ownerKey}`

const getInitialPreferences = (ownerKey = getPreferenceOwnerKey()): UserPreferences => {
  const storageKey = getStorageKey(ownerKey)
  const stored = localStorage.getItem(storageKey)
  if (!stored) return defaultPreferences

  try {
    return { ...defaultPreferences, ...JSON.parse(stored) }
  } catch {
    localStorage.removeItem(storageKey)
    return defaultPreferences
  }
}

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [ownerKey, setOwnerKey] = useState(getPreferenceOwnerKey)
  const [preferences, setPreferences] = useState<UserPreferences>(() => getInitialPreferences(ownerKey))

  useEffect(() => {
    const syncPreferencesToSession = () => {
      const nextOwnerKey = getPreferenceOwnerKey()
      setOwnerKey(nextOwnerKey)
      setPreferences(getInitialPreferences(nextOwnerKey))
    }

    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, syncPreferencesToSession)
    return () => window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, syncPreferencesToSession)
  }, [])

  const updatePreferences = useCallback((nextPreferences: Partial<UserPreferences>) => {
    setPreferences((current) => {
      const updated = { ...current, ...nextPreferences }
      localStorage.setItem(getStorageKey(ownerKey), JSON.stringify(updated))
      return updated
    })
  }, [ownerKey])

  const value = useMemo(
    () => ({
      preferences,
      updatePreferences,
    }),
    [preferences, updatePreferences]
  )

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  )
}

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext)

  if (!context) {
    throw new Error('useUserPreferences must be used inside UserPreferencesProvider')
  }

  return context
}
