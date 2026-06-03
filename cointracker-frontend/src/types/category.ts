export type Category = {
  id: number
  name: string
  type: 'INCOME' | 'EXPENSE'
  icon: string | null
  createdAt: string
  updatedAt: string
  transactionCount: number
}

export type CategoryType = Category['type']

export type CategoryRequest = {
  name: string
  type: CategoryType
  icon?: string | null
}
