import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type StatCardProps = {
  title: string
  amount: string
  icon: ReactNode
  trend: string
  trendType: 'positive' | 'negative'
}

const StatCard = ({
  title,
  amount,
  icon,
  trend,
  trendType,
}: StatCardProps) => {
  return (
    <article className="rounded-3xl border bg-white/70 p-6 backdrop-blur-xl shadow-sm hover:shadow-md transition">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-neutral-500">{title}</p>
          <h3 className="text-3xl font-semibold mt-3">{amount}</h3>
        </div>

        <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
          {icon}
        </div>
      </div>

      <p
        className={cn(
          'mt-5 text-sm font-semibold',
          trendType === 'positive' ? 'text-emerald-600' : 'text-rose-500'
        )}
      >
        {trend}
      </p>
    </article>
  )
}

export default StatCard