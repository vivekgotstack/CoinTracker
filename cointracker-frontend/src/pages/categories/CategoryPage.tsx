import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useState } from 'react'

type Category = {
  id: number
  name: string
  type: 'INCOME' | 'EXPENSE'
}

const fetchCategories = async (): Promise<Category[]> => {
  const res = await api.get('/api/categories')
  return res.data
}

const CategoryPage = () => {
  const qc = useQueryClient()
  const [name, setName] = useState('')

  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  })

  const createMutation = useMutation({
    mutationFn: (payload: { name: string }) =>
      api.post('/api/categories', payload),

    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Categories</h1>

      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
        />

        <button
          onClick={() =>
            createMutation.mutate({ name })
          }
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {data?.map((c) => (
          <div key={c.id} className="border p-2">
            {c.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryPage