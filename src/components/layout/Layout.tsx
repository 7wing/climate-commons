import { Outlet } from 'react-router-dom'
import TopAppBar from './TopAppBar'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopAppBar />
      <main className="pt-16 pb-24 md:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}