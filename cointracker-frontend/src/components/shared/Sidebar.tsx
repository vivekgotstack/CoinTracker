import { NavLink } from 'react-router'
import {
    LayoutDashboard,
    Wallet,
    Landmark,
    Tags,
    User,
    Settings,
    ChartLine,
} from 'lucide-react'

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
        <aside className="fixed left-0 top-0 h-screen w-72 border-r border-white/50 bg-white/60 backdrop-blur-2xl">

            <div className="p-6">

                <h1 className="text-2xl font-semibold text-neutral-900">
                    CoinTracker
                </h1>

                <p className="text-sm text-neutral-500">
                    Finance dashboard
                </p>

            </div>

            <nav className="mt-6 flex flex-col gap-2 px-4">

                {items.map((item) => {
                    const Icon = item.icon

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                                    isActive
                                        ? 'bg-neutral-900 text-white'
                                        : 'text-neutral-600 hover:bg-white hover:text-neutral-900'
                                }`
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