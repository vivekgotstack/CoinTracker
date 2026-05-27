import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react'
import ExpenseChart from '@/components/shared/ExpenseChart'
import RecentTransactions from '@/components/shared/RecentTransactions'
import StatCard from '@/components/shared/StatCard'
import { useDashboard } from '@/hooks/UseDashboard'
import { formatCurrency, formatDate } from '@/lib/format'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'

const toExpenseChart = (expenses: NonNullable<ReturnType<typeof useDashboard>['data']>['recentExpenses']) =>
  expenses
    .slice()
    .reverse()
    .map((transaction) => ({
      label: formatDate(transaction.date).replace(' 202', ''),
      amount: Number(transaction.amount),
    }))

const DashboardPage = () => {
  const { data, isLoading, isError } = useDashboard()
  const { preferences } = useUserPreferences()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="glass-panel rounded-2xl p-6">
            <div className="skeleton-shimmer h-4 w-24 rounded-full" />
            <div className="skeleton-shimmer mt-5 h-8 w-36 rounded-full" />
            <div className="skeleton-shimmer mt-6 h-3 w-full rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  if (isError || !data) {
    return <div className="py-16 text-center text-rose-600">Unable to load dashboard.</div>
  }

  const chartData = toExpenseChart(data.recentExpenses)
  const money = (value: number) => (preferences.hideAmounts ? 'Hidden' : formatCurrency(value))

  return (
    <div className="space-y-10">
      <section>
        <div className="rounded-3xl bg-[var(--hero)] p-6 shadow-sm sm:p-8">
          <h1 className="brand-font text-4xl font-bold text-[var(--foreground)]">Financial Overview</h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
            A calm snapshot of your balance, income, expenses, and latest money movement.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="Total Balance"
          amount={money(data.totalBalance)}
          detail="Income minus expenses"
          tone="balance"
          icon={<DollarSign size={22} />}
        />

        <StatCard
          title="Total Income"
          amount={money(data.totalIncome)}
          detail={`${data.recentIncomes.length} recent income entries`}
          tone="income"
          icon={<TrendingUp size={22} />}
        />

        <StatCard
          title="Total Expenses"
          amount={money(data.totalExpense)}
          detail={`${data.recentExpenses.length} recent expense entries`}
          tone="expense"
          icon={<TrendingDown size={22} />}
        />
      </section>

      <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1.35fr_1fr]">
        <ExpenseChart data={chartData} />
        <RecentTransactions data={data.recentTransactions} />
      </section>
    </div>
  )
}

export default DashboardPage
