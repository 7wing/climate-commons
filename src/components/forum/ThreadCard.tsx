import { Link } from 'react-router-dom'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { formatRelativeTime } from '@/utils/formatDate'
import type { ForumThread } from '@/types'
import { cn } from '@/utils/cn'

const categoryColors: Record<string, 'primary' | 'secondary' | 'tertiary' | 'neutral'> = {
  research: 'secondary',
  policy: 'tertiary',
  action: 'primary',
  solutions: 'primary',
  general: 'neutral',
}

interface ThreadCardProps {
  thread: ForumThread
  className?: string
}

export default function ThreadCard({ thread, className }: ThreadCardProps) {
  return (
    <Link
      to={`/forum/${thread.id}`}
      className={cn(
        'block bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/20 hover:border-primary/30 hover:scale-[1.005] transition-all duration-300 group relative overflow-hidden',
        className
      )}
    >
      <div className="absolute left-0 top-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-l-3xl" />
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar src={thread.profiles?.avatar_url} name={thread.profiles?.full_name ?? thread.profiles?.username} size="sm" />
          <div>
            <p className="font-bold text-body-md text-on-surface">
              {thread.profiles?.full_name ?? thread.profiles?.username}
            </p>
            <p className="font-label-caps text-label-caps text-outline-variant">{formatRelativeTime(thread.created_at).toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={categoryColors[thread.category] ?? 'neutral'}>{thread.category}</Badge>
          {thread.is_verified && (
            <Badge variant="tertiary">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              Verified
            </Badge>
          )}
        </div>
      </div>

      <h3 className="font-bold text-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors">
        {thread.title}
      </h3>
      <p className="text-body-md text-on-surface-variant line-clamp-2 mb-4">{thread.body}</p>

      <div className="flex items-center gap-6 pt-4 border-t border-outline-variant/20">
        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
          <span className="font-label-caps text-label-caps">{thread.reply_count} REPLIES</span>
        </div>
        <div className="flex items-center gap-1.5 text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px]">favorite</span>
          <span className="font-label-caps text-label-caps">{thread.like_count}</span>
        </div>
        <div className="flex items-center gap-1.5 text-on-surface-variant ml-auto">
          <span className="material-symbols-outlined text-[18px]">visibility</span>
          <span className="font-label-caps text-label-caps">{thread.view_count}</span>
        </div>
      </div>
    </Link>
  )
}