import { Button, Descriptions, Form, Input, Tag, message } from 'antd'
import { Bell, Edit3, EyeOff, Mail, Palette, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import EmojiField from '@/components/ui/EmojiField'
import { useAuth } from '@/hooks/UseAuth'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { getPreferredDisplayName } from '@/lib/user-display'

type ProfileForm = {
  displayName: string
}

const ProfilePage = () => {
  const [form] = Form.useForm<ProfileForm>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { preferences, updatePreferences } = useUserPreferences()
  const displayName = getPreferredDisplayName(preferences.displayName, user?.email).slice(0, 10)
  const [isEditingName, setIsEditingName] = useState(false)

  const handleSaveName = (values: ProfileForm) => {
    updatePreferences({ displayName: values.displayName.trim().slice(0, 10) })
    setIsEditingName(false)
    message.success('Display name updated')
  }

  return (
    <div className="space-y-9">
      <section>
        <h1 className="brand-font text-3xl font-bold text-[var(--foreground)]">Profile</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Make CoinTracker feel like your own.
        </p>
      </section>

      <section className="overflow-hidden rounded-3xl bg-[var(--hero)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-[var(--surface)] text-6xl shadow-xl">
            {preferences.avatarEmoji}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--primary)]">Personal profile</p>
            <h2 className="brand-font mt-1 truncate text-4xl font-extrabold text-[var(--foreground)]">
              {displayName}
            </h2>
            <p className="mt-2 truncate text-sm text-[var(--muted)]">{user?.email}</p>
          </div>

          <div className="w-full sm:w-56">
            <EmojiField
              value={preferences.avatarEmoji}
              fallback={'\u{1F642}'}
              onChange={(avatarEmoji) => updatePreferences({ avatarEmoji: avatarEmoji ?? '\u{1F642}' })}
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel rounded-3xl p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <Edit3 className="text-[var(--primary)]" size={20} />
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Display Name</h3>
              <p className="text-sm text-[var(--muted)]">Choose the name shown in your header and profile.</p>
            </div>
          </div>

          {isEditingName ? (
            <Form<ProfileForm>
              form={form}
              layout="vertical"
              initialValues={{ displayName }}
              onFinish={handleSaveName}
              requiredMark={false}
            >
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                <Form.Item
                  name="displayName"
                  className="mb-0"
                  rules={[
                    { required: true, message: 'Display name is required' },
                    { max: 10, message: 'Keep it under 10 characters' },
                  ]}
                >
                  <Input maxLength={10} placeholder="Your name" />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
                <Button onClick={() => setIsEditingName(false)}>Cancel</Button>
              </div>
            </Form>
          ) : (
            <div className="flex flex-col gap-3 rounded-2xl bg-[var(--surface-muted)] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Current name</p>
                <p className="brand-font text-lg font-bold text-[var(--foreground)]">{displayName}</p>
              </div>
              <Button
                icon={<Edit3 size={15} />}
                onClick={() => {
                  form.setFieldsValue({ displayName })
                  setIsEditingName(true)
                }}
              >
                Edit
              </Button>
            </div>
          )}

          <div className="mt-6">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Email">{user?.email ?? 'Unknown'}</Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag icon={<ShieldCheck size={14} />} color="blue">
                  {user?.role ?? 'USER'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Profile icon">
                <span className="text-xl">{preferences.avatarEmoji}</span>
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-panel rounded-3xl p-5">
            <div className="flex items-start gap-3">
              <EyeOff className="mt-1 text-[var(--primary)]" size={20} />
              <div>
                <h3 className="font-semibold text-[var(--foreground)]">Privacy Mode</h3>
                <p className="text-sm text-[var(--muted)]">
                  {preferences.hideAmounts ? 'Amounts are hidden across your money views.' : 'Amounts are visible across your money views.'}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-5">
            <div className="flex items-start gap-3">
              <Mail className="mt-1 text-[var(--primary)]" size={20} />
              <div>
                <h3 className="font-semibold text-[var(--foreground)]">Newsletter</h3>
                <p className="text-sm text-[var(--muted)]">
                  {preferences.newsletterSubscribed ? 'Subscribed to money notes.' : 'Newsletter is paused.'}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-5">
            <div className="flex items-start gap-3">
              <Bell className="mt-1 text-[var(--primary)]" size={20} />
              <div>
                <h3 className="font-semibold text-[var(--foreground)]">Digest</h3>
                <p className="text-sm text-[var(--muted)]">
                  {preferences.digestEnabled
                    ? `${preferences.digestFrequency.charAt(0).toUpperCase() + preferences.digestFrequency.slice(1)} reminders are on.`
                    : 'Digest reminders are off.'}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-5">
            <div className="flex items-start gap-3">
              <Palette className="mt-1 text-[var(--primary)]" size={20} />
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--foreground)]">Personalize</h3>
                <p className="text-sm text-[var(--muted)]">Tune the app mood, privacy, and updates.</p>
                <Button className="mt-4" onClick={() => navigate('/settings')}>
                  Open settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProfilePage
