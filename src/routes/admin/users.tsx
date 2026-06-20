import { createFileRoute } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { COPY } from '@/constants/copy'

export const Route = createFileRoute('/admin/users')({
  component: UserManagement,
})

function UserManagement() {
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
  const updateRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const { error } = await supabase.from('users').update({ role }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })
  if (isLoading) return <p className="text-muted-foreground">{COPY.common.loading}</p>
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-4">User Management</h1>
      <table className="w-full border text-sm">
        <thead className="bg-card"><tr><th className="border p-2 text-left">Name</th><th className="border p-2 text-left">Email</th><th className="border p-2 text-left">Role</th><th className="border p-2 text-left">Impact Score</th></tr></thead>
        <tbody>
          {data?.map((u) => (
            <tr key={u.id} className="border">
              <td className="border p-2">{u.display_name}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">
                <select value={u.role || ''} onChange={(e) => updateRole.mutate({ id: u.id, role: e.target.value })} className="bg-background border rounded px-1 py-0.5">
                  <option value="user">user</option>
                  <option value="moderator">moderator</option>
                  <option value="admin">admin</option>
                  <option value="researcher">researcher</option>
                </select>
              </td>
              <td className="border p-2">{u.impact_score ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
