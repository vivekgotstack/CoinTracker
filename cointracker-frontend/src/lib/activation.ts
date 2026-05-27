const PENDING_ACTIVATION_EMAIL_KEY =
  import.meta.env.VITE_PENDING_ACTIVATION_STORAGE_KEY ?? 'cointracker_pending_activation_email'
const FIRST_LOGIN_EMAIL_KEY =
  import.meta.env.VITE_FIRST_LOGIN_STORAGE_KEY ?? 'cointracker_first_login_email'

export const markPendingActivation = (email: string) => {
  localStorage.setItem(PENDING_ACTIVATION_EMAIL_KEY, email.toLowerCase())
}

export const isPendingActivationEmail = (email: string) =>
  localStorage.getItem(PENDING_ACTIVATION_EMAIL_KEY) === email.toLowerCase()

export const markFirstLogin = (email: string) => {
  localStorage.setItem(FIRST_LOGIN_EMAIL_KEY, email.toLowerCase())
  localStorage.removeItem(PENDING_ACTIVATION_EMAIL_KEY)
}

export const consumeFirstLogin = (email?: string | null) => {
  if (!email) return false

  const normalizedEmail = email.toLowerCase()
  const isFirstLogin = localStorage.getItem(FIRST_LOGIN_EMAIL_KEY) === normalizedEmail

  if (isFirstLogin) {
    localStorage.removeItem(FIRST_LOGIN_EMAIL_KEY)
  }

  return isFirstLogin
}
