import { useEffect, useState } from 'react'
import {
  formatCooldown,
  getResetCooldownRemaining,
  startResetCooldown,
} from '@/lib/reset-cooldown'

export const useResetCooldown = () => {
  const [remaining, setRemaining] = useState(getResetCooldownRemaining)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining(getResetCooldownRemaining())
    }, 1000 * 5)

    return () => window.clearInterval(interval)
  }, [])

  const start = () => {
    startResetCooldown()
    setRemaining(getResetCooldownRemaining())
  }

  return {
    disabled: remaining > 0,
    remaining,
    label: remaining > 0 ? `Try again in ${formatCooldown(remaining)}` : 'Send reset link',
    start,
  }
}
