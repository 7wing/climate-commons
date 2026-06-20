import { createFileRoute, redirect } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { useNotifications, useMarkNotificationRead } from '@/hooks/useNotifications'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/notifications')({
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error || !data.session) {
      throw redirect({ to: '/auth/login', search: { returnUrl: '/notifications' } })
    }
  },
  component: NotificationsPage,
})

function NotificationsPage() {
  const { data, isLoading, error } = useNotifications()
  const markRead = useMarkNotificationRead()

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-foreground">{COPY.notifications.title}</h1>
      {isLoading && <p className="mt-4 text-muted-foreground">{COPY.common.loading}</p>}
      {error && <p className="mt-4 text-destructive">{COPY.common.error}</p>}
      <ul className="mt-6 space-y-3">
        {data?.map((n) => (
          <li key={n.id} className={`rounded-lg border border-border bg-card p-4 shadow-sm ${n.read ? 'opacity-60' : ''}`}>
            <p className="text-sm font-medium text-foreground">{n.title}</p>
            <p className="text-sm text-muted-foreground">{n.body}</p>
            {!n.read && (
              <button
                onClick={() => markRead.mutate(n.id)}
                disabled={markRead.isPending}
                className="mt-2 inline-flex items-center rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {COPY.notifications.markAsRead}
              </button>
            )}
          </li>
        ))}
      </ul>
      {data?.length === 0 && <p className="mt-4 text-muted-foreground">{COPY.notifications.noNotifications}</p>}
    </main>
  )
}
