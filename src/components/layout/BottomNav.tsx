import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/utils/cn'

const navItems = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/research', label: 'Research', icon: 'database' },
  { to: '/forum', label: 'Forum', icon: 'forum' },
  { to: '/actions', label: 'Actions', icon: 'eco' },
  { to: '/policy', label: 'Policy', icon: 'policy' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-safe pt-2 pb-4 bg-surface-container border-t border-outline-variant/20 rounded-t-xl shadow-[0_-4px_20px_rgba(34,139,34,0.06)]">
      {navItems.map((item) => {
        const isActive = item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'flex flex-col items-center justify-center py-1.5 transition-all active:scale-95 duration-200',
              isActive
                ? 'bg-primary-container text-on-primary-container rounded-full px-4'
                : 'text-on-surface-variant'
            )}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="font-label-caps text-label-caps mt-0.5">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}