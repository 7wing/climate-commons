import { createFileRoute } from '@tanstack/react-router'
import { usePartners } from '@/hooks/usePartners'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/partnerships/')({
  component: PartnershipsList,
})

function PartnershipsList() {
  const { data, isLoading, error } = usePartners()

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-primary">Partnerships</h1>

      {isLoading && <p className="mt-4 text-muted-foreground">{COPY.common.loading}</p>}
      {error && <p className="mt-4 text-destructive">{COPY.common.error}</p>}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((item) => (
          <li key={item.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <h2 className="text-lg font-medium text-foreground">{item.name}</h2>
            {item.website_url && (
              <a
                href={item.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm text-primary underline-offset-4 hover:underline"
              >
                {item.website_url}
              </a>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
