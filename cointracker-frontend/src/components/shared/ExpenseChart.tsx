import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
  } from 'recharts'
  
  type ExpenseChartProps = {
    data: {
      month: string
      amount: number
    }[]
  }
  
  const ExpenseChart = ({ data }: ExpenseChartProps) => {
    return (
      <div className="rounded-4xl border border-white/50 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
  
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">
            Expense Analytics
          </h2>
  
          <p className="text-sm text-neutral-500">
            Monthly expense overview
          </p>
        </div>
  
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data || []}>
  
              <defs>
                <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
  
              <CartesianGrid vertical={false} stroke="#e5e7eb" />
  
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
  
              <Tooltip />
  
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#8b5cf6"
                fill="url(#expense)"
                strokeWidth={3}
              />
  
            </AreaChart>
          </ResponsiveContainer>
        </div>
  
      </div>
    )
  }
  
  export default ExpenseChart