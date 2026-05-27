import type { Transaction } from './transaction'

export type DashboardResponse = {
  totalIncome: number
  totalExpense: number
  totalBalance: number

  recentTransactions: Transaction[]
  recentExpenses: Transaction[]
  recentIncomes: Transaction[]
}
