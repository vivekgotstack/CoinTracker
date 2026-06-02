import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type StatTone = 'balance' | 'income' | 'expense'

type StatCardProps = {
  title: string
  amount: string
  icon: ReactNode
  detail: string
  tone: StatTone
}

const toneClasses: Record<StatTone, string> = {
  balance: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  income: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  expense: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
}

const StatCard = ({ title, amount, icon, detail, tone }: StatCardProps) => {
  return (
    <article className="glass-panel rounded-2xl p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-(--muted)">{title}</p>
          <h3 className="mt-2 wrap-break-word text-2xl font-semibold text-(--foreground)">{amount}</h3>
        </div>

        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-lg', toneClasses[tone])}>
          {icon}
        </div>
      </div>

      <p className="mt-4 text-sm text-(--muted)">{detail}</p>
    </article>
  )
}

export default StatCard
