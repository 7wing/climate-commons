import { useState } from 'react'
import { useActions, useRSVP } from '@/hooks/useActions'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatEventDate, formatEventTime } from '@/utils/formatDate'
import { cn } from '@/utils/cn'

const CATEGORIES = ['all', 'conservation', 'cleanup', 'energy', 'advocacy', 'workshop', 'sustainability']

const categoryColors: Record<string, string> = {
  conservation: 'text-primary',
  cleanup: 'text-secondary',
  energy: 'text-secondary',
  advocacy: 'text-on-secondary-fixed-variant',
  workshop: 'text-tertiary',
  sustainability: 'text-tertiary',
}

export default function Actions() {
  const [category, setCategory] = useState('all')
  const { data: actions, isLoading } = useActions(category === 'all' ? undefined : category)
  const { user } = useAuth()
  const rsvpMutation = useRSVP()

  const featured = actions?.find((a) => a.is_featured) ?? actions?.[0]
  const rest = actions?.slice(1) ?? []

  return (
    <div className="max-w-[1280px] mx-auto px-container-margin-mobile md:px-container-margin-desktop py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="font-bold text-headline-lg text-on-surface mb-2">Real-World Actions</h1>
          <p className="text-body-md text-on-surface-variant max-w-xl">Join local climate initiatives and connect with community members taking tangible steps.</p>
        </div>
        <div className="flex items-center bg-surface-container rounded-full p-1.5">
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container font-label-caps text-label-caps">
            <span className="material-symbols-outlined text-[18px]">list</span> LIST
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-full text-on-surface-variant font-label-caps text-label-caps">
            <span className="material-symbols-outlined text-[18px]">map</span> MAP
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="overflow-x-auto pb-2 mb-10 scrollbar-hide">
        <div className="flex gap-3 min-w-max">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} className={cn('px-5 py-2.5 rounded-full font-label-caps text-label-caps capitalize transition-all', category === cat ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-primary-fixed')}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <div className="md:col-span-8 h-80 bg-surface-container rounded-3xl animate-pulse" />
          <div className="md:col-span-4 h-80 bg-surface-container rounded-3xl animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Featured */}
          {featured && (
            <div className="md:col-span-8 group relative bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant hover:shadow-lg transition-all">
              {featured.image_url && (
                <div className="aspect-video w-full overflow-hidden">
                  <img src={featured.image_url} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="tertiary">HIGH IMPACT</Badge>
                  <div className="flex items-center gap-1 text-on-surface-variant font-label-caps text-label-caps">
                    <span className="material-symbols-outlined text-[16px]">group</span>
                    {featured.current_count} JOINED
                  </div>
                </div>
                <h3 className="font-bold text-headline-md text-on-surface mb-4">{featured.title}</h3>
                <div className="flex flex-wrap gap-5 text-on-surface-variant mb-6">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">calendar_today</span>
                    <span className="text-body-md">{formatEventDate(featured.event_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">schedule</span>
                    <span className="text-body-md">{formatEventTime(featured.event_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <span className="text-body-md">{featured.location}</span>
                  </div>
                </div>
                {user ? (
                  <Button onClick={() => rsvpMutation.mutate({ actionId: featured.id, userId: user.id, status: 'going' })} loading={rsvpMutation.isPending}>
                    JOIN THIS ACTION
                  </Button>
                ) : null}
              </div>
            </div>
          )}

          {/* Small cards */}
          {rest.slice(0, featured ? 3 : 4).map((action) => (
            <div key={action.id} className={cn('group bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant flex flex-col hover:shadow-lg transition-all', featured ? 'md:col-span-4' : 'md:col-span-3')}>
              {action.image_url && (
                <div className="h-48 overflow-hidden">
                  <img src={action.image_url} alt={action.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-3">
                  <span className={`font-label-caps text-label-caps ${categoryColors[action.category] ?? 'text-primary'}`}>{action.category.toUpperCase()}</span>
                  <div className="flex items-center gap-1 text-on-surface-variant font-label-caps text-label-caps">
                    <span className="material-symbols-outlined text-[16px]">group</span> {action.current_count}
                  </div>
                </div>
                <h3 className="font-bold text-[20px] text-on-surface mb-4">{action.title}</h3>
                <div className="space-y-2 mb-6 flex-grow">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
                    <span className="text-body-md">{formatEventDate(action.event_date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px] text-primary">schedule</span>
                    <span className="text-body-md">{formatEventTime(action.event_date)}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" size="sm">VIEW DETAILS</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}