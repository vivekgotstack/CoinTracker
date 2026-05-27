import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Landmark, Wallet } from 'lucide-react'
import ExpenseChart from '@/components/shared/ExpenseChart'
import RecentTransactions from '@/components/shared/RecentTransactions'
import StatCard from '@/components/shared/StatCard'
import { useDashboard } from '@/hooks/UseDashboard'
import { useTransactions } from '@/hooks/UseTransactions'
import { formatCurrency, formatDate } from '@/lib/format'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'

const COLORS = ['#059669', '#e11d48']

const AnalyticsPage = () => {
  const dashboard = useDashboard()
  const transactions = useTransactions({ page: 0, size: 100, sort: 'date,asc' })
  const { preferences } = useUserPreferences()
  const money = (value: number) => (preferences.hideAmounts ? 'Hidden' : formatCurrency(value))

  if (dashboard.isLoading || transactions.isLoading) {
    return <div className="py-16 text-center text-neutral-500 dark:text-neutral-400">Loading analytics...</div>
  }

  if (!dashboard.data) {
    return <div className="py-16 text-center text-rose-600">Unable to load analytics.</div>
  }

  const allTransactions = transactions.data?.content ?? []
  const expenseTrend = allTransactions
    .filter((transaction) => transaction.type === 'EXPENSE')
    .slice(-12)
    .map((transaction) => ({
      label: formatDate(transaction.date).replace(' 202', ''),
      amount: Number(transaction.amount),
    }))

  const split = [
    { name: 'Income', value: Number(dashboard.data.totalIncome) },
    { name: 'Expense', value: Number(dashboard.data.totalExpense) },
  ]

  return (
    <div className="space-y-9">
      <section>
        <h1 className="brand-font text-3xl font-bold text-[var(--foreground)]">Analytics</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          A compact breakdown using dashboard totals and transaction history.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <StatCard
          title="Income"
          amount={money(dashboard.data.totalIncome)}
          detail="All income transactions combined"
          tone="income"
          icon={<Landmark size={22} />}
        />
        <StatCard
          title="Expense"
          amount={money(dashboard.data.totalExpense)}
          detail="All expense transactions combined"
          tone="expense"
          icon={<Wallet size={22} />}
        />
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.35fr_1fr]">
        <ExpenseChart data={expenseTrend} title="Expense Timeline" subtitle="Latest expense records by date" />

        <div className="glass-panel rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Income vs Expense</h2>
          <p className="text-sm text-[var(--muted)]">A clean split of what came in and what went out</p>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={split} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110}>
                  {split.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => (preferences.hideAmounts ? 'Hidden' : formatCurrency(Number(value)))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <RecentTransactions
        data={allTransactions.slice(-8).reverse()}
        title="Latest Transactions"
        subtitle="Your newest money moves"
      />
    </div>
  )
}

export default AnalyticsPage
