import { Button, Form, Input, message } from 'antd'
import { Link } from 'react-router'
import { Mail } from 'lucide-react'
import { forgotPassword } from '@/lib/auth-api'
import { getApiErrorMessage } from '@/lib/errors'
import { useResetCooldown } from '@/hooks/UseResetCooldown'

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
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4">
      <section className="glass-panel w-full max-w-md rounded-3xl p-8">
        <h1 className="text-3xl font-semibold text-neutral-950 dark:text-white">Reset access</h1>
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

        <Link to="/login" className="mt-5 block text-sm font-medium text-teal-700 dark:text-teal-300">
          Back to login
        </Link>
      </section>
    </main>
  )
}

export default ForgotPasswordPage
