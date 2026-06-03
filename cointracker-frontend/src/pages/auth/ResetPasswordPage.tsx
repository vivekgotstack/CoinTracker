import { useState } from 'react'
import { Button, Form, Input, message } from 'antd'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { CheckCircle2, LockKeyhole, ShieldCheck } from 'lucide-react'
import { resetPassword } from '@/lib/auth-api'
import { getApiErrorMessage } from '@/lib/errors'
import BrandMark from '@/components/shared/BrandMark'

type ResetPasswordForm = {
  newPassword: string
  confirmPassword: string
}

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [form] = Form.useForm<ResetPasswordForm>()
  const [isSaving, setIsSaving] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const token = params.get('token') ?? ''

  const handleSubmit = async (values: ResetPasswordForm) => {
    try {
      setIsSaving(true)
      const response = await resetPassword(token, values.newPassword)
      message.success(response)
      form.resetFields()
      setIsReset(true)
    } catch (error) {
      message.error(getApiErrorMessage(error, 'Unable to reset password'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4 py-8">
      <section className="glass-panel rounded-3xl p-8" style={{ width: 'min(calc(100vw - 32px), 600px)' }}>
        <BrandMark />

        {isReset ? (
          <div className="mt-7 rounded-3xl border border-(--border) bg-(--surface-muted) p-6 text-center">
            <CheckCircle2 className="mx-auto text-teal-600 dark:text-teal-300" size={44} />
            <h1 className="brand-font mt-4 text-3xl font-bold text-(--foreground)">Password changed</h1>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-(--muted)">
              Your old reset link has been closed. Sign in with your new password to continue.
            </p>
            <Button type="primary" size="large" className="mt-6" onClick={() => navigate('/login')}>
              Continue to sign in
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-7 rounded-3xl border border-(--border) bg-(--surface-muted) p-5">
              <div className="flex gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-teal-700 dark:bg-(--surface) dark:text-teal-300">
                  <ShieldCheck size={22} />
                </span>
                <div>
                  <h1 className="brand-font text-3xl font-bold text-(--foreground)">Create a new password</h1>
                  <p className="mt-2 text-sm leading-6 text-(--muted)">
                    Choose a password you have not used here before. This link works once and then expires.
                  </p>
                </div>
              </div>
            </div>

            <Form<ResetPasswordForm>
              form={form}
              layout="vertical"
              className="mt-6"
              onFinish={handleSubmit}
              requiredMark={false}
            >
              <Form.Item
                label="New password"
                name="newPassword"
                rules={[
                  { required: true, message: 'New password is required' },
                  { min: 6, message: 'Use at least 6 characters' },
                ]}
              >
                <Input.Password prefix={<LockKeyhole size={16} />} placeholder="New password" size="large" />
              </Form.Item>

              <Form.Item
                label="Confirm password"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve()
                      }

                      return Promise.reject(new Error('Passwords do not match'))
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockKeyhole size={16} />} placeholder="Confirm password" size="large" />
              </Form.Item>

              {!token ? (
                <p className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
                  Reset token is missing. Open the reset link from your email.
                </p>
              ) : null}

              <Button type="primary" htmlType="submit" block size="large" disabled={!token} loading={isSaving}>
                Change password
              </Button>
            </Form>
          </>
        )}

        <Link
          to="/login"
          className="mt-5 block rounded-2xl bg-(--surface-muted) px-4 py-3 text-center text-sm font-medium text-teal-700 transition hover:-translate-y-0.5 hover:shadow-md dark:text-teal-300"
        >
          Back to sign in
        </Link>
      </section>
    </main>
  )
}

export default ResetPasswordPage
