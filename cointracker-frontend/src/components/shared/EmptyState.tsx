import type { ReactNode } from 'react'

type EmptyStateProps = {
  icon: ReactNode
  title: string
  description: string
}

const EmptyState = ({ icon, title, description }: EmptyStateProps) => {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-(--border) bg-(--surface) p-8 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-(--surface-muted) text-(--foreground)">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-(--foreground)">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-(--muted)">{description}</p>
    </div>
  )
}

export default EmptyState
