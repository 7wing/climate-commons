import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/admin/reports')({
  component: ReportsPage,
})

function ReportsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'reports'],
    queryFn: async () => {
      const { data, error } = await supabase.from('policy_reports').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
  if (isLoading) return <p className="text-muted-foreground">{COPY.common.loading}</p>
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Policy Reports</h1>
      <table className="w-full border text-sm">
        <thead className="bg-card"><tr><th className="border p-2 text-left">Title</th><th className="border p-2 text-left">Period</th><th className="border p-2 text-left">Download</th></tr></thead>
        <tbody>
          {data?.map((r) => (
            <tr key={r.id} className="border">
              <td className="border p-2">{r.title}</td>
              <td className="border p-2">{r.period}</td>
              <td className="border p-2">
                {r.pdf_url ? <a href={r.pdf_url} target="_blank" rel="noreferrer" className="text-primary underline">PDF</a> : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
