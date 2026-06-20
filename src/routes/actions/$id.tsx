import { createFileRoute, Link } from '@tanstack/react-router'
import { useActionById, useRegisterForAction } from '@/hooks/useActions'
import { useAuth } from '@/hooks/useAuth'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/actions/$id')({
  component: ActionDetail,
})

function ActionDetail() {
  const { id } = Route.useParams()
  const { data, isLoading, error } = useActionById(id)
  const { data: session } = useAuth()
  const register = useRegisterForAction()

  return (
    <main className="p-8">
      <Link
        to="/actions"
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        {COPY.common.backButton}
      </Link>

      {isLoading && <p className="mt-4 text-muted-foreground">{COPY.common.loading}</p>}
      {error && <p className="mt-4 text-destructive">{COPY.common.error}</p>}

      {data && (
        <div className="mt-4 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">{data.title}</h1>
          <p className="mt-2 text-muted-foreground">{data.description}</p>
          {data.location_name && (
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium">Location:</span> {data.location_name}
            </p>
          )}
          {data.event_date && (
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium">Date:</span> {data.event_date}
            </p>
          )}
          {session ? (
            <button
              onClick={() => register.mutate({ action_id: id, user_id: session.user.id })}
              disabled={register.isPending}
              className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {register.isPending ? COPY.common.loading : COPY.actions.joinAction}
            </button>
          ) : (
            <Link
              to="/auth/login"
              search={{ returnUrl: `/actions/${id}` }}
              className="mt-4 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {COPY.actions.joinAction}
            </Link>
          )}
        </div>
      )}
    </main>
  )
}
