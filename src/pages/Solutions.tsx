import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSolutions, useLikeSolution } from '@/hooks/useSolutions'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import { formatRelativeTime } from '@/utils/formatDate'
import { cn } from '@/utils/cn'

const CATEGORIES = ['all', 'household', 'industrial', 'community']

export default function Solutions() {
  const [category, setCategory] = useState('all')
  const { data: solutions, isLoading } = useSolutions(category === 'all' ? undefined : category)
  const { user } = useAuth()
  const likeMutation = useLikeSolution()

  const featured = solutions?.find((s) => s.is_featured) ?? solutions?.[0]
  const rest = solutions?.filter((s) => s.id !== featured?.id) ?? []

  async function handleLike(solutionId: string) {
    if (!user) {
      // If not authenticated, send user to login
      window.location.href = '/auth/login'
      return
    }

    // Ensure likeMutation exists and user.id is available
    if (!likeMutation || !user.id) return

    try {
      // Pass both solutionId and userId as required by the hook's type
      await likeMutation.mutateAsync({ solutionId, userId: user.id })
    } catch (err) {
      // handle or log error as needed
      // console.error('Like failed', err)
    }
  }

  return (
    <div className="max-w-[1280px] mx-auto px-container-margin-mobile md:px-container-margin-desktop py-8 animate-fade-in">
      {/* Hero */}
      <section className="mb-12">
        <div className="relative w-full h-[300px] rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-container via-surface-container-high to-secondary-fixed" />
          <div className="absolute inset-0 bg-gradient-to-t from-on-background/60 to-transparent flex flex-col justify-end p-8 md:p-12">
            <h1 className="font-bold text-headline-lg-mobile md:text-headline-lg text-white mb-2">Grassroots Solutions Library</h1>
            <p className="text-body-lg text-white/80 max-w-2xl">Discover and contribute to community-driven ecological innovations.</p>
          </div>
        </div>
      </section>

      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex gap-2 p-1.5 bg-surface-container rounded-2xl w-fit">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-5 py-2 rounded-xl font-label-caps text-label-caps capitalize transition-all',
                category === cat ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'
              )}
            >
              {cat === 'all' ? 'All Solutions' : cat}
            </button>
          ))}
        </div>

        {user ? (
          <Link to="/solutions/submit">
            <Button variant="primary">
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Submit Solution
            </Button>
          </Link>
        ) : (
          <Link to="/auth/login">
            <Button variant="primary">
              <span className="material-symbols-outlined text-[18px]">login</span>
              Sign in to Submit
            </Button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7 h-96 bg-surface-container rounded-3xl animate-pulse" />
          <div className="col-span-12 lg:col-span-5 h-96 bg-surface-container rounded-3xl animate-pulse" />
        </div>
      ) : (
        <>
          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-8 mb-16">
            {/* Featured */}
            {featured && (
              <div className="col-span-12 lg:col-span-7 bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant hover:shadow-lg transition-shadow">
                {featured.image_url && (
                  <div className="relative h-[350px]">
                    <img src={featured.image_url} alt={featured.title} className="w-full h-full object-cover" />
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-primary/20">
                      <span className="font-label-caps text-label-caps text-primary uppercase">{featured.category} Solution</span>
                    </div>
                  </div>
                )}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-[28px] text-on-surface mb-2">{featured.title}</h3>
                      <div className="flex items-center gap-3">
                        <Avatar src={featured.profiles?.avatar_url} name={featured.profiles?.full_name} size="xs" />
                        <span className="text-body-md text-on-surface-variant">
                          By {featured.profiles?.full_name} • {formatRelativeTime(featured.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      {featured.co2_reduction_pct && (
                        <div className="bg-primary-container text-on-primary-container p-4 rounded-2xl text-center shrink-0">
                          <div className="font-bold text-[28px]">{featured.co2_reduction_pct}%</div>
                          <div className="font-label-caps text-[10px]">CO2 Reduction</div>
                        </div>
                      )}

                      <div className="flex gap-2 items-center">
                        <Button variant="primary" onClick={() => handleLike(featured.id)}>
                          <span className="material-symbols-outlined">thumb_up</span>
                          {featured.like_count ? ` ${featured.like_count}` : ' Like'}
                        </Button>
                        <Badge variant="secondary">{featured.category}</Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-body-md text-on-surface-variant mb-8">{featured.description}</p>
                  <div className="flex gap-4">
                    <Button variant="primary">Download Guide</Button>
                    <Button variant="outline">Join Discussion</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Side */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
              {rest.slice(0, 1).map((sol) => (
                <div key={sol.id} className="bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant hover:shadow-lg transition-shadow flex-1">
                  {sol.image_url && (
                    <div className="h-48 relative">
                      <img src={sol.image_url} alt={sol.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between mb-4">
                      <h3 className="font-bold text-headline-md text-on-surface">{sol.title}</h3>
                      {sol.co2_reduction_pct && (
                        <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-xl font-bold">{sol.co2_reduction_pct}%</div>
                      )}
                    </div>
                    <p className="text-body-md text-on-surface-variant mb-6">{sol.description}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">View Workshop</Button>
                      <Button variant="primary" onClick={() => handleLike(sol.id)}>
                        <span className="material-symbols-outlined">thumb_up</span>
                        {sol.like_count ? ` ${sol.like_count}` : ' Like'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Stat card */}
              <div className="bg-tertiary-container text-on-tertiary-container rounded-3xl p-8 flex flex-col justify-center">
                <h4 className="font-label-caps text-label-caps opacity-80 mb-2">COMMUNITY MILESTONE</h4>
                <p className="font-bold text-[22px] mb-6">12,400kg of CO₂ sequestered this month across all library projects.</p>
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-on-tertiary-container">Join the movement</Button>
              </div>
            </div>
          </div>

          {/* Recently Added */}
          {rest.length > 1 && (
            <section>
              <h3 className="font-bold text-headline-md text-on-surface mb-8">Recently Added</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {rest.slice(1, 4).map((sol) => (
                  <div key={sol.id} className="bg-surface-container-low rounded-3xl border border-outline-variant p-6 hover:translate-y-[-4px] transition-transform">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <span className="material-symbols-outlined">eco</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-[18px]">{sol.title}</h4>
                      <Badge variant="secondary">{sol.category}</Badge>
                    </div>
                    <p className="text-body-md text-on-surface-variant mb-6 text-sm line-clamp-2">{sol.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
                      <span className={cn('font-label-caps text-label-caps uppercase', sol.category === 'household' ? 'text-primary' : sol.category === 'community' ? 'text-secondary' : 'text-tertiary')}>
                        {sol.category}
                      </span>
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleLike(sol.id)} className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
                          <span className="material-symbols-outlined">thumb_up</span>
                          <span className="font-label-caps text-label-caps">{sol.like_count ?? 0}</span>
                        </button>
                        <span className="material-symbols-outlined text-outline-variant">arrow_forward</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
