import type { Transaction } from '@/types/transaction'
import { formatCurrency, formatDate } from '@/lib/format'
import { renderEntityIcon } from '@/lib/icons'
import { useMemo, useState } from 'react'
import { Pagination } from 'antd'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'

type Props = {
  data: Transaction[]
  title?: string
  subtitle?: string
}

const RecentTransactions = ({
  data,
  title = 'Recent Transactions',
  subtitle = 'Your newest money moves',
}: Props) => {
  const [page, setPage] = useState(1)
  const { preferences } = useUserPreferences()
  const pageSize = 5
  const paginatedData = useMemo(
    () => data.slice((page - 1) * pageSize, page * pageSize),
    [data, page]
  )

  return (
    <section className="glass-panel rounded-2xl p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-neutral-950 dark:text-white">{title}</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>
      </div>

      <div className="space-y-2">
        {data.length ? (
          paginatedData.map((transaction) => {
            const isIncome = transaction.type === 'INCOME'

            return (
              <div
                key={transaction.id}
                className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-3 sm:gap-4 sm:px-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface)] text-xl shadow-sm">
                    {renderEntityIcon(transaction.icon, isIncome ? '💸' : '🧾')}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[var(--foreground)]">{transaction.name}</p>
                    <p className="text-sm text-[var(--muted)]">{formatDate(transaction.date)}</p>
                  </div>
                </div>

                <span className={(isIncome ? 'font-semibold text-emerald-700' : 'font-semibold text-rose-700') + ' shrink-0 text-sm'}>
                  {preferences.hideAmounts ? 'Hidden' : `${isIncome ? '+' : '-'}${formatCurrency(transaction.amount)}`}
                </span>
              </div>
            )
          })
        ) : (
          <p className="rounded-lg border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
            No transactions yet
          </p>
        )}
      </div>

      {data.length > pageSize ? (
        <div className="mt-4 flex justify-end">
          <Pagination
            size="small"
            current={page}
            total={data.length}
            pageSize={pageSize}
            onChange={setPage}
          />
        </div>
      ) : null}
    </section>
  )
}

export default RecentTransactions
