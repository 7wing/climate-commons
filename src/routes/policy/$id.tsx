import { createFileRoute, Link } from '@tanstack/react-router'
import { usePolicyById } from '@/hooks/usePolicy'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/policy/$id')({
  component: PolicyDetail,
})

function PolicyDetail() {
  const { id } = Route.useParams()
  const { data, isLoading, error } = usePolicyById(id)

  return (
    <main className="p-8">
      <Link
        to="/policy"
        className="text-sm text-primary underline-offset-4 hover:underline"
      >
        {COPY.common.backButton}
      </Link>

      {isLoading && <p className="mt-4 text-muted-foreground">{COPY.common.loading}</p>}
      {error && <p className="mt-4 text-destructive">{COPY.common.error}</p>}

      {data && (
        <div className="mt-4 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">{data.title}</h1>
          <div className="mt-4 whitespace-pre-wrap text-foreground">{data.body}</div>
        </div>
      )}
    </main>
  )
}
