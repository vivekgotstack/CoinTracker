/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

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

const getInitialPreferences = (): UserPreferences => {
  const stored = localStorage.getItem(PREFERENCES_KEY)
  if (!stored) return defaultPreferences

  try {
    return { ...defaultPreferences, ...JSON.parse(stored) }
  } catch {
    localStorage.removeItem(PREFERENCES_KEY)
    return defaultPreferences
  }
}

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(getInitialPreferences)

  const updatePreferences = (nextPreferences: Partial<UserPreferences>) => {
    setPreferences((current) => {
      const updated = { ...current, ...nextPreferences }
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const value = useMemo(
    () => ({
      preferences,
      updatePreferences,
    }),
    [preferences]
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
