import { getDashboard } from '@/services/DashboardService'
import { useQuery } from '@tanstack/react-query'

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],

    queryFn: getDashboard,

    staleTime: 1000 * 60 * 3,

    refetchOnWindowFocus: false,
  })
}