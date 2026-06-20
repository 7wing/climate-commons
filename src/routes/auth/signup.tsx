import { useState } from 'react'
import {
  createFileRoute,
  redirect,
  Link,
} from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { COPY } from '@/constants/copy'

interface AuthSearch {
  returnUrl?: string
}

export const Route = createFileRoute('/auth/signup')({
  validateSearch: (search: Record<string, unknown>): AuthSearch => {
    return {
      returnUrl:
        typeof search.returnUrl === 'string' ? search.returnUrl : undefined,
    }
  },
  beforeLoad: async ({ search }) => {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      return
    }
    if (data.session) {
      throw redirect({ to: search.returnUrl || '/' })
    }
  },
  component: Signup,
})

function Signup() {
  const search = Route.useSearch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message || COPY.common.error)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">
            {COPY.auth.signupTitle}
          </h1>
          <p className="text-foreground">
            We&apos;ve sent a confirmation email to <strong>{email}</strong>.
            Please verify your email before logging in.
          </p>
          <Link
            to="/auth/login"
            search={{ returnUrl: search.returnUrl }}
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {COPY.auth.loginButton}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">
          {COPY.auth.signupTitle}
        </h1>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              {COPY.auth.emailLabel}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground"
            >
              {COPY.auth.passwordLabel}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? COPY.common.loading : COPY.auth.signupButton}
          </button>
        </form>

        <div className="text-sm">
          <Link
            to="/auth/login"
            search={{ returnUrl: search.returnUrl }}
            className="text-primary underline-offset-4 hover:underline"
          >
            {COPY.auth.alreadyHaveAccount}
          </Link>
        </div>
      </div>
    </main>
  )
}
