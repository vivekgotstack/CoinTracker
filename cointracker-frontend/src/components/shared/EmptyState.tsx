import type { ReactNode } from 'react'

type EmptyStateProps = {
  icon: ReactNode
  title: string
  description: string
}

const EmptyState = ({ icon, title, description }: EmptyStateProps) => {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-[var(--foreground)]">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[var(--muted)]">{description}</p>
    </div>
  )
}

export default EmptyState
