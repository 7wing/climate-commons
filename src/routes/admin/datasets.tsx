import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/admin/datasets')({
  component: DatasetsPage,
})

function DatasetsPage() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'datasets'],
    queryFn: async () => {
      const { data, error } = await supabase.from('datasets').select('*').is('deleted_at', null).order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('datasets').update({ deleted_at: new Date().toISOString() }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'datasets'] }),
  })
  if (isLoading) return <p className="text-muted-foreground">{COPY.common.loading}</p>
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Open Data</h1>
      <table className="w-full border text-sm">
        <thead className="bg-card"><tr><th className="border p-2 text-left">Title</th><th className="border p-2 text-left">Description</th><th className="border p-2 text-left">Actions</th></tr></thead>
        <tbody>
          {data?.map((d) => (
            <tr key={d.id} className="border">
              <td className="border p-2">{d.title}</td>
              <td className="border p-2">{d.description}</td>
              <td className="border p-2">
                <button onClick={() => remove.mutate(d.id)} className="rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
