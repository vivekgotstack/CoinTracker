export type TransactionType = 'INCOME' | 'EXPENSE'

export type Transaction = {
  id: number
  name: string
  icon: string | null
  amount: number
  date: string
  type: TransactionType
  categoryId: number
  createdAt: string
  updatedAt: string
}

export type TransactionRequest = {
  name: string
  icon?: string | null
  amount: number
  date?: string
  type: TransactionType
  categoryId: number
}
