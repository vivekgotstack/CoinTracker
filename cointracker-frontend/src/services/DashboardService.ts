import type { DashboardResponse } from '@/types/dashboard'
import { api } from '../lib/api'

export const getDashboard = async (): Promise<DashboardResponse> => {
  const res = await api.get<DashboardResponse>('/api/dashboard')
  return res.data
}