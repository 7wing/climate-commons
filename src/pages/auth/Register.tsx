import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', username: '', fullName: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  function update(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')
    setLoading(true)
    const { error } = await signUp(form.email, form.password, form.username, form.fullName)
    setLoading(false)
    if (error) setError(error.message)
    else navigate('/')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-container-margin-mobile py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-on-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          </div>
          <h1 className="font-bold text-headline-lg-mobile">Join Climate Commons</h1>
          <p className="text-body-md text-on-surface-variant mt-2">Be part of the change</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 shadow-[0_4px_20px_rgba(34,139,34,0.04)]">
          {error && (
            <div className="bg-error-container text-on-error-container px-4 py-3 rounded-2xl mb-6 text-body-md">{error}</div>
          )}

          <div className="space-y-4 mb-6">
            {[
              { field: 'fullName', label: 'FULL NAME', type: 'text', placeholder: 'Jane Doe' },
              { field: 'username', label: 'USERNAME', type: 'text', placeholder: 'jane_eco' },
              { field: 'email', label: 'EMAIL', type: 'email', placeholder: 'you@example.com' },
              { field: 'password', label: 'PASSWORD (min 8 chars)', type: 'password', placeholder: '••••••••' },
            ].map(({ field, label, type, placeholder }) => (
              <div key={field}>
                <label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">{label}</label>
                <input
                  type={type}
                  value={form[field as keyof typeof form]}
                  onChange={update(field)}
                  required
                  className="w-full h-12 px-4 bg-surface-container rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-primary text-body-md"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Create Account
          </Button>

          <p className="text-center text-body-md text-on-surface-variant mt-4 text-sm">
            By joining you agree to our{' '}
            <span className="text-primary cursor-pointer hover:underline">Community Guidelines</span>
          </p>
        </form>

        <p className="text-center mt-6 text-body-md text-on-surface-variant">
          Already a member?{' '}
          <Link to="/auth/login" className="text-primary font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  )
}