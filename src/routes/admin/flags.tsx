import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/admin/flags')({
  component: FlagsQueue,
})

function FlagsQueue() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'flags'],
    queryFn: async () => {
      const { data, error } = await supabase.from('content_flags').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
  const mutate = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('content_flags').update({ status }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'flags'] }),
  })
  if (isLoading) return <p className="text-muted-foreground">{COPY.common.loading}</p>
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Flagged Content</h1>
      <table className="w-full border text-sm">
        <thead className="bg-card"><tr><th className="border p-2 text-left">ID</th><th className="border p-2 text-left">Reason</th><th className="border p-2 text-left">Status</th><th className="border p-2 text-left">Created</th><th className="border p-2 text-left">Actions</th></tr></thead>
        <tbody>
          {data?.map((f) => (
            <tr key={f.id} className="border">
              <td className="border p-2">{f.id.slice(0, 8)}</td>
              <td className="border p-2">{f.reason}</td>
              <td className="border p-2">{f.status}</td>
              <td className="border p-2">{f.created_at ? new Date(f.created_at).toLocaleDateString() : '-'}</td>
              <td className="border p-2">
                <button onClick={() => mutate.mutate({ id: f.id, status: 'resolved' })} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">Resolve</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
