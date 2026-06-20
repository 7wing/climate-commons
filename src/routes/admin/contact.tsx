import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/admin/contact')({
  component: ContactPage,
})

function ContactPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'contact'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contact_submissions').update({ resolved_at: new Date().toISOString() }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'contact'] }),
  })
  if (isLoading) return <p className="text-muted-foreground">{COPY.common.loading}</p>
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Contact Submissions</h1>
      <table className="w-full border text-sm">
        <thead className="bg-card"><tr><th className="border p-2 text-left">Name</th><th className="border p-2 text-left">Email</th><th className="border p-2 text-left">Type</th><th className="border p-2 text-left">Resolved</th><th className="border p-2 text-left">Actions</th></tr></thead>
        <tbody>
          {data?.map((c) => (
            <tr key={c.id} className="border">
              <td className="border p-2">{c.full_name}</td>
              <td className="border p-2">{c.email}</td>
              <td className="border p-2">{c.inquiry_type}</td>
              <td className="border p-2">{c.resolved_at ? 'Yes' : 'No'}</td>
              <td className="border p-2">
                {!c.resolved_at && (
                  <button onClick={() => markRead.mutate(c.id)} className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground">Mark read</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
