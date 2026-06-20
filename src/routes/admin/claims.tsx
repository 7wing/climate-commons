import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/admin/claims')({
  component: ClaimsQueue,
})

function ClaimsQueue() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'claims'],
    queryFn: async () => {
      const { data, error } = await supabase.from('originality_claims').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
  if (isLoading) return <p className="text-muted-foreground">{COPY.common.loading}</p>
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Originality Claims</h1>
      <table className="w-full border text-sm">
        <thead className="bg-card"><tr><th className="border p-2 text-left">ID</th><th className="border p-2 text-left">Status</th><th className="border p-2 text-left">Created</th></tr></thead>
        <tbody>
          {data?.map((c) => (
            <tr key={c.id} className="border">
              <td className="border p-2">{c.id.slice(0, 8)}</td>
              <td className="border p-2">{c.status}</td>
              <td className="border p-2">{c.created_at ? new Date(c.created_at).toLocaleDateString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
