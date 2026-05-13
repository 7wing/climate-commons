import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) setError(error.message)
    else navigate('/')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-container-margin-mobile">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-on-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          </div>
          <h1 className="font-bold text-headline-lg-mobile text-on-surface">Welcome back</h1>
          <p className="text-body-md text-on-surface-variant mt-2">Sign in to Climate Commons</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 shadow-[0_4px_20px_rgba(34,139,34,0.04)]">
          {error && (
            <div className="bg-error-container text-on-error-container px-4 py-3 rounded-2xl mb-6 text-body-md">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 px-4 bg-surface-container rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-primary text-body-md"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 px-4 bg-surface-container rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-primary text-body-md"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Sign In
          </Button>
        </form>

        <p className="text-center mt-6 text-body-md text-on-surface-variant">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-primary font-bold hover:underline">Join Climate Commons</Link>
        </p>
      </div>
    </div>
  )
}