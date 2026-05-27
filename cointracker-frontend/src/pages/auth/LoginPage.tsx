import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { Input, Button, message } from 'antd'
import { useLogin } from '@/hooks/UseLogin'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useLogin()

  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      await login.mutateAsync({ email, password })
      message.success('Login successful')
      navigate(from, { replace: true })
    } catch {
      message.error('Invalid credentials')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-8 rounded-3xl border">
        <h1 className="text-3xl font-semibold">Login</h1>

        <div className="mt-6 space-y-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="primary"
            block
            loading={login.isPending}
            onClick={handleLogin}
          >
            Login
          </Button>
        </div>
      </div>
    </main>
  )
}

export default LoginPage