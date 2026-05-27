export const DISPLAY_NAME_MAX_LENGTH = 15

export const nameFromEmail = (email?: string | null) => {
  const raw = email?.split('@')[0] ?? ''
  const cleaned = raw
    .replace(/[._-]+/g, ' ')
    .replace(/\d+/g, '')
    .trim()

  if (!cleaned) return 'there'

  return cleaned
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export const getPreferredDisplayName = (savedName: string, email?: string | null) => {
  const trimmed = savedName.trim()
  return (trimmed || nameFromEmail(email)).slice(0, DISPLAY_NAME_MAX_LENGTH)
}
