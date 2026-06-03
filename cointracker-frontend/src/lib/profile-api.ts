import { api } from '@/lib/api'
import type { Profile, ServerPreferences } from '@/types/auth'

export const getProfile = async (): Promise<Profile> => {
  const res = await api.get('/api/profile')
  return res.data
}

export const updateProfile = async (
  profile: Pick<Profile, 'fullName'> & { profileImageUrl?: string | null }
): Promise<Profile> => {
  const res = await api.put('/api/profile', profile)
  return res.data
}

export const getProfilePreferences = async (): Promise<ServerPreferences> => {
  const res = await api.get('/api/profile/preferences')
  return res.data
}

export const updateProfilePreferences = async (
  preferences: Partial<ServerPreferences>
): Promise<ServerPreferences> => {
  const res = await api.put('/api/profile/preferences', preferences)
  return res.data
}
