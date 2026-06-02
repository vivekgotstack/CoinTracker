import type { DashboardResponse } from '@/types/dashboard'
import { api } from '../lib/api'

export const getDashboard = async (signal?: AbortSignal): Promise<DashboardResponse> => {
  const res = await api.get<DashboardResponse>('/api/dashboard', { signal })
  return res.data
}
