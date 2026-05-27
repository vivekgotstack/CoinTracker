import type { Transaction, TransactionRequest } from '@/types/transaction'
import type { PageResponse } from '../types/pagination'
import { api } from '@/lib/api'

export type TransactionType = 'INCOME' | 'EXPENSE'

export type TransactionFilters = {
  page?: number
  size?: number
  type?: TransactionType
  categoryId?: number
  keyword?: string
  start?: string
  end?: string
  sort?: string
}

const TRANSACTIONS_ENDPOINT = '/api/transactions'

export const getTransactions = async (
  params: TransactionFilters,
  signal?: AbortSignal
): Promise<PageResponse<Transaction>> => {
  const response = await api.get<PageResponse<Transaction>>(
    TRANSACTIONS_ENDPOINT,
    {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
        type: params.type,
        categoryId: params.categoryId,
        keyword: params.keyword,
        start: params.start,
        end: params.end,
        sort: params.sort ?? 'date,desc',
      },
      signal,
    }
  )

  return response.data
}

export const createTransaction = async (
  payload: TransactionRequest
): Promise<Transaction> => {
  const response = await api.post<Transaction>(TRANSACTIONS_ENDPOINT, payload)
  return response.data
}

export const updateTransaction = async (
  id: number,
  payload: TransactionRequest
): Promise<Transaction> => {
  const response = await api.put<Transaction>(`${TRANSACTIONS_ENDPOINT}/${id}`, payload)
  return response.data
}

export const deleteTransaction = async (id: number): Promise<void> => {
  await api.delete(`${TRANSACTIONS_ENDPOINT}/${id}`)
}

export const getTransactionTotal = async (type: TransactionType): Promise<number> => {
  const response = await api.get<number>(`${TRANSACTIONS_ENDPOINT}/total`, {
    params: { type },
  })

  return response.data
}
