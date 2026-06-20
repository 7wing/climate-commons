import { createFileRoute, Link, Outlet, redirect, useRouter } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error || !data.session) {
      throw redirect({ to: '/auth/login', search: { returnUrl: '/admin' } })
    }
  },
  component: AdminLayout,
})

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/proposals', label: 'Proposals' },
  { to: '/admin/actions', label: 'Actions' },
  { to: '/admin/claims', label: 'Claims' },
  { to: '/admin/flags', label: 'Flags' },
  { to: '/admin/policy', label: 'Policy' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/datasets', label: 'Datasets' },
  { to: '/admin/settings', label: 'Settings' },
  { to: '/admin/partnerships', label: 'Partnerships' },
  { to: '/admin/contact', label: 'Contact' },
]

function AdminLayout() {
  const router = useRouter()
  const pathname = router.state.location.pathname
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-card border-r border-border p-4 space-y-2">
        <h2 className="text-lg font-bold text-foreground mb-4">Admin</h2>
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={pathname === l.to ? 'block text-primary font-bold' : 'block text-muted-foreground hover:text-foreground'}
          >
            {l.label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
