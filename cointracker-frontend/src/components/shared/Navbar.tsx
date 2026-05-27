import { Button, Grid } from 'antd'
import { LogOut, Moon, Settings, Sun } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useMemo } from 'react'
import { clearSession } from '@/lib/auth-storage'
import { useTheme } from '@/contexts/ThemeContext'
import type { AuthUser } from '@/types/auth'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import BrandMark from '@/components/shared/BrandMark'
import { getPreferredDisplayName } from '@/lib/user-display'
import { consumeFirstLogin } from '@/lib/activation'

type NavbarProps = {
  user: AuthUser | null
}

const Navbar = ({ user }: NavbarProps) => {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const { preferences } = useUserPreferences()
  const screens = Grid.useBreakpoint()
  const displayName = getPreferredDisplayName(preferences.displayName, user?.email)
  const hasCustomName = preferences.displayName.trim().length > 0
  const isFirstLogin = useMemo(() => consumeFirstLogin(user?.email), [user?.email])
  const showFullLogout = screens.xxl === true
  const showCompactLogout = !showFullLogout

  const logout = () => {
    clearSession()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] backdrop-blur-xl">
      <div className="app-navbar min-h-24 gap-3 overflow-hidden px-3 py-3 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <BrandMark compact className="hidden sm:flex lg:hidden" />

          <div className="min-w-0 max-w-[42vw] rounded-3xl bg-[var(--hero)] px-3 py-3 shadow-sm sm:max-w-none sm:min-w-64 sm:px-5 xl:min-w-80">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
              {isFirstLogin || !hasCustomName ? 'Welcome to CoinTracker' : 'Welcome back'}
            </p>
            <div className="mt-2">
              <h2 className="brand-font truncate text-xl font-bold text-[var(--foreground)] sm:text-2xl">
                {displayName}
              </h2>
            </div>
          </div>
        </div>

        <div className="app-navbar-center">
          <span className="inline-flex rounded-full bg-[color-mix(in_srgb,var(--surface)_72%,transparent)] px-4 py-2 text-xs font-bold text-[var(--muted)] shadow-sm">
            Today feels trackable
          </span>
        </div>

        <div className="app-navbar-actions flex min-w-0 shrink-0 items-center justify-end gap-1.5 sm:gap-2">
          <Button
            aria-label="Toggle theme"
            icon={isDark ? <Sun size={16} /> : <Moon size={16} />}
            onClick={toggleTheme}
          />

          <button
            onClick={() => navigate('/profile')}
            className="group flex items-center gap-2 rounded-2xl bg-[var(--surface-muted)] px-2 py-1.5 shadow-inner transition hover:-translate-y-0.5 hover:shadow-lg"
            aria-label="Open profile"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface)] text-xl">
              {preferences.avatarEmoji}
            </span>
            <span className="hidden max-w-28 truncate pr-1 text-sm font-semibold text-[var(--foreground)] md:block">
              {displayName}
            </span>
          </button>

          <Button aria-label="Open settings" icon={<Settings size={16} />} onClick={() => navigate('/settings')} />

          {showCompactLogout ? <Button aria-label="Logout" icon={<LogOut size={16} />} onClick={logout} /> : null}

          {showFullLogout ? (
            <Button icon={<LogOut size={16} />} onClick={logout}>
              Logout
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Navbar
