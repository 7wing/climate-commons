import { createFileRoute, Link } from '@tanstack/react-router'
import { useActionsList } from '@/hooks/useActions'
import { useAuth } from '@/hooks/useAuth'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/actions/')({
  component: ActionsList,
})

function ActionsList() {
  const { data, isLoading, error } = useActionsList()
  const { data: session } = useAuth()

  return (
    <main className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">{COPY.actions.title}</h1>
        <Link
          to={session ? '/actions/register' : '/auth/login'}
          search={session ? undefined : { returnUrl: '/actions' }}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {COPY.actions.proposeAction}
        </Link>
      </div>

      {isLoading && <p className="mt-4 text-muted-foreground">{COPY.common.loading}</p>}
      {error && <p className="mt-4 text-destructive">{COPY.common.error}</p>}

      <ul className="mt-6 space-y-4">
        {data?.map((item) => (
          <li key={item.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <Link
              to="/actions/$id"
              params={{ id: item.id }}
              className="text-lg font-medium text-primary underline-offset-4 hover:underline"
            >
              {item.title}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            {item.location_name && (
              <p className="mt-1 text-xs text-muted-foreground">{item.location_name}</p>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
