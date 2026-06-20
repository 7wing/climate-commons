import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/admin/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('platform_settings').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
  if (isLoading) return <p className="text-muted-foreground">{COPY.common.loading}</p>
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">Platform Settings</h1>
      <table className="w-full border text-sm">
        <thead className="bg-card"><tr><th className="border p-2 text-left">Key</th><th className="border p-2 text-left">Value</th></tr></thead>
        <tbody>
          {data?.flatMap((s) =>
            Object.entries(s).filter(([k]) => k !== 'id' && k !== 'created_at' && k !== 'updated_at').map(([k, v]) => (
              <tr key={`${s.id}-${k}`} className="border">
                <td className="border p-2 font-medium">{k}</td>
                <td className="border p-2">{String(v ?? '-')}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
