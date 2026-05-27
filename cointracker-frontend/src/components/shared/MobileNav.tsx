import { NavLink } from 'react-router'
import { ChartLine, Landmark, LayoutDashboard, Tags, Wallet } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { label: 'Home', path: '/', icon: LayoutDashboard },
  { label: 'Expense', path: '/expenses', icon: Wallet },
  { label: 'Income', path: '/income', icon: Landmark },
  { label: 'Stats', path: '/analytics', icon: ChartLine },
  { label: 'Tags', path: '/categories', icon: Tags },
]

const MobileNav = () => {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-5 rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] p-2 shadow-2xl backdrop-blur-xl lg:hidden">
      {items.map((item) => {
        const Icon = item.icon

        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                'flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] font-semibold transition',
                isActive
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-[var(--muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]'
              )
            }
          >
            <Icon size={17} />
            <span className="truncate">{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}

export default MobileNav
