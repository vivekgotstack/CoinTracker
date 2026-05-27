export type AuthUser = {
  id: number
  email: string
  role: 'USER' | 'ADMIN'
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
