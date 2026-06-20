import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/admin/policy')({
  component: PolicyManagement,
})

function PolicyManagement() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'policy'],
    queryFn: async () => {
      const { data, error } = await supabase.from('policy_updates').select('*').is('deleted_at', null).order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
  const publish = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('policy_updates').update({ published_at: new Date().toISOString() }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'policy'] }),
  })
  if (isLoading) return <p className="text-muted-foreground">{COPY.common.loading}</p>
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Policy Management</h1>
      <table className="w-full border text-sm">
        <thead className="bg-card"><tr><th className="border p-2 text-left">Title</th><th className="border p-2 text-left">Status</th><th className="border p-2 text-left">Published</th><th className="border p-2 text-left">Actions</th></tr></thead>
        <tbody>
          {data?.map((p) => (
            <tr key={p.id} className="border">
              <td className="border p-2">{p.title}</td>
              <td className="border p-2">{p.status}</td>
              <td className="border p-2">{p.published_at ? new Date(p.published_at).toLocaleDateString() : '-'}</td>
              <td className="border p-2">
                {!p.published_at && (
                  <button onClick={() => publish.mutate(p.id)} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">Publish</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
