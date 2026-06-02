import { useMemo, type ReactNode } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Gauge,
  Landmark,
  PieChart as PieChartIcon,
  ReceiptText,
  Target,
  Wallet,
} from 'lucide-react'
import { useCategories } from '@/hooks/UseCategories'
import { useDashboard } from '@/hooks/UseDashboard'
import { useTransactions } from '@/hooks/UseTransactions'
import { formatCurrency, formatDate } from '@/lib/format'
import { renderEntityIcon } from '@/lib/icons'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import type { Transaction } from '@/types/transaction'

const COLORS = {
  income: '#059669',
  expense: '#e11d48',
  balance: '#0d9488',
  muted: '#94a3b8',
}

const sum = (transactions: Transaction[]) =>
  transactions.reduce((total, transaction) => total + Number(transaction.amount), 0)

const average = (transactions: Transaction[]) => (transactions.length ? sum(transactions) / transactions.length : 0)

const compactDate = (date: string) => formatDate(date).replace(' 202', '')

const AnalyticsPage = () => {
  const dashboard = useDashboard()
  const transactions = useTransactions({ page: 0, size: 100, sort: 'date,desc' })
  const categories = useCategories()
  const { preferences } = useUserPreferences()
  const money = (value: number) => (preferences.hideAmounts ? 'Hidden' : formatCurrency(value))

  const categoryNameById = useMemo(
    () => new Map((categories.data ?? []).map((category) => [category.id, category.name])),
    [categories.data]
  )

  const allTransactions = useMemo(() => transactions.data?.content ?? [], [transactions.data?.content])

  const stats = useMemo(() => {
    const incomes = allTransactions.filter((transaction) => transaction.type === 'INCOME')
    const expenses = allTransactions.filter((transaction) => transaction.type === 'EXPENSE')
    const incomeTotal = Number(dashboard.data?.totalIncome ?? sum(incomes))
    const expenseTotal = Number(dashboard.data?.totalExpense ?? sum(expenses))
    const netFlow = incomeTotal - expenseTotal
    const savingsRate = incomeTotal > 0 ? Math.max(0, (netFlow / incomeTotal) * 100) : 0
    const largestExpense = expenses.reduce<Transaction | null>(
      (largest, transaction) =>
        !largest || Number(transaction.amount) > Number(largest.amount) ? transaction : largest,
      null
    )
    const largestIncome = incomes.reduce<Transaction | null>(
      (largest, transaction) =>
        !largest || Number(transaction.amount) > Number(largest.amount) ? transaction : largest,
      null
    )

    const recentExpenseByCategory = expenses.reduce<Map<number, { name: string; value: number }>>(
      (map, transaction) => {
        const current = map.get(transaction.categoryId)
        const name = categoryNameById.get(transaction.categoryId) ?? `Category #${transaction.categoryId}`
        const value = (current?.value ?? 0) + Number(transaction.amount)
        map.set(transaction.categoryId, { name, value })
        return map
      },
      new Map()
    )

    const topExpenseCategories = Array.from(recentExpenseByCategory.values())
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    const dailyFlow = Array.from(
      allTransactions
        .slice(0, 30)
        .reduce<Map<string, { date: string; income: number; expense: number; net: number }>>((map, transaction) => {
          const current = map.get(transaction.date) ?? {
            date: transaction.date,
            income: 0,
            expense: 0,
            net: 0,
          }
          const amount = Number(transaction.amount)

          if (transaction.type === 'INCOME') {
            current.income += amount
            current.net += amount
          } else {
            current.expense += amount
            current.net -= amount
          }

          map.set(transaction.date, current)
          return map
        }, new Map())
        .values()
    )
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-10)
      .map((item) => ({ ...item, label: compactDate(item.date) }))

    return {
      incomes,
      expenses,
      incomeTotal,
      expenseTotal,
      netFlow,
      savingsRate,
      averageIncome: average(incomes),
      averageExpense: average(expenses),
      largestExpense,
      largestIncome,
      topExpenseCategories,
      dailyFlow,
      split: [
        { name: 'Income', value: incomeTotal },
        { name: 'Expense', value: expenseTotal },
      ],
    }
  }, [allTransactions, categoryNameById, dashboard.data])

  if (dashboard.isLoading || transactions.isLoading || categories.isLoading) {
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

  if (dashboard.isError || transactions.isError || !dashboard.data) {
    return <div className="py-16 text-center text-rose-600">Unable to load stats.</div>
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="stats-hero relative overflow-hidden rounded-3xl bg-(--hero) p-5 shadow-sm sm:p-7">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <span key={item} className={`cash-coin cash-coin-${item}`} />
          ))}
        </div>

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-end py-5">
          <div>
            <p className="text-sm font-semibold text-(--primary)">Stats</p>
            <h1 className="brand-font mt-2 text-3xl font-bold text-(--foreground) sm:text-4xl">
              Money Patterns
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-(--muted)">
              Trends, ratios, and spending concentration from your latest records.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-2xl bg-[color-mix(in_srgb,var(--surface)_76%,transparent)] px-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-(--muted)">
                <Target size={15} />
                Savings Rate
              </div>
              <p className="mt-3 text-2xl font-bold text-(--foreground)">
                {preferences.hideAmounts ? 'Hidden' : `${stats.savingsRate.toFixed(1)}%`}
              </p>
            </div>
            <div className="rounded-2xl bg-[color-mix(in_srgb,var(--surface)_76%,transparent)] px-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase text-(--muted)">
                <Gauge size={15} />
                Net Flow
              </div>
              <p className={`mt-3 text-2xl font-bold ${stats.netFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {money(stats.netFlow)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4 py-10">
        <MetricCard
          icon={<ArrowUpRight size={18} />}
          label="Avg income entry"
          value={money(stats.averageIncome)}
          detail={`${stats.incomes.length} income records sampled`}
          tone="income"
        />
        <MetricCard
          icon={<ArrowDownRight size={18} />}
          label="Avg expense entry"
          value={money(stats.averageExpense)}
          detail={`${stats.expenses.length} expense records sampled`}
          tone="expense"
        />
        <MetricCard
          icon={<Landmark size={18} />}
          label="Largest income"
          value={stats.largestIncome ? money(Number(stats.largestIncome.amount)) : 'None'}
          detail={stats.largestIncome?.name ?? 'No income yet'}
          tone="income"
        />
        <MetricCard
          icon={<ReceiptText size={18} />}
          label="Largest expense"
          value={stats.largestExpense ? money(Number(stats.largestExpense.amount)) : 'None'}
          detail={stats.largestExpense?.name ?? 'No expenses yet'}
          tone="expense"
        />
      </section>

      <section className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <Panel
          icon={<Activity size={19} />}
          title="Cashflow Rhythm"
          subtitle="Income and expense movement across recent transaction days"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.dailyFlow}>
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value, name) => [
                    preferences.hideAmounts ? 'Hidden' : formatCurrency(Number(value)),
                    name === 'income' ? 'Income' : name === 'expense' ? 'Expense' : 'Net',
                  ]}
                />
                <Bar dataKey="income" fill={COLORS.income} radius={[8, 8, 0, 0]} />
                <Bar dataKey="expense" fill={COLORS.expense} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          icon={<PieChartIcon size={19} />}
          title="Income vs Expense"
          subtitle="A ratio view, separate from the Home overview"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.split} dataKey="value" nameKey="name" innerRadius={62} outerRadius={104}>
                  {stats.split.map((entry) => (
                    <Cell key={entry.name} fill={entry.name === 'Income' ? COLORS.income : COLORS.expense} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => (preferences.hideAmounts ? 'Hidden' : formatCurrency(Number(value)))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </section>

      <section className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(320px,0.75fr)_minmax(0,1.25fr)] py-10">
        <Panel
          icon={<Wallet size={19} />}
          title="Expense Concentration"
          subtitle="Where recent spending is clustered"
        >
          <div className="space-y-3">
            {stats.topExpenseCategories.length ? (
              stats.topExpenseCategories.map((category) => {
                const percent = stats.expenseTotal > 0 ? (category.value / stats.expenseTotal) * 100 : 0

                return (
                  <div key={category.name}>
                    <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                      <span className="truncate font-medium text-(--foreground)">{category.name}</span>
                      <span className="shrink-0 text-(--muted)">
                        {preferences.hideAmounts ? 'Hidden' : `${percent.toFixed(1)}%`}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-(--surface-muted)">
                      <div
                        className="h-full rounded-full bg-rose-600"
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="rounded-xl border border-dashed border-(--border) p-4 text-sm text-(--muted)">
                Add expense transactions to see concentration.
              </p>
            )}
          </div>
        </Panel>

        <Panel
          icon={<ReceiptText size={19} />}
          title="Recent Signals"
          subtitle="Newest records with category context"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {allTransactions.slice(0, 6).map((transaction) => {
              const isIncome = transaction.type === 'INCOME'

              return (
                <div key={transaction.id} className="rounded-2xl border border-(--border) bg-(--surface-muted) p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--surface) text-xl">
                        {renderEntityIcon(transaction.icon, isIncome ? '\u{1F4B8}' : '\u{1F9FE}')}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-(--foreground)">{transaction.name}</p>
                        <p className="truncate text-xs text-(--muted)">
                          {categoryNameById.get(transaction.categoryId) ?? `Category #${transaction.categoryId}`}
                        </p>
                      </div>
                    </div>
                    <span className={`shrink-0 text-sm font-semibold ${isIncome ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {preferences.hideAmounts
                        ? 'Hidden'
                        : `${isIncome ? '+' : '-'}${formatCurrency(transaction.amount)}`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>
      </section>
    </div>
  )
}

type MetricCardProps = {
  icon: ReactNode
  label: string
  value: string
  detail: string
  tone: 'income' | 'expense'
}

const MetricCard = ({ icon, label, value, detail, tone }: MetricCardProps) => (
  <div className="glass-panel rounded-2xl p-5">
    <div
      className={`mb-5 flex h-10 w-10 items-center justify-center rounded-xl ${
        tone === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
      }`}
    >
      {icon}
    </div>
    <p className="text-sm font-medium text-(--muted)">{label}</p>
    <p className="mt-2 truncate text-2xl font-bold text-(--foreground)">{value}</p>
    <p className="mt-2 truncate text-sm text-(--muted)">{detail}</p>
  </div>
)

type PanelProps = {
  icon: ReactNode
  title: string
  subtitle: string
  children: ReactNode
}

const Panel = ({ icon, title, subtitle, children }: PanelProps) => (
  <div className="glass-panel rounded-2xl p-5">
    <div className="mb-5 flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--surface-muted) text-(--primary)">
        {icon}
      </span>
      <div>
        <h2 className="text-lg font-semibold text-(--foreground)">{title}</h2>
        <p className="text-sm text-(--muted)">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
)

export default AnalyticsPage
