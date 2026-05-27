import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '@/services/CategoryService'
import type { CategoryRequest, CategoryType } from '@/types/category'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const categoryKeys = {
  all: ['categories'] as const,
  list: (type?: CategoryType) => ['categories', type ?? 'ALL'] as const,
}

export const useCategories = (type?: CategoryType) => {
  return useQuery({
    queryKey: categoryKeys.list(type),
    queryFn: () => getCategories(type),
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CategoryRequest> }) =>
      updateCategory(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  })
}
