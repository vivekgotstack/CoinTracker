import { api } from '@/lib/api'
import type { Category, CategoryRequest, CategoryType } from '@/types/category'

const CATEGORIES_ENDPOINT = '/api/categories'

export const getCategories = async (type?: CategoryType): Promise<Category[]> => {
  const response = await api.get<Category[]>(CATEGORIES_ENDPOINT, {
    params: { type },
  })

  return response.data
}

export const createCategory = async (payload: CategoryRequest): Promise<Category> => {
  const response = await api.post<Category>(CATEGORIES_ENDPOINT, payload)
  return response.data
}

export const updateCategory = async (
  id: number,
  payload: Partial<CategoryRequest>
): Promise<Category> => {
  const response = await api.put<Category>(`${CATEGORIES_ENDPOINT}/${id}`, payload)
  return response.data
}

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`${CATEGORIES_ENDPOINT}/${id}`)
}
