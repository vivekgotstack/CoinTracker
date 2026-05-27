import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from '@/services/TransactionService'
import type { TransactionRequest } from '@/types/transaction'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const invalidateMoneyData = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ['transactions'] })
  queryClient.invalidateQueries({ queryKey: ['dashboard'] })
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => invalidateMoneyData(queryClient),
  })
}

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: TransactionRequest }) =>
      updateTransaction(id, payload),
    onSuccess: () => invalidateMoneyData(queryClient),
  })
}

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => invalidateMoneyData(queryClient),
  })
}
