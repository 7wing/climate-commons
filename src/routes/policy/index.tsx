import { createFileRoute, Link } from '@tanstack/react-router'
import { usePolicies } from '@/hooks/usePolicy'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/policy/')({
  component: PolicyList,
})

function PolicyList() {
  const { data, isLoading, error } = usePolicies()

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-primary">{COPY.policy.title}</h1>

      {isLoading && <p className="mt-4 text-muted-foreground">{COPY.common.loading}</p>}
      {error && <p className="mt-4 text-destructive">{COPY.common.error}</p>}

      <ul className="mt-6 space-y-4">
        {data?.map((item) => (
          <li key={item.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <Link
              to="/policy/$id"
              params={{ id: item.id }}
              className="text-lg font-medium text-primary underline-offset-4 hover:underline"
            >
              {item.title}
            </Link>
            {item.body && (
              <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{item.body}</p>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
