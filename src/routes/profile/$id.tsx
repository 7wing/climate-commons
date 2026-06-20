import { useState, useEffect } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { useUserProfile, useCurrentUser, useUpdateUser } from '@/hooks/useAuth'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/profile/$id')({
  beforeLoad: async ({ params }) => {
    const { data, error } = await supabase.auth.getSession()
    if (error || !data.session) {
      throw redirect({
        to: '/auth/login',
        search: { returnUrl: `/profile/${params.id}` },
      })
    }
  },
  component: ProfilePage,
})

function ProfilePage() {
  const { id } = Route.useParams()
  const { data: currentUser } = useCurrentUser()
  const { data: profile, isLoading, error } = useUserProfile(id)
  const updateUser = useUpdateUser()

  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '')
      setBio(profile.bio || '')
    }
  }, [profile])

  const isOwner = currentUser?.id === id

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isOwner) return
    await updateUser.mutateAsync({ id, display_name: displayName, bio })
  }

  if (isLoading) return <div className="p-8 text-muted-foreground">{COPY.common.loading}</div>
  if (error) return <div className="p-8 text-destructive">{COPY.common.error}</div>
  if (!profile) return <div className="p-8 text-muted-foreground">Profile not found.</div>

  return (
    <main className="p-8">
      <div className="max-w-2xl rounded-lg border border-border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">{profile.display_name}</h1>
        <p className="mt-2 text-muted-foreground capitalize">{profile.role || 'Member'}</p>
        <p className="mt-4 text-foreground">{profile.bio || 'No bio yet.'}</p>
        <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
          <span>{COPY.profile.contributions}: {(profile as any).contribution_count ?? 0}</span>
          <span>{COPY.profile.verifiedIdeas}: {(profile as any).verified_ideas ?? 0}</span>
        </div>

        {isOwner && (
          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">{COPY.settings.displayNameLabel}</label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">{COPY.settings.bioLabel}</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <button
              type="submit"
              disabled={updateUser.isPending}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {updateUser.isPending ? COPY.common.loading : COPY.common.saveButton}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
