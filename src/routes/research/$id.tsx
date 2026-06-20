import { createFileRoute, Link } from '@tanstack/react-router'
import { useResearchById } from '@/hooks/useResearch'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/research/$id')({
  component: ResearchDetail,
})

function ResearchDetail() {
  const { id } = Route.useParams()
  const { data, isLoading, error } = useResearchById(id)

  return (
    <main className="p-8">
      <Link
        to="/research"
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
          {data.cover_image_url && (
            <img
              src={data.cover_image_url}
              alt={data.title}
              className="mt-4 max-h-64 w-full rounded-md object-cover"
            />
          )}
        </div>
      )}
    </main>
  )
}
