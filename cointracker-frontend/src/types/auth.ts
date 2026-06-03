export type AuthUser = {
  id: number
  email: string
  fullName?: string
  role: 'USER' | 'ADMIN'
  profileImageUrl?: string
}

export type DigestFrequency = 'daily' | 'weekly' | 'monthly'

export type ServerPreferences = {
  newsletterSubscribed: boolean
  digestEnabled: boolean
  digestFrequency: DigestFrequency
}

export type Profile = {
  id: number
  email: string
  fullName: string
  profileImageUrl?: string | null
  createdAt: string
  updatedAt: string
}

export type AuthSession = {
  accessToken?: string
  refreshToken?: string
  tokenType: string
  expiresIn: number
  user: AuthUser
  message?: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  email: string
  password: string
  fullName: string
}
