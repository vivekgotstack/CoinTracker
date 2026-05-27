const RESET_COOLDOWN_KEY = 'cointracker_reset_link_sent_at'
const RESET_COOLDOWN_MS = 10 * 60 * 1000

export const startResetCooldown = () => {
  localStorage.setItem(RESET_COOLDOWN_KEY, String(Date.now()))
}

export const getResetCooldownRemaining = () => {
  const sentAt = Number(localStorage.getItem(RESET_COOLDOWN_KEY) ?? 0)
  if (!sentAt) return 0

  const remaining = RESET_COOLDOWN_MS - (Date.now() - sentAt)
  if (remaining <= 0) {
    localStorage.removeItem(RESET_COOLDOWN_KEY)
    return 0
  }

  return remaining
}

export const formatCooldown = (milliseconds: number) => {
  const totalMinutes = Math.ceil(milliseconds / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`
  if (hours > 0) return `${hours}h`
  return `${minutes}m`
}
