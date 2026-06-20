import { createFileRoute } from '@tanstack/react-router'
import { useDatasets } from '@/hooks/useOpenData'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/open-data/')({
  component: OpenDataList,
})

function OpenDataList() {
  const { data, isLoading, error } = useDatasets()

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-primary">Open Data</h1>

      {isLoading && <p className="mt-4 text-muted-foreground">{COPY.common.loading}</p>}
      {error && <p className="mt-4 text-destructive">{COPY.common.error}</p>}

      <ul className="mt-6 space-y-4">
        {data?.map((item) => (
          <li key={item.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <h2 className="text-lg font-medium text-foreground">{item.title}</h2>
            {item.description && (
              <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
            )}
            {item.published_at && (
              <p className="mt-1 text-xs text-muted-foreground">Published: {item.published_at}</p>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
