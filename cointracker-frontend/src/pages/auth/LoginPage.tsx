import { Button, Form, Input, message } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router'
import { Mail, LockKeyhole } from 'lucide-react'
import { useLogin } from '@/hooks/UseLogin'
import { getApiErrorMessage } from '@/lib/errors'
import type { LoginRequest } from '@/types/auth'
import BrandMark from '@/components/shared/BrandMark'
import { isPendingActivationEmail, markFirstLogin } from '@/lib/activation'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useLogin()

  const from = location.state?.from?.pathname || '/'

  const handleLogin = async (values: LoginRequest) => {
    try {
      await login.mutateAsync(values)
      if (isPendingActivationEmail(values.email)) {
        markFirstLogin(values.email)
      }
      message.success('Login successful')
      navigate(from, { replace: true })
    } catch (error) {
      const apiMessage = getApiErrorMessage(error, 'Invalid email or password')
      const shouldVerifyEmail =
        isPendingActivationEmail(values.email) ||
        apiMessage.toLowerCase().includes('activated') ||
        apiMessage.toLowerCase().includes('forbidden') ||
        apiMessage.toLowerCase().includes('something went wrong')

      message.error(
        shouldVerifyEmail
          ? 'Please verify your email first. Check your inbox for the activation link.'
          : apiMessage
      )
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] px-4">
      <section className="glass-panel w-full max-w-md rounded-3xl p-8">
        <div>
          <BrandMark />
          <h1 className="mt-2 text-3xl font-semibold text-neutral-950 dark:text-white">Sign in</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Open your finance home and keep today’s money moves tidy.
          </p>
        </div>

        <Form<LoginRequest> layout="vertical" className="mt-6" onFinish={handleLogin} requiredMark={false}>
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

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Password is required' }]}
          >
            <Input.Password prefix={<LockKeyhole size={16} />} placeholder="Password" size="large" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large" loading={login.isPending}>
            Sign in
          </Button>
        </Form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="font-medium text-teal-700 dark:text-teal-300">
            Forgot password?
          </Link>
          <Link to="/signup" className="font-medium text-neutral-700 dark:text-neutral-200">
            Create account
          </Link>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
