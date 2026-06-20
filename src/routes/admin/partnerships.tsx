import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/admin/partnerships')({
  component: PartnershipsPage,
})

function PartnershipsPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'partnerships'],
    queryFn: async () => {
      const { data, error } = await supabase.from('partnership_inquiries').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
  const approve = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('partnership_inquiries').update({ reviewed_at: new Date().toISOString() }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'partnerships'] }),
  })
  const reject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('partnership_inquiries').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'partnerships'] }),
  })
  if (isLoading) return <p className="text-muted-foreground">{COPY.common.loading}</p>
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Partnership Inquiries</h1>
      <table className="w-full border text-sm">
        <thead className="bg-card"><tr><th className="border p-2 text-left">Org</th><th className="border p-2 text-left">Type</th><th className="border p-2 text-left">Email</th><th className="border p-2 text-left">Actions</th></tr></thead>
        <tbody>
          {data?.map((p) => (
            <tr key={p.id} className="border">
              <td className="border p-2">{p.org_name}</td>
              <td className="border p-2">{p.org_type}</td>
              <td className="border p-2">{p.contact_email}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => approve.mutate(p.id)} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">Approve</button>
                <button onClick={() => reject.mutate(p.id)} className="rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
