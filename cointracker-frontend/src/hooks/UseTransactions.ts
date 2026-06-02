import { type TransactionFilters, getTransactions } from '@/services/TransactionService'
import { useQuery } from '@tanstack/react-query'


const stableizeFilters = (filters: TransactionFilters) => ({
  page: filters.page ?? 0,
  size: filters.size ?? 10,
  type: filters.type,
  categoryId: filters.categoryId,
  keyword: filters.keyword,
  start: filters.start,
  end: filters.end,
  sort: filters.sort ?? 'date,desc',
})

export const useTransactions = (filters: TransactionFilters) => {
  const normalizedFilters = stableizeFilters(filters)

  return useQuery({
    queryKey: ['transactions', normalizedFilters],

    queryFn: ({ signal }) => getTransactions(normalizedFilters, signal),

    staleTime: 1000 * 60 * 5,

    placeholderData: (prev) => prev,

    refetchOnWindowFocus: false,
  })
}
