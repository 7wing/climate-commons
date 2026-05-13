import { useState } from 'react'
import { usePolicies, useSupportPolicy } from '@/hooks/usePolicies'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import SearchBar from '@/components/ui/SearchBar'
import { formatRelativeTime } from '@/utils/formatDate'
import { cn } from '@/utils/cn'

const SCOPES = ['all', 'local', 'regional', 'national', 'international']

const scopeIcons: Record<string, string> = { local: 'location_on', regional: 'map', national: 'public', international: 'language' }
const scopeColors: Record<string, string> = { local: 'text-primary', regional: 'text-secondary', national: 'text-tertiary', international: 'text-secondary' }

export default function Policy() {
  const [scope, setScope] = useState('all')
  const [search, setSearch] = useState('')
  const { data: policies, isLoading } = usePolicies(scope === 'all' ? undefined : scope)
  const { user } = useAuth()
  const supportMutation = useSupportPolicy()

  const filtered = policies?.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-[1280px] mx-auto px-container-margin-mobile md:px-container-margin-desktop py-8 animate-fade-in pb-24">
      {/* Hero */}
      <section className="mb-12">
        <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container via-surface-container to-secondary-fixed" />
          <div className="absolute inset-0 bg-gradient-to-t from-on-background/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <span className="font-label-caps text-label-caps text-primary-fixed bg-primary/20 backdrop-blur-md px-3 py-1 rounded-full mb-3 inline-block">Policy Hub</span>
            <h1 className="font-bold text-headline-lg-mobile md:text-headline-lg text-white max-w-2xl">Shape the future through informed legislative action.</h1>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="mb-10 flex flex-col md:flex-row gap-4">
        <SearchBar className="flex-grow" placeholder="Search legislation, bills, or keywords..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {SCOPES.map((s) => (
            <button key={s} onClick={() => setScope(s)} className={cn('whitespace-nowrap px-5 h-12 rounded-full font-label-caps capitalize transition-all', scope === s ? 'bg-primary text-on-primary' : 'border border-outline text-on-surface-variant hover:bg-surface-container')}>
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Policy List */}
      <section className="space-y-6 mb-16">
        <h2 className="font-bold text-headline-md text-on-surface">Recent Endorsements & Updates</h2>
        {isLoading ? (
          <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-40 bg-surface-container rounded-3xl animate-pulse" />)}</div>
        ) : filtered?.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 block">policy</span>
            <p>No policy updates found.</p>
          </div>
        ) : (
          filtered?.map((policy) => (
            <article key={policy.id} className="bg-surface-container-low rounded-3xl p-6 border border-outline-variant/30 flex flex-col md:flex-row gap-6 hover:shadow-sm transition-all group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-surface-container-high">
                <span className={`material-symbols-outlined ${scopeColors[policy.scope] ?? 'text-primary'}`}>{scopeIcons[policy.scope] ?? 'policy'}</span>
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-label-caps text-label-caps uppercase tracking-widest ${scopeColors[policy.scope] ?? 'text-primary'}`}>{policy.scope} Update</span>
                  <span className="text-outline-variant">•</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">{formatRelativeTime(policy.published_at)}</span>
                  {policy.is_verified && (
                    <span className="flex items-center gap-1 bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full font-label-caps text-label-caps">
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      Verified
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-headline-md mb-2 group-hover:text-primary transition-colors">{policy.title}</h3>
                <p className="text-body-md text-on-surface-variant mb-4 line-clamp-2">{policy.body}</p>
                <div className="flex flex-wrap gap-4">
                  {policy.source_url && (
                    <a href={policy.source_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary font-label-caps hover:underline">
                      <span className="material-symbols-outlined text-[16px]">link</span> Official Source
                    </a>
                  )}
                  {policy.pdf_url && (
                    <a href={policy.pdf_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-secondary font-label-caps hover:underline">
                      <span className="material-symbols-outlined text-[16px]">description</span> Full Text (PDF)
                    </a>
                  )}
                </div>
              </div>
              {user && (
                <div className="shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    loading={supportMutation.isPending}
                    onClick={() => supportMutation.mutate({ policyId: policy.id, userId: user.id })}
                  >
                    Support ({policy.support_count})
                  </Button>
                </div>
              )}
            </article>
          ))
        )}
      </section>

      {/* Transparency Banner */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-primary text-on-primary p-8 rounded-3xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-bold text-headline-md md:text-headline-lg mb-4">Policy Transparency Report</h3>
            <p className="text-body-lg mb-6 opacity-90 max-w-lg">We verify every policy update through official government registers and trusted third-party environmental auditing firms.</p>
            <Button variant="secondary" className="bg-white text-primary hover:bg-on-primary-container">
              Download Q3 Report <span className="material-symbols-outlined text-[18px]">download</span>
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed-dim/20 rounded-full blur-3xl -mr-20 -mt-20" />
        </div>
        <div className="bg-surface-container-high p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <span className="material-symbols-outlined text-primary text-4xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            <h4 className="font-bold text-headline-md mb-2">Trust Score</h4>
            <p className="text-body-md text-on-surface-variant">Community-sourced verification with 98% accuracy on legislative tracking.</p>
          </div>
          <div className="text-4xl font-bold text-primary mt-6">98.4%</div>
        </div>
      </section>
    </div>
  )
}