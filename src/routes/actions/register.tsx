import { useState } from 'react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { useCreateAction } from '@/hooks/useActions'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/actions/register')({
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error || !data.session) {
      throw redirect({ to: '/auth/login', search: { returnUrl: '/actions/register' } })
    }
  },
  component: RegisterActionPage,
})

function RegisterActionPage() {
  const navigate = useNavigate()
  const create = useCreateAction()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await create.mutateAsync({
      title,
      description,
      location_name: location,
      event_date: date,
      start_time: '00:00:00',
      category: 'general',
      latitude: 0,
      longitude: 0,
    })
    navigate({ to: '/actions' })
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-foreground">{COPY.actions.proposeAction}</h1>
      <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">{COPY.actions.actionTitleLabel}</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">{COPY.actions.descriptionLabel}</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">{COPY.actions.locationLabel}</label>
          <input
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">{COPY.actions.dateLabel}</label>
          <input
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        {create.isError && <p className="text-destructive">{COPY.common.error}</p>}
        <button
          type="submit"
          disabled={create.isPending}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {create.isPending ? COPY.common.loading : COPY.actions.submitButton}
        </button>
      </form>
    </main>
  )
}
