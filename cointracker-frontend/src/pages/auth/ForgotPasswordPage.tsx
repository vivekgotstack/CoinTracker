import { Button, Form, Input, message } from 'antd'
import { Link } from 'react-router'
import { Mail } from 'lucide-react'
import { forgotPassword } from '@/lib/auth-api'
import { getApiErrorMessage } from '@/lib/errors'
import { useResetCooldown } from '@/hooks/UseResetCooldown'
import BrandMark from '@/components/shared/BrandMark'

type ForgotPasswordForm = {
  email: string
}

const ForgotPasswordPage = () => {
  const resetCooldown = useResetCooldown()

  const handleSubmit = async (values: ForgotPasswordForm) => {
    if (resetCooldown.disabled) {
      message.info(resetCooldown.label)
      return
    }

    try {
      const response = await forgotPassword(values.email)
      resetCooldown.start()
      message.success(response)
    } catch (error) {
      message.error(getApiErrorMessage(error, 'Unable to send reset link'))
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4 py-8">
      <section className="glass-panel rounded-3xl p-8" style={{ width: 'min(calc(100vw - 32px), 600px)' }}>
        <BrandMark />
        <h1 className="mt-2 text-3xl font-semibold text-neutral-950 dark:text-white">Reset access</h1>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          Enter your email and we will send a reset link.
        </p>

        <Form<ForgotPasswordForm> layout="vertical" className="mt-6" onFinish={handleSubmit} requiredMark={false}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input prefix={<Mail size={16} />} placeholder="you@example.com" size="large" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large" disabled={resetCooldown.disabled}>
            {resetCooldown.label}
          </Button>
        </Form>

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

export default ForgotPasswordPage
