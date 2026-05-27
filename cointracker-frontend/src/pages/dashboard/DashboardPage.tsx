import {
    DollarSign,
    TrendingDown,
    TrendingUp,
  } from 'lucide-react'
  
  import ExpenseChart from '../../components/shared/ExpenseChart'
  import RecentTransactions from '../../components/shared/RecentTransactions'
import { useDashboard } from '@/hooks/UseDashboard'
import StatCard from '@/components/shared/StatCard'
  
  const DashboardPage = () => {
    const { data, isLoading } = useDashboard()
  
    if (isLoading) {
      return (
        <div className="flex h-[60vh] items-center justify-center text-neutral-500">
          Loading dashboard...
        </div>
      )
    }
  
    const summary = data?.summary
    const chart = data?.monthlyExpenses ?? []
    const recent = data?.recentTransactions ?? []
  
    return (
      <main className="space-y-6">
  
        {/* Header */}
        <section>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
            Financial Overview
          </h1>
  
          <p className="mt-2 text-neutral-500">
            Real-time snapshot of your financial activity
          </p>
        </section>
  
        {/* Stats */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard
            title="Total Balance"
            amount={`₹${summary?.totalBalance ?? 0}`}
            trend="+ real-time"
            trendType="positive"
            icon={<DollarSign size={22} />}
          />
  
          <StatCard
            title="Total Expenses"
            amount={`₹${summary?.totalExpense ?? 0}`}
            trend="tracked from transactions"
            trendType="negative"
            icon={<TrendingDown size={22} />}
          />
  
          <StatCard
            title="Total Income"
            amount={`₹${summary?.totalIncome ?? 0}`}
            trend="live calculation"
            trendType="positive"
            icon={<TrendingUp size={22} />}
          />
        </section>
  
        {/* Charts + Recent */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
  
          <ExpenseChart data={chart} />
  
          <RecentTransactions data={recent} />
  
        </section>
  
      </main>
    )
  }
  
  export default DashboardPage