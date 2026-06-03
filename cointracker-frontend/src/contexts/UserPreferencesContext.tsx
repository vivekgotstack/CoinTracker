/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AUTH_SESSION_CHANGED_EVENT, getSession } from '@/lib/auth-storage'
import { getProfilePreferences, updateProfilePreferences } from '@/lib/profile-api'
import type { DigestFrequency, ServerPreferences } from '@/types/auth'

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

const getServerPreferencePatch = (
  preferences: Partial<UserPreferences>
): Partial<ServerPreferences> => {
  const patch: Partial<ServerPreferences> = {}

  if ('newsletterSubscribed' in preferences) {
    patch.newsletterSubscribed = preferences.newsletterSubscribed
  }
  if ('digestEnabled' in preferences) {
    patch.digestEnabled = preferences.digestEnabled
  }
  if ('digestFrequency' in preferences) {
    patch.digestFrequency = preferences.digestFrequency
  }

  return patch
}

const hasServerPreferencePatch = (preferences: Partial<ServerPreferences>) =>
  Object.keys(preferences).length > 0

const savePreferences = (ownerKey: string, preferences: UserPreferences) => {
  localStorage.setItem(getStorageKey(ownerKey), JSON.stringify(preferences))
}

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [ownerKey, setOwnerKey] = useState(getPreferenceOwnerKey)
  const [preferences, setPreferences] = useState<UserPreferences>(() => getInitialPreferences(ownerKey))

  useEffect(() => {
    const syncPreferencesToSession = () => {
      const nextOwnerKey = getPreferenceOwnerKey()
      const session = getSession()
      setOwnerKey(nextOwnerKey)
      setPreferences(getInitialPreferences(nextOwnerKey))

      if (!session?.accessToken) return

      getProfilePreferences()
        .then((serverPreferences) => {
          setPreferences((current) => {
            const updated = { ...current, ...serverPreferences }
            savePreferences(nextOwnerKey, updated)
            return updated
          })
        })
        .catch(() => undefined)
    }

    syncPreferencesToSession()
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, syncPreferencesToSession)
    return () => window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, syncPreferencesToSession)
  }, [])

  const updatePreferences = useCallback((nextPreferences: Partial<UserPreferences>) => {
    const serverPatch = getServerPreferencePatch(nextPreferences)
    const localPatch = { ...nextPreferences }
    delete localPatch.newsletterSubscribed
    delete localPatch.digestEnabled
    delete localPatch.digestFrequency

    const hasLocalPatch = Object.keys(localPatch).length > 0
    const hasServerPatch = hasServerPreferencePatch(serverPatch)

    if (hasLocalPatch) {
      setPreferences((current) => {
        const updated = { ...current, ...localPatch }
        savePreferences(ownerKey, updated)
        return updated
      })
    }

    if (hasServerPatch && getSession()?.accessToken) {
      updateProfilePreferences(serverPatch)
        .then((serverPreferences) => {
          setPreferences((current) => {
            const updated = { ...current, ...serverPreferences }
            savePreferences(ownerKey, updated)
            return updated
          })
        })
        .catch(() => undefined)
      return
    }

    if (hasLocalPatch && !hasServerPatch) return

    setPreferences((current) => {
      const updated = { ...current, ...nextPreferences }
      savePreferences(ownerKey, updated)
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
