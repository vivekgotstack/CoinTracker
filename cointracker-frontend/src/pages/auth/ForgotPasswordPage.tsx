import { Button, Form, Input, message } from 'antd'
import { Link } from 'react-router'
import { Mail } from 'lucide-react'
import { forgotPassword } from '@/lib/auth-api'
import { getApiErrorMessage } from '@/lib/errors'

type ForgotPasswordForm = {
  email: string
}

const ForgotPasswordPage = () => {
  const handleSubmit = async (values: ForgotPasswordForm) => {
    try {
      const response = await forgotPassword(values.email)
      message.success(response)
    } catch (error) {
      message.error(getApiErrorMessage(error, 'Unable to send reset link'))
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 dark:bg-neutral-950">
      <section className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
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

          <Button type="primary" htmlType="submit" block size="large">
            Send reset link
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
