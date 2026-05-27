import { Button, Form, Input, message } from 'antd'
import { Link, useNavigate } from 'react-router'
import { Mail, LockKeyhole, User } from 'lucide-react'
import { useRegister } from '@/hooks/UseRegister'
import { getApiErrorMessage } from '@/lib/errors'
import type { RegisterRequest } from '@/types/auth'
import BrandMark from '@/components/shared/BrandMark'
import { isPendingActivationEmail, markPendingActivation } from '@/lib/activation'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'
import { DISPLAY_NAME_MAX_LENGTH } from '@/lib/user-display'

const SignupPage = () => {
  const navigate = useNavigate()
  const register = useRegister()
  const { updatePreferences } = useUserPreferences()

  const handleSignup = async (values: RegisterRequest) => {
    try {
      const response = await register.mutateAsync(values)
      updatePreferences({ displayName: values.fullName.trim().slice(0, DISPLAY_NAME_MAX_LENGTH) })
      markPendingActivation(values.email)
      message.success(response.message ?? 'Account created. Please activate your account.')
      navigate('/login')
    } catch (error) {
      const apiMessage = getApiErrorMessage(error, 'Signup failed')
      const lowerMessage = apiMessage.toLowerCase()
      message.error(
        isPendingActivationEmail(values.email) || lowerMessage.includes('already registered')
          ? 'Please verify your email first. Check your inbox for the activation link.'
          : apiMessage
      )
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-(--app-bg) px-4 py-8">
      <section className="glass-panel rounded-3xl p-8" style={{ width: 'min(calc(100vw - 32px), 600px)' }}>
        <div>
          <BrandMark />
          <h1 className="mt-2 text-3xl font-semibold text-neutral-950 dark:text-white">Create account</h1>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Create your account, activate it from email, and start tracking with confidence.
          </p>
        </div>

        <Form<RegisterRequest> layout="vertical" className="mt-6" onFinish={handleSignup} requiredMark={false}>
          <Form.Item
            label="Full name"
            name="fullName"
            rules={[{ required: true, message: 'Full name is required' }]}
          >
            <Input prefix={<User size={16} />} placeholder="Your name" size="large" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Enter a valid email' },
              { min: 6, message: 'Email must be at least 6 characters' },
            ]}
          >
            <Input prefix={<Mail size={16} />} placeholder="you@example.com" size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Password is required' },
              { min: 6, message: 'Use at least 6 characters' },
            ]}
          >
            <Input.Password prefix={<LockKeyhole size={16} />} placeholder="Password" size="large" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large" loading={register.isPending}>
            Create account
          </Button>
        </Form>

        <Link
          to="/login"
          className="mt-5 block rounded-2xl bg-(--surface-muted) px-4 py-3 text-center text-sm font-medium text-(--foreground) transition hover:-translate-y-0.5 hover:shadow-md"
        >
          Already have an account? <span className="text-teal-700 dark:text-teal-300">Sign in</span>
        </Link>
      </section>
    </main>
  )
}

export default SignupPage
