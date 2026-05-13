import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/hooks/useNotifications'
import { useState } from 'react'

export default function TopAppBar() {
  const { user, profile, signOut } = useAuth()
  const { data: notifications } = useNotifications(user?.id)
  const unreadCount = notifications?.filter((n) => !n.is_read).length ?? 0
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="bg-surface-container-low fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-container-margin-mobile md:px-container-margin-desktop h-16 border-b border-outline-variant/20">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            eco
          </span>
        </div>
        <span className="font-bold text-headline-md text-primary hidden sm:block">Climate Commons</span>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-1">
        {[
          { to: '/', label: 'Home', icon: 'home' },
          { to: '/research', label: 'Research', icon: 'database' },
          { to: '/forum', label: 'Forum', icon: 'forum' },
          { to: '/actions', label: 'Actions', icon: 'eco' },
          { to: '/policy', label: 'Policy', icon: 'policy' },
          { to: '/solutions', label: 'Solutions', icon: 'lightbulb' },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="px-3 py-1.5 rounded-full font-label-caps text-label-caps text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <button className="relative p-2 rounded-full hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-primary">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-tertiary text-on-tertiary text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary-container hover:border-primary transition-colors"
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.full_name ?? ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary-container flex items-center justify-center">
                    <span className="text-on-primary-container font-bold text-sm">
                      {profile?.username?.[0]?.toUpperCase() ?? 'U'}
                    </span>
                  </div>
                )}
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-12 w-44 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-lg overflow-hidden z-50">
                  <Link to="/profile" onClick={() => setShowUserMenu(false)} className="block px-4 py-3 text-body-md text-on-surface hover:bg-surface-container transition-colors">
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                        signOut()
                        setShowUserMenu(false)
                        navigate('/')   // redirect to home after sign out
                    }}
                    className="w-full text-left px-4 py-3 text-body-md text-tertiary hover:bg-surface-container transition-colors"
                    >
                    Sign Out
                  </button>

                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/auth/login" className="h-9 px-4 rounded-full border border-primary text-primary font-label-caps text-label-caps hover:bg-primary-container/20 transition-colors flex items-center">
              Sign In
            </Link>
            <Link to="/auth/register" className="h-9 px-4 rounded-full bg-primary text-on-primary font-label-caps text-label-caps hover:scale-[1.02] transition-transform flex items-center">
              Join
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}