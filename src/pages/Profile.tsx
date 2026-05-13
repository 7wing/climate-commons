import { useAuth } from '@/hooks/useAuth'
import { useForumThreads } from '@/hooks/useForumThreads'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatDate } from '@/utils/formatDate'

export default function Profile() {
  const { profile, user } = useAuth()
  const { data: threads } = useForumThreads()
  const myThreads = threads?.filter((t) => t.author_id === user?.id) ?? []

  if (!profile) return null

  return (
    <div className="max-w-4xl mx-auto px-container-margin-mobile md:px-container-margin-desktop py-8 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/20 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar src={profile.avatar_url} name={profile.full_name} size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-bold text-headline-md">{profile.full_name ?? profile.username}</h1>
              <Badge variant={profile.role === 'researcher' ? 'secondary' : 'neutral'}>{profile.role}</Badge>
            </div>
            <p className="font-label-caps text-label-caps text-outline-variant mb-2">@{profile.username}</p>
            {profile.bio && <p className="text-body-md text-on-surface-variant mb-4">{profile.bio}</p>}
            <div className="flex flex-wrap items-center gap-6 text-on-surface-variant">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  <span className="text-body-md">{profile.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                <span className="text-body-md">Joined {formatDate(profile.created_at)}</span>
              </div>
            </div>
          </div>
          <Button variant="secondary" size="sm">Edit Profile</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-outline-variant/20">
          <div className="text-center">
            <p className="font-bold text-headline-md text-primary">{myThreads.length}</p>
            <p className="font-label-caps text-label-caps text-on-surface-variant">THREADS</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-headline-md text-primary">{profile.reputation}</p>
            <p className="font-label-caps text-label-caps text-on-surface-variant">REPUTATION</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-headline-md text-primary">{myThreads.reduce((sum, t) => sum + t.like_count, 0)}</p>
            <p className="font-label-caps text-label-caps text-on-surface-variant">TOTAL LIKES</p>
          </div>
        </div>
      </div>

      {/* My Threads */}
      <div>
        <h2 className="font-bold text-headline-md mb-6">My Discussions</h2>
        {myThreads.length === 0 ? (
          <div className="text-center py-16 bg-surface-container rounded-3xl text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">forum</span>
            <p className="text-body-lg">You haven't started any discussions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myThreads.map((thread) => (
              <div key={thread.id} className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/20 flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-bold text-body-md mb-1">{thread.title}</p>
                  <p className="font-label-caps text-label-caps text-outline-variant">{formatDate(thread.created_at)}</p>
                </div>
                <div className="flex items-center gap-4 text-on-surface-variant">
                  <span className="flex items-center gap-1 font-label-caps text-label-caps">
                    <span className="material-symbols-outlined text-[16px]">chat_bubble</span> {thread.reply_count}
                  </span>
                  <span className="flex items-center gap-1 font-label-caps text-label-caps">
                    <span className="material-symbols-outlined text-[16px]">favorite</span> {thread.like_count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}