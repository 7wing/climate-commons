import { useState } from 'react'
import { Link } from 'react-router-dom'
import ThreadCard from '@/components/forum/ThreadCard'
import SearchBar from '@/components/ui/SearchBar'
import Button from '@/components/ui/Button'
import { useForumThreads } from '@/hooks/useForumThreads'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'

const CATEGORIES = ['all', 'research', 'policy', 'action', 'solutions', 'general'] as const

const TRENDING = [
  { tag: '#CarbonAccounting', posts: '8.4k', pct: 85 },
  { tag: '#MyceliumMaterials', posts: '5.2k', pct: 60 },
  { tag: '#WaterJustice', posts: '3.1k', pct: 45 },
  { tag: '#UrbanForests', posts: '2.8k', pct: 38 },
]

export default function Forum() {
  const [category, setCategory] = useState<string>('all')
  const [search, setSearch] = useState('')
  const { data: threads, isLoading } = useForumThreads(category === 'all' ? undefined : category)
  const { user } = useAuth()

  const filtered = threads?.filter((t) =>
    !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.body.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-[1280px] mx-auto px-container-margin-mobile md:px-container-margin-desktop py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <p className="font-label-caps text-label-caps text-primary mb-2">COMMUNITY FORUM</p>
          <h1 className="font-bold text-headline-lg text-on-surface mb-2">Shaping our sustainable future</h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">Join experts and neighbors in high-impact discussions on climate policy and community action.</p>
        </div>
        {user ? (
          <Link to="/forum/new">
            <Button variant="primary" size="md">
              <span className="material-symbols-outlined text-[18px]">add_comment</span>
              Start a Discussion
            </Button>
          </Link>
        ) : (
          <Link to="/auth/login">
            <Button variant="outline" size="md">Sign In to Post</Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Main Feed */}
        <div className="md:col-span-8 space-y-6">
          {/* Search & Filters */}
          <div className="flex flex-wrap gap-3 mb-2">
            <SearchBar
              className="flex-grow"
              placeholder="Search discussions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'px-4 py-2 rounded-full font-label-caps text-label-caps transition-all capitalize',
                  category === cat
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Threads */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-surface-container rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : filtered?.length === 0 ? (
            <div className="text-center py-20 text-on-surface-variant">
              <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 block">search_off</span>
              <p className="text-body-lg">No threads found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered?.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="md:col-span-4 space-y-6">
          {/* Forum Stats */}
          <div className="bg-surface-container p-6 rounded-3xl">
            <h3 className="font-bold text-headline-md text-on-surface mb-6">Forum Ecosystem</h3>
            <div className="space-y-5">
              {[
                { icon: 'groups', label: 'Active Contributors', value: '1,240', color: 'bg-primary-container text-on-primary-container' },
                { icon: 'lightbulb', label: 'Ideas Verified', value: '312', color: 'bg-secondary-container text-on-secondary-container' },
                { icon: 'public', label: 'Global Nodes', value: '45', color: 'bg-tertiary-container text-on-tertiary-container' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.color}`}>
                      <span className="material-symbols-outlined">{stat.icon}</span>
                    </div>
                    <span className="text-body-md font-semibold">{stat.label}</span>
                  </div>
                  <span className="font-bold text-headline-md text-primary">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant">
            <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-6">TRENDING TOPICS</h3>
            <div className="space-y-4">
              {TRENDING.map((t) => (
                <div key={t.tag} className="group cursor-pointer">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-body-md font-bold text-on-surface group-hover:text-primary transition-colors">{t.tag}</span>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">{t.posts} posts</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${t.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary-container p-6 rounded-3xl text-on-primary-container relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-headline-md mb-2">Claim Your Impact</h3>
              <p className="text-body-md opacity-90 mb-6">Original research and verified local actions are eligible for the Commons Originality Badge.</p>
              <Button variant="secondary" size="sm" className="bg-surface text-primary hover:bg-surface-container-high">
                LEARN MORE
              </Button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-on-primary-container opacity-10 rounded-full blur-2xl" />
          </div>
        </aside>
      </div>
    </div>
  )
}