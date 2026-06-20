import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/admin/actions')({
  component: ActionsQueue,
})

function ActionsQueue() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'actions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('actions').select('*').eq('status', 'pending').order('submitted_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
  const mutate = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('actions').update({ status }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'actions'] }),
  })
  if (isLoading) return <p className="text-muted-foreground">{COPY.common.loading}</p>
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Action Approval</h1>
      <table className="w-full border text-sm">
        <thead className="bg-card"><tr><th className="border p-2 text-left">Title</th><th className="border p-2 text-left">Description</th><th className="border p-2 text-left">Location</th><th className="border p-2 text-left">Actions</th></tr></thead>
        <tbody>
          {data?.map((a) => (
            <tr key={a.id} className="border">
              <td className="border p-2">{a.title}</td>
              <td className="border p-2">{a.description}</td>
              <td className="border p-2">{a.location_name}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => mutate.mutate({ id: a.id, status: 'published' })} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">Approve</button>
                <button onClick={() => mutate.mutate({ id: a.id, status: 'rejected' })} className="rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
