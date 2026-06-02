import { Crown, Shield, UserRound } from 'lucide-react'
import './stats-visuals.css'

type SavingsBadgeProps = {
  displayName: string
  savingsRate: number
  showName?: boolean
}

const getBadgeTier = (savingsRate: number) => {
  if (savingsRate >= 50) return 'gold'
  if (savingsRate >= 30) return 'silver'
  return 'standard'
}

const SavingsBadge = ({ displayName, savingsRate, showName = true }: SavingsBadgeProps) => {
  const tier = getBadgeTier(savingsRate)
  const Icon = tier === 'gold' ? Crown : tier === 'silver' ? Shield : UserRound
  const label = tier === 'gold' ? 'Gold Saver' : tier === 'silver' ? 'Silver Saver' : 'Getting Started'

  return (
    <div className={`savings-badge savings-badge-${tier}`}>
      <span className="savings-badge-icon">
        <Icon size={18} />
      </span>
      <span className="min-w-0">
        {showName ? <span className="savings-badge-name">{displayName}</span> : null}
        <span className="savings-badge-label">{label}</span>
      </span>
    </div>
  )
}

export default SavingsBadge
