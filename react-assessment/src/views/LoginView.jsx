import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layers, Loader2 } from 'lucide-react'
import { useAuth } from '@/features/auth/useAuth'
import BaseInput from '@/shared/components/BaseInput'
import BaseButton from '@/shared/components/BaseButton'

export default function LoginView() {
  const navigate = useNavigate()
  const { login, isAuthPending, authError } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    const success = await login(username, password)
    if (success) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
            <Layers className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Posts Explorer</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to your admin account</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <BaseInput
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              label="Username"
              placeholder="admin"
              required
              autoComplete="username"
            />
            <BaseInput
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              label="Password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {authError && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {authError}
            </div>
          )}

          <BaseButton
            type="submit"
            className="w-full flex justify-center py-3"
            disabled={isAuthPending}
          >
            {isAuthPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              <span>Sign in</span>
            )}
          </BaseButton>
        </form>
      </div>
    </div>
  )
}
