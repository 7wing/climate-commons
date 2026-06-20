import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { useBookmarks } from '@/hooks/useBookmarks'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/bookmarks')({
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error || !data.session) {
      throw redirect({ to: '/auth/login', search: { returnUrl: '/bookmarks' } })
    }
  },
  component: BookmarksPage,
})

function BookmarksPage() {
  const { data, isLoading, error } = useBookmarks()

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-foreground">{COPY.bookmarks.title}</h1>
      {isLoading && <p className="mt-4 text-muted-foreground">{COPY.common.loading}</p>}
      {error && <p className="mt-4 text-destructive">{COPY.common.error}</p>}
      <ul className="mt-6 space-y-4">
        {data?.map((b) => (
          <li key={b.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            {b.research_project ? (
              <Link
                to="/research/$id"
                params={{ id: b.research_project.id }}
                className="text-lg font-medium text-primary underline-offset-4 hover:underline"
              >
                {b.research_project.title}
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">Project unavailable</p>
            )}
          </li>
        ))}
      </ul>
      {data?.length === 0 && (
        <p className="mt-4 text-muted-foreground">{COPY.bookmarks.noBookmarks}</p>
      )}
    </main>
  )
}
