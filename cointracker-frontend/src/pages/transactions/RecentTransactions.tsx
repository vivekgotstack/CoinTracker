type Transaction = {
    id: number
    name: string
    amount: number
    date: string
    type: 'INCOME' | 'EXPENSE'
  }
  
  type Props = {
    data: Transaction[]
  }
  
  const RecentTransactions = ({ data }: Props) => {
    return (
      <div className="rounded-3xl bg-white/70 p-6 backdrop-blur-xl">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
  
        <div className="mt-6 space-y-4">
          {data.map((t) => (
            <div key={t.id} className="flex justify-between">
              <div>
                <p>{t.name}</p>
                <span className="text-xs text-neutral-500">{t.date}</span>
              </div>
  
              <span
                className={
                  t.type === 'INCOME'
                    ? 'text-emerald-600'
                    : 'text-rose-500'
                }
              >
                {t.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default RecentTransactions