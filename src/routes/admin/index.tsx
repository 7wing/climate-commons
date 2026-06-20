import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/admin/')({
  component: AdminDashboard,
})

function useCount(table: string, col?: string, val?: string) {
  return useQuery({
    queryKey: ['admin', 'count', table, col, val],
    queryFn: async () => {
      let q = supabase.from(table as any).select('*', { count: 'exact', head: true })
      if (col && val) q = q.eq(col, val)
      const { count, error } = await q
      if (error) throw error
      return count || 0
    },
  })
}

function AdminDashboard() {
  const { data: users } = useCount('users')
  const { data: research } = useCount('research_projects')
  const { data: proposals } = useCount('proposals', 'status', 'pending')
  const { data: pending } = useCount('actions', 'status', 'pending')
  const stats = [
    { label: 'Total Users', value: users },
    { label: 'Active Research', value: research },
    { label: 'Pending Proposals', value: proposals },
    { label: 'Pending Actions', value: pending },
  ]
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold text-primary">{s.value ?? COPY.common.loading}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
