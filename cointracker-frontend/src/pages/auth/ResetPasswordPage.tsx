import { Button, Form, Input, message } from 'antd'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { LockKeyhole } from 'lucide-react'
import { resetPassword } from '@/lib/auth-api'
import { getApiErrorMessage } from '@/lib/errors'
import BrandMark from '@/components/shared/BrandMark'

type ResetPasswordForm = {
  newPassword: string
}

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''

  const handleSubmit = async (values: ResetPasswordForm) => {
    try {
      const response = await resetPassword(token, values.newPassword)
      message.success(response)
      navigate('/login')
    } catch (error) {
      message.error(getApiErrorMessage(error, 'Unable to reset password'))
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4 py-8">
      <section className="glass-panel rounded-3xl p-8" style={{ width: 'min(calc(100vw - 32px), 600px)' }}>
        <BrandMark />
        <h1 className="mt-2 text-3xl font-semibold text-neutral-950 dark:text-white">New password</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Set a new password using the token from your email.
        </p>

        <Form<ResetPasswordForm> layout="vertical" className="mt-6" onFinish={handleSubmit} requiredMark={false}>
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

          <Button type="primary" htmlType="submit" block size="large" disabled={!token}>
            Reset password
          </Button>
        </Form>

        {!token ? (
          <p className="mt-4 text-sm text-rose-600">Reset token is missing from the URL.</p>
        ) : null}

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
