import { Button, Descriptions, Form, Input, Tag, message } from 'antd'
import { Bell, Edit3, EyeOff, Mail, Palette, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import EmojiField from '@/components/ui/EmojiField'
import { useAuth } from '@/hooks/UseAuth'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { DISPLAY_NAME_MAX_LENGTH, getPreferredDisplayName } from '@/lib/user-display'
import { getProfile, updateProfile } from '@/lib/profile-api'
import { updateSessionUser } from '@/lib/auth-storage'
import { queryClient } from '@/lib/query-client'
import { getApiErrorMessage } from '@/lib/errors'

type ProfileForm = {
  displayName: string
  profileImageUrl: string
}

const ProfilePage = () => {
  const [form] = Form.useForm<ProfileForm>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { preferences, updatePreferences } = useUserPreferences()
  const [isEditingName, setIsEditingName] = useState(false)
  const profile = useQuery({ queryKey: ['profile'], queryFn: getProfile })
  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (savedProfile) => {
      queryClient.setQueryData(['profile'], savedProfile)
      updateSessionUser({
        fullName: savedProfile.fullName,
        profileImageUrl: savedProfile.profileImageUrl ?? undefined,
      })
      message.success('Profile updated')
      setIsEditingName(false)
    },
    onError: (error) => {
      message.error(getApiErrorMessage(error, 'Unable to update profile'))
    },
  })

  const displayName = getPreferredDisplayName(
    preferences.displayName || profile.data?.fullName || user?.fullName || '',
    user?.email
  ).slice(0, DISPLAY_NAME_MAX_LENGTH)
  const profileImageUrl = profile.data?.profileImageUrl ?? user?.profileImageUrl

  const handleSaveName = (values: ProfileForm) => {
    const cleanedDisplayName = values.displayName.trim().slice(0, DISPLAY_NAME_MAX_LENGTH)

    profileMutation.mutate({
      fullName: cleanedDisplayName,
      profileImageUrl: values.profileImageUrl?.trim() || null,
    })

    updatePreferences({ displayName: '' })
    form.setFieldsValue({
      displayName: cleanedDisplayName,
      profileImageUrl: values.profileImageUrl?.trim() ?? '',
    })
  }

  return (
    <div className="space-y-9">
      <section>
        <h1 className="brand-font text-3xl font-bold text-(--foreground)">Profile</h1>
        <p className="mt-2 text-sm text-(--muted)">
          Make CoinTracker feel like your own.
        </p>
      </section>

      <section className="overflow-hidden rounded-3xl bg-(--hero) p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-4xl bg-(--surface) text-6xl shadow-xl">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              preferences.avatarEmoji
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-(--primary)">Personal profile</p>
            <h2 className="brand-font mt-1 truncate text-4xl font-extrabold text-(--foreground)">
              {displayName}
            </h2>
            <p className="mt-2 truncate text-sm text-(--muted)">{user?.email}</p>
          </div>

          <div className="w-full sm:w-56">
            <EmojiField
              value={preferences.avatarEmoji}
              fallback={'\u{1F642}'}
              onChange={(avatarEmoji) =>
                updatePreferences({
                  avatarEmoji: avatarEmoji ?? '\u{1F642}',
                })
              }
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel rounded-3xl p-5 sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <Edit3 className="text-(--primary)" size={20} />
            <div>
              <h3 className="text-lg font-semibold text-(--foreground)">Display Name</h3>
              <p className="text-sm text-(--muted)">
                Choose the name shown in your header and profile.
              </p>
            </div>
          </div>

          {isEditingName ? (
            <Form<ProfileForm>
              form={form}
              layout="vertical"
              initialValues={{ displayName, profileImageUrl: profileImageUrl ?? '' }}
              onFinish={handleSaveName}
              requiredMark={false}
            >
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto]">
                <Form.Item
                  name="displayName"
                  className="mb-0"
                  rules={[
                    { required: true, message: 'Display name is required' },
                    {
                      max: DISPLAY_NAME_MAX_LENGTH,
                      message: `Keep it under ${DISPLAY_NAME_MAX_LENGTH} characters`,
                    },
                  ]}
                >
                  <Input
                    maxLength={DISPLAY_NAME_MAX_LENGTH}
                    showCount
                    placeholder="Your name"
                  />
                </Form.Item>

                <Form.Item
                  name="profileImageUrl"
                  className="mb-0"
                  rules={[{ type: 'url', message: 'Enter a valid image URL' }]}
                >
                  <Input placeholder="Profile image URL" />
                </Form.Item>

                <Button type="primary" htmlType="submit" loading={profileMutation.isPending}>
                  Save
                </Button>

                <Button onClick={() => setIsEditingName(false)}>
                  Cancel
                </Button>
              </div>
            </Form>
          ) : (
            <div className="flex flex-col gap-3 rounded-2xl bg-(--surface-muted) p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-(--muted)">
                  Current name
                </p>
                <p className="brand-font text-lg font-bold text-(--foreground)">
                  {displayName}
                </p>
              </div>

              <Button
                icon={<Edit3 size={15} />}
                onClick={() => {
                  form.setFieldsValue({ displayName, profileImageUrl: profileImageUrl ?? '' })
                  setIsEditingName(true)
                }}
              >
                Edit
              </Button>
            </div>
          )}

          <div className="mt-6">
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Email">
                {user?.email ?? 'Unknown'}
              </Descriptions.Item>

              <Descriptions.Item label="Role">
                <Tag icon={<ShieldCheck size={14} />} color="blue">
                  {user?.role ?? 'USER'}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Profile icon">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="" className="h-10 w-10 rounded-xl object-cover" />
                ) : (
                  <span className="text-xl">{preferences.avatarEmoji}</span>
                )}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-panel rounded-3xl p-5">
            <div className="flex items-start gap-3">
              <EyeOff className="mt-1 text-(--primary)" size={20} />
              <div>
                <h3 className="font-semibold text-(--foreground)">Privacy Mode</h3>
                <p className="text-sm text-(--muted)">
                  {preferences.hideAmounts
                    ? 'Amounts are hidden across your money views.'
                    : 'Amounts are visible across your money views.'}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-5">
            <div className="flex items-start gap-3">
              <Mail className="mt-1 text-(--primary)" size={20} />
              <div>
                <h3 className="font-semibold text-(--foreground)">Newsletter</h3>
                <p className="text-sm text-(--muted)">
                  {preferences.newsletterSubscribed
                    ? 'Subscribed to money notes.'
                    : 'Newsletter is paused.'}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-5">
            <div className="flex items-start gap-3">
              <Bell className="mt-1 text-(--primary)" size={20} />
              <div>
                <h3 className="font-semibold text-(--foreground)">Digest</h3>
                <p className="text-sm text-(--muted)">
                  {preferences.digestEnabled
                    ? `${preferences.digestFrequency.charAt(0).toUpperCase()}${preferences.digestFrequency.slice(
                        1
                      )} reminders are on.`
                    : 'Digest reminders are off.'}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-5">
            <div className="flex items-start gap-3">
              <Palette className="mt-1 text-(--primary)" size={20} />
              <div className="flex-1">
                <h3 className="font-semibold text-(--foreground)">Personalize</h3>
                <p className="text-sm text-(--muted)">
                  Tune the app mood, privacy, and updates.
                </p>

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
