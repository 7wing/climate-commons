import { Link } from 'react-router-dom'
import Badge from '@/components/ui/Badge'
import type { ResearchProject } from '@/types'
import { cn } from '@/utils/cn'

const categoryIcons: Record<string, string> = {
  marine: 'water',
  urban: 'forest',
  soil: 'grass',
  arctic: 'ac_unit',
  fauna: 'pets',
  energy: 'solar_power',
  water: 'water_drop',
}

const statusColors: Record<string, 'primary' | 'secondary' | 'neutral'> = {
  enrolling: 'primary',
  active: 'secondary',
  data_collection: 'secondary',
  completed: 'neutral',
  paused: 'neutral',
}

interface ProjectCardProps {
  project: ResearchProject
  featured?: boolean
}

export default function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <Link
      to={`/research/${project.id}`}
      className={cn(
        'group block bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/20 hover:shadow-[0_4px_20px_rgba(34,139,34,0.08)] transition-all duration-300',
        featured ? 'flex flex-col md:flex-row' : ''
      )}
    >
      <div className={cn('relative overflow-hidden', featured ? 'md:w-1/2 h-64 md:h-auto' : 'h-48')}>
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              {categoryIcons[project.category] ?? 'science'}
            </span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <Badge variant={statusColors[project.status] ?? 'neutral'}>
            {project.status.replace('_', ' ')}
            </Badge>

        </div>
      </div>

      <div className={cn('p-6', featured ? 'md:w-1/2 flex flex-col justify-between' : '')}>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-sm">{categoryIcons[project.category] ?? 'science'}</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">{project.category}</span>
          </div>
          <h3 className="font-bold text-headline-md text-on-surface mb-2">{project.title}</h3>
          <p className="text-body-md text-on-surface-variant line-clamp-3 mb-4">{project.description}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">group</span>
            <span className="font-label-caps text-label-caps">{project.participant_count} members</span>
          </div>
          <span className="font-label-caps text-label-caps text-primary group-hover:underline">View →</span>
        </div>
      </div>
    </Link>
  )
}