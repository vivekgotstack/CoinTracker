import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Input, Button, message } from 'antd'
import { useRegister } from '@/hooks/UseRegister'

const SignupPage = () => {
  const navigate = useNavigate()
  const register = useRegister()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = async () => {
    try {
      await register.mutateAsync({
        email,
        password,
        fullName: 'User',
      })

      message.success('Account created')
      navigate('/login')
    } catch {
      message.error('Signup failed')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl p-8 rounded-3xl border">
        <h1 className="text-3xl font-semibold">Signup</h1>

        <div className="mt-6 space-y-4">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input.Password placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <Button type="primary" block loading={register.isPending} onClick={handleSignup}>
            Signup
          </Button>
        </div>
      </div>
    </main>
  )
}

export default SignupPage