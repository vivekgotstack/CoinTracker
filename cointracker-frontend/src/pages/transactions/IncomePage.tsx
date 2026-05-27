import { getTransactions } from '@/services/TransactionService'
import { useQuery } from '@tanstack/react-query'

const IncomePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['transactions', 'INCOME'],
    queryFn: () => getTransactions({ type: 'INCOME' }),
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-semibold">Income</h1>

      {data?.content?.map((t: any) => (
        <div key={t.id}>
          {t.name} - {t.amount}
        </div>
      ))}
    </div>
  )
}

export default IncomePage