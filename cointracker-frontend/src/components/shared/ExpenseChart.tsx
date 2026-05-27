import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'

type ChartPoint = {
  label: string
  amount: number
}

type ExpenseChartProps = {
  data: ChartPoint[]
  title?: string
  subtitle?: string
}

const ExpenseChart = ({
  data,
  title = 'Expense Trend',
  subtitle = 'Based on latest expense transactions',
}: ExpenseChartProps) => {
  const { preferences } = useUserPreferences()

  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>
        <p className="text-sm text-[var(--muted)]">{subtitle}</p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="expense-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e11d48" stopOpacity={0.24} />
                <stop offset="100%" stopColor="#e11d48" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <Tooltip
              formatter={(value) => [
                preferences.hideAmounts ? 'Hidden' : `INR ${Number(value).toLocaleString('en-IN')}`,
                'Amount',
              ]}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#e11d48"
              fill="url(#expense-fill)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default ExpenseChart
