type Transaction = {
    id: number
    name: string
    amount: number
    type: 'INCOME' | 'EXPENSE'
    date: string
    icon?: string
  }
  
  type Props = {
    data: Transaction[]
  }
  
  const RecentTransactions = ({ data }: Props) => {
    return (
      <div className="rounded-4xl border border-white/50 bg-white/75 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
  
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">
            Recent Transactions
          </h2>
  
          <p className="text-sm text-neutral-500">
            Latest activity
          </p>
        </div>
  
        <div className="space-y-3">
  
          {data?.length ? (
            data.map((tx) => {
              const isIncome = tx.type === 'INCOME'
  
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between rounded-2xl border border-neutral-100 bg-white/60 p-4"
                >
  
                  <div>
                    <p className="font-medium text-neutral-900">
                      {tx.name}
                    </p>
  
                    <p className="text-sm text-neutral-500">
                      {tx.date}
                    </p>
                  </div>
  
                  <span
                    className={
                      isIncome
                        ? 'font-semibold text-emerald-600'
                        : 'font-semibold text-rose-500'
                    }
                  >
                    {isIncome ? '+' : '-'}₹{tx.amount}
                  </span>
  
                </div>
              )
            })
          ) : (
            <p className="text-sm text-neutral-500">
              No transactions yet
            </p>
          )}
  
        </div>
  
      </div>
    )
  }
  
  export default RecentTransactions