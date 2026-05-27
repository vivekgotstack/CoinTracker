import { Button, Form, Input, Segmented, Select, Switch, message } from 'antd'
import { Bell, EyeOff, Mail, Moon, ShieldCheck, Sun, Table2 } from 'lucide-react'
import { forgotPassword } from '@/lib/auth-api'
import { getApiErrorMessage } from '@/lib/errors'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/hooks/UseAuth'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { useResetCooldown } from '@/hooks/UseResetCooldown'

type SecurityForm = {
  email: string
}

const SettingsPage = () => {
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const { preferences, updatePreferences } = useUserPreferences()
  const resetCooldown = useResetCooldown()

  const handlePasswordReset = async (values: SecurityForm) => {
    if (resetCooldown.disabled) {
      message.info(resetCooldown.label)
      return
    }

    try {
      const response = await forgotPassword(values.email)
      resetCooldown.start()
      message.success(response)
    } catch (error) {
      message.error(getApiErrorMessage(error, 'Unable to send reset email'))
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="brand-font text-3xl font-bold text-[var(--foreground)]">Settings</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Shape CoinTracker around the way you like to review money.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="glass-panel rounded-3xl p-5">
          <div className="flex items-start gap-3">
            <Sun className="mt-1 text-[var(--primary)]" size={20} />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Theme Mood</h2>
              <p className="text-sm text-[var(--muted)]">Switch the entire app palette, surfaces, and charts.</p>
              <Segmented
                className="mt-5"
                value={theme}
                onChange={(value) => setTheme(value as 'light' | 'dark')}
                options={[
                  {
                    label: (
                      <span className="inline-flex items-center gap-2">
                        <Sun size={14} />
                        Garden Light
                      </span>
                    ),
                    value: 'light',
                  },
                  {
                    label: (
                      <span className="inline-flex items-center gap-2">
                        <Moon size={14} />
                        Deep Night
                      </span>
                    ),
                    value: 'dark',
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-5">
          <div className="flex items-start gap-3">
            <EyeOff className="mt-1 text-[var(--primary)]" size={20} />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Privacy Mode</h2>
              <p className="text-sm text-[var(--muted)]">Hide balances and transaction amounts when you are in public.</p>
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-[var(--surface-muted)] p-4">
                <span className="text-sm font-medium text-[var(--foreground)]">Hide amounts</span>
                <Switch
                  checked={preferences.hideAmounts}
                  onChange={(hideAmounts) => updatePreferences({ hideAmounts })}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="glass-panel rounded-3xl p-5">
          <div className="flex items-start gap-3">
            <Table2 className="mt-1 text-[var(--primary)]" size={20} />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Compact Tables</h2>
              <p className="text-sm text-[var(--muted)]">
                Tighten transaction and category rows so mobile screens feel cleaner.
              </p>
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-[var(--surface-muted)] p-4">
                <span className="text-sm font-medium text-[var(--foreground)]">Use compact rows</span>
                <Switch
                  checked={preferences.compactTables}
                  onChange={(compactTables) => updatePreferences({ compactTables })}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="glass-panel rounded-3xl p-5">
          <div className="flex items-start gap-3">
            <Mail className="mt-1 text-[var(--primary)]" size={20} />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Newsletter</h2>
              <p className="text-sm text-[var(--muted)]">
                Receive helpful money tips, product updates, and calm finance summaries.
              </p>
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-[var(--surface-muted)] p-4">
                  <span className="text-sm font-medium text-[var(--foreground)]">Subscribe to newsletter</span>
                  <Switch
                    checked={preferences.newsletterSubscribed}
                    onChange={(newsletterSubscribed) => updatePreferences({ newsletterSubscribed })}
                  />
                </div>
                <Select
                  className="w-full"
                  value={preferences.digestFrequency}
                  onChange={(digestFrequency) => updatePreferences({ digestFrequency })}
                  options={[
                    { label: 'Daily digest', value: 'daily' },
                    { label: 'Weekly digest', value: 'weekly' },
                    { label: 'Monthly digest', value: 'monthly' },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-5">
          <div className="flex items-start gap-3">
            <Bell className="mt-1 text-[var(--primary)]" size={20} />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Digest Reminders</h2>
              <p className="text-sm text-[var(--muted)]">
                Choose whether CoinTracker should remind you to review your spending rhythm.
              </p>
              <div className="mt-5 flex items-center justify-between rounded-2xl bg-[var(--surface-muted)] p-4">
                <span className="text-sm font-medium text-[var(--foreground)]">Enable finance digest</span>
                <Switch
                  checked={preferences.digestEnabled}
                  onChange={(digestEnabled) => updatePreferences({ digestEnabled })}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 text-[var(--primary)]" size={20} />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Security</h2>
            <p className="text-sm text-[var(--muted)]">
              Send yourself a password reset email whenever you need a fresh start.
            </p>

            <Form<SecurityForm>
              className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]"
              initialValues={{ email: user?.email ?? '' }}
              onFinish={handlePasswordReset}
            >
              <Form.Item
                name="email"
                className="mb-0"
                rules={[
                  { required: true, message: 'Email is required' },
                  { type: 'email', message: 'Enter a valid email' },
                ]}
              >
                <Input placeholder="Email address" />
              </Form.Item>
              <Button type="primary" htmlType="submit" disabled={resetCooldown.disabled}>
                {resetCooldown.label}
              </Button>
            </Form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SettingsPage
