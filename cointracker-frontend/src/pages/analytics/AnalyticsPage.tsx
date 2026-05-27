import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

type DashboardResponse = {
  totalIncome: number
  totalExpense: number
  balance: number
  monthlyExpense: { month: string; expense: number }[]
}

const fetchDashboard = async (): Promise<DashboardResponse> => {
  const res = await api.get('/api/dashboard')
  return res.data
}

const AnalyticsPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Analytics</h1>

      <div className="grid grid-cols-3 gap-4">
        <div>Total Income: {data?.totalIncome}</div>
        <div>Total Expense: {data?.totalExpense}</div>
        <div>Balance: {data?.balance}</div>
      </div>

      <div>
        {/* later hook ExpenseChart here */}
      </div>
    </div>
  )
}

export default AnalyticsPage