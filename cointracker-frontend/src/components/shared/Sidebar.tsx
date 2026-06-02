import { NavLink } from 'react-router'
import {
  ChartLine,
  Landmark,
  LayoutDashboard,
  Settings,
  Tags,
  User,
  Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import BrandMark from '@/components/shared/BrandMark'

const items = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Expenses', path: '/expenses', icon: Wallet },
  { label: 'Income', path: '/income', icon: Landmark },
  { label: 'Analytics', path: '/analytics', icon: ChartLine },
  { label: 'Categories', path: '/categories', icon: Tags },
  { label: 'Profile', path: '/profile', icon: User },
  { label: 'Settings', path: '/settings', icon: Settings },
]

const Sidebar = () => {
  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-(--border) bg-(--surface) lg:block">
      <div className="border-b border-(--border) p-6">
        <BrandMark />
      </div>

      <nav className="flex flex-col gap-1 p-4">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition',
                  isActive
                    ? 'bg-(--primary) text-white shadow-sm'
                    : 'text-(--muted) hover:bg-(--surface-muted) hover:text-(--foreground)'
                )
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
