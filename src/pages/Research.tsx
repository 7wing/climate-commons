import { useState } from 'react'
import ProjectCard from '@/components/research/ProjectCard'
import SearchBar from '@/components/ui/SearchBar'
import Button from '@/components/ui/Button'
import { useResearchProjects } from '@/hooks/useResearchProjects'
import { cn } from '@/utils/cn'

const CATEGORIES = ['all', 'marine', 'urban', 'soil', 'arctic', 'fauna', 'energy', 'water']
const STATUSES = ['all', 'enrolling', 'active', 'data_collection', 'completed']

export default function Research() {
  const [category, setCategory] = useState('all')
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const { data: projects, isLoading } = useResearchProjects(
    category === 'all' ? undefined : category,
    status === 'all' ? undefined : status
  )

  const featured = projects?.find((p) => p.is_featured)
  const rest = projects?.filter((p) => !p.is_featured).filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-[1280px] mx-auto px-container-margin-mobile md:px-container-margin-desktop py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-10">
        <p className="font-label-caps text-label-caps text-primary mb-2">OPEN SCIENCE</p>
        <h1 className="font-bold text-headline-lg text-on-surface mb-4">Ongoing Research</h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl">Active community-led scientific explorations in ecological resilience.</p>
      </div>

      {/* Search */}
      <SearchBar className="max-w-2xl mb-8" placeholder="Find research projects..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} className={cn('px-4 py-2 rounded-full font-label-caps text-label-caps transition-all capitalize', category === cat ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest')}>
              {cat}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={cn('px-4 py-2 rounded-full font-label-caps text-label-caps transition-all capitalize', status === s ? 'bg-secondary-container text-on-secondary-container' : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container')}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-72 bg-surface-container rounded-3xl animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* Featured */}
          {featured && (
            <div className="mb-8">
              <ProjectCard project={featured} featured />
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest?.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {/* Submit CTA */}
          <div className="mt-12 bg-primary-container p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6 text-on-primary-container">
            <div className="flex-1">
              <h3 className="font-bold text-headline-md mb-2">Have a research idea?</h3>
              <p className="text-body-md opacity-90">We provide tools and network to start your own pilot study.</p>
            </div>
            <Button variant="secondary" className="bg-surface text-primary hover:bg-surface-container-high whitespace-nowrap">
              Submit Proposal
            </Button>
          </div>
        </>
      )}
    </div>
  )
}