import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import Forum from '@/pages/Forum'
import ThreadDetail from '@/pages/forum/ThreadDetail'
import Research from '@/pages/Research'
import ProjectDetail from '@/pages/research/ProjectDetail'
import Actions from '@/pages/Actions'
import Policy from '@/pages/Policy'
import Solutions from '@/pages/Solutions'
import Profile from '@/pages/Profile'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/auth/login" replace />
  return <>{children}</>
}

export default function App() {
  useAuth()

  return (
    <Routes>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="forum" element={<Forum />} />
        <Route path="forum/:id" element={<ThreadDetail />} />
        <Route path="research" element={<Research />} />
        <Route path="research/:id" element={<ProjectDetail />} />
        <Route path="actions" element={<Actions />} />
        <Route path="policy" element={<Policy />} />
        <Route path="solutions" element={<Solutions />} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}