import { useParams, Link } from 'react-router-dom'
import { useResearchProject, useJoinProject } from '@/hooks/useResearchProjects'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import { formatDate } from '@/utils/formatDate'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: project, isLoading } = useResearchProject(id!)
  const { user } = useAuth()
  const joinMutation = useJoinProject()

  if (isLoading) return <div className="max-w-4xl mx-auto px-container-margin-mobile py-16"><div className="h-96 bg-surface-container rounded-3xl animate-pulse" /></div>
  if (!project) return <div className="text-center py-32"><p>Project not found.</p></div>

  return (
    <div className="max-w-4xl mx-auto px-container-margin-mobile md:px-container-margin-desktop py-8 animate-fade-in">
      <Link to="/research" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 font-label-caps text-label-caps">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        BACK TO RESEARCH
      </Link>

      {/* Hero Image */}
      {project.image_url && (
        <div className="h-80 rounded-3xl overflow-hidden mb-8">
          <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{project.status.replace('_', ' ')}</Badge>
            <Badge variant="neutral">{project.category}</Badge>
          </div>
          <h1 className="font-bold text-headline-lg mb-4">{project.title}</h1>
          <p className="text-body-lg text-on-surface-variant leading-relaxed mb-6">{project.description}</p>

          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-surface-container rounded-full font-label-caps text-label-caps text-on-surface-variant">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-surface-container p-6 rounded-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Avatar src={project.profiles?.avatar_url} name={project.profiles?.full_name} size="sm" />
              <div>
                <p className="font-bold text-body-md">{project.profiles?.full_name}</p>
                <p className="font-label-caps text-label-caps text-outline-variant">Project Lead</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-body-md text-on-surface-variant">Participants</span>
                <span className="font-bold">{project.participant_count} / {project.max_participants}</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${(project.participant_count / project.max_participants) * 100}%` }} />
              </div>
              {project.start_date && (
                <div className="flex justify-between">
                  <span className="text-body-md text-on-surface-variant">Started</span>
                  <span className="font-label-caps text-label-caps">{formatDate(project.start_date)}</span>
                </div>
              )}
            </div>

            {user ? (
              <Button
                variant="primary"
                className="w-full"
                loading={joinMutation.isPending}
                onClick={() => joinMutation.mutate({ projectId: project.id, userId: user.id })}
              >
                Join Project
              </Button>
            ) : (
              <Link to="/auth/login" className="block">
                <Button variant="primary" className="w-full">Sign In to Join</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}