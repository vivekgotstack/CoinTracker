import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

type BrandMarkProps = {
  compact?: boolean
  className?: string
}

const BrandMark = ({ compact = false, className }: BrandMarkProps) => {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="brand-orbit relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--primary) text-white shadow-lg shadow-teal-900/20">
        <div className="absolute inset-1 rounded-xl bg-white/15" />
        <span className="brand-font relative text-2xl font-extrabold">₹</span>
        <Sparkles className="absolute -right-1 -top-1 text-(--accent)" size={16} />
      </div>

      {!compact ? (
        <div className="min-w-0">
          <h1 className="brand-font truncate text-2xl font-extrabold tracking-tight text-(--foreground)">
            CoinTracker
          </h1>
          <p className="truncate text-xs font-medium text-(--muted)">Money, neatly in motion</p>
        </div>
      ) : null}
    </div>
  )
}

export default BrandMark
