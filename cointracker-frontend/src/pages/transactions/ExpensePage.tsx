import { getTransactions } from '@/services/TransactionService'
import { useQuery } from '@tanstack/react-query'

const ExpensePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['transactions', 'EXPENSE'],
    queryFn: () => getTransactions({ type: 'EXPENSE' }),
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-semibold">Expenses</h1>

      {data?.content?.map((t: any) => (
        <div key={t.id}>
          {t.name} - {t.amount}
        </div>
      ))}
    </div>
  )
}

export default ExpensePage