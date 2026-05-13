import { Link } from 'react-router-dom'
import StatCard from '@/components/ui/StatCard'
import Button from '@/components/ui/Button'
import ThreadCard from '@/components/forum/ThreadCard'
import { useForumThreads } from '@/hooks/useForumThreads'
import { useResearchProjects } from '@/hooks/useResearchProjects'

export default function Home() {
  const { data: threads } = useForumThreads()
  const { data: projects } = useResearchProjects()
  const featuredProject = projects?.find((p) => p.is_featured) ?? projects?.[0]
  const recentThreads = threads?.slice(0, 3) ?? []

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative h-[600px] md:h-[700px] flex items-center justify-center px-container-margin-mobile overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-primary-container via-surface-container-high to-secondary-fixed" />
        </div>
        <div className="relative z-10 max-w-3xl text-center">
          <div className="bg-surface-container-lowest/90 backdrop-blur-md p-8 md:p-12 rounded-[32px] border border-outline-variant/30 shadow-[0_8px_32px_rgba(34,139,34,0.08)]">
            <p className="font-label-caps text-label-caps text-primary mb-4 block">COMMUNITY DRIVEN CONSERVATION</p>
            <h1 className="font-bold text-headline-lg-mobile md:text-headline-lg mb-4 text-on-surface">
              Protecting our planet together.
            </h1>
            <p className="text-body-lg text-on-surface-variant mb-8 max-w-xl mx-auto">
              Join a global community dedicated to transparent data, local action, and policy transformation. Every step counts toward a flourishing future.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/research">
                <Button variant="primary" size="md">
                  <span className="material-symbols-outlined text-[18px]">database</span>
                  Research
                </Button>
              </Link>
              <Link to="/solutions">
                <Button variant="outline" size="md">
                  <span className="material-symbols-outlined text-[18px]">eco</span>
                  Solutions
                </Button>
              </Link>
              <Link to="/forum">
                <Button variant="secondary" size="md">
                  <span className="material-symbols-outlined text-[18px]">forum</span>
                  Forum
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bento */}
      <section className="py-section-gap px-container-margin-mobile md:px-container-margin-desktop max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <StatCard icon="park" value="12.4k Hectares" label="Reforested this month by our active local chapters." iconColor="text-primary" />
          <div className="bg-primary-container p-6 rounded-3xl text-on-primary-container">
            <span className="material-symbols-outlined text-4xl mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
            <h3 className="font-bold text-headline-md mb-2">50k Members</h3>
            <p className="text-body-md opacity-90">Community advocates sharing research and policy insights daily.</p>
          </div>
          <StatCard icon="water_drop" value="89% Purity" label="Average improvement in local water systems via community policy." iconColor="text-secondary" />
        </div>
      </section>

      {/* Featured Project */}
      {featuredProject && (
        <section className="pb-section-gap px-container-margin-mobile md:px-container-margin-desktop max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row bg-surface-container-lowest rounded-[32px] overflow-hidden border border-outline-variant/30 shadow-[0_4px_20px_rgba(34,139,34,0.04)]">
            <div className="md:w-1/2 h-64 md:h-auto bg-primary-container">
              {featuredProject.image_url && (
                <img src={featuredProject.image_url} alt={featuredProject.title} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <span className="font-label-caps text-label-caps text-primary mb-4 block">FEATURED RESEARCH</span>
              <h3 className="font-bold text-headline-md md:text-headline-lg mb-4">{featuredProject.title}</h3>
              <p className="text-body-md text-on-surface-variant mb-8">{featuredProject.description}</p>
              <Link to={`/research/${featuredProject.id}`}>
                <Button variant="primary">
                  READ FULL REPORT
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Community Forum Preview */}
      <section className="pb-section-gap px-container-margin-mobile md:px-container-margin-desktop max-w-[1280px] mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-bold text-headline-lg text-on-surface mb-2">Community Exchange</h2>
            <p className="text-body-md text-on-surface-variant">Knowledge sharing from the field.</p>
          </div>
          <Link to="/forum" className="text-primary font-label-caps text-label-caps flex items-center gap-2 hover:underline">
            View Forum <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentThreads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} />
          ))}
          {recentThreads.length === 0 && (
            <div className="col-span-3 text-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 block">forum</span>
              <p className="text-body-lg">No threads yet. Be the first to start a discussion!</p>
              <Link to="/forum" className="mt-4 inline-block"><Button variant="primary" size="sm">Start a Discussion</Button></Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}