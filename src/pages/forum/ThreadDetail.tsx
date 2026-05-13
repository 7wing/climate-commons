import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { useForumThread } from '@/hooks/useForumThreads'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { useQueryClient } from '@tanstack/react-query'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { formatDate, formatRelativeTime } from '@/utils/formatDate'

export default function ThreadDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: thread, isLoading } = useForumThread(id!)
  const { user, profile } = useAuth()
  const [reply, setReply] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const qc = useQueryClient()

  async function handleReply(e: React.FormEvent) {
    e.preventDefault()
    if (!reply.trim() || !user || !id) return
    setSubmitting(true)
    await supabase.from('forum_replies').insert({ thread_id: id, author_id: user.id, body: reply.trim() })
    setReply('')
    setSubmitting(false)
    qc.invalidateQueries({ queryKey: ['forum_replies', id] })
  }

  if (isLoading) return (
    <div className="max-w-3xl mx-auto px-container-margin-mobile py-16 animate-pulse">
      <div className="h-8 bg-surface-container rounded-xl w-3/4 mb-4" />
      <div className="h-4 bg-surface-container rounded-xl w-1/2 mb-8" />
      <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-4 bg-surface-container rounded-xl" />)}</div>
    </div>
  )

  if (!thread) return (
    <div className="text-center py-32 text-on-surface-variant">
      <span className="material-symbols-outlined text-6xl mb-4 block">error_outline</span>
      <p className="text-body-lg">Thread not found.</p>
      <Link to="/forum" className="mt-4 inline-block"><Button variant="primary" size="sm">Back to Forum</Button></Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-container-margin-mobile md:px-container-margin-desktop py-8 animate-fade-in">
      <Link to="/forum" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 font-label-caps text-label-caps">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        BACK TO FORUM
      </Link>

      {/* Thread */}
      <article className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/20 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Avatar src={thread.profiles?.avatar_url} name={thread.profiles?.full_name} size="md" />
          <div>
            <p className="font-bold text-body-md">{thread.profiles?.full_name ?? thread.profiles?.username}</p>
            <p className="font-label-caps text-label-caps text-outline-variant">
                {formatDate(thread.created_at)} · {formatRelativeTime(thread.created_at)}
            </p>
          </div>
          {thread.is_verified && (
            <div className="ml-auto flex items-center gap-1 bg-tertiary-fixed px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-[14px] text-on-tertiary-fixed-variant" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="font-label-caps text-label-caps text-on-tertiary-fixed-variant">Verified</span>
            </div>
          )}
        </div>
        <h1 className="font-bold text-headline-lg-mobile md:text-headline-lg mb-6">{thread.title}</h1>
        <p className="text-body-lg text-on-surface-variant leading-relaxed">{thread.body}</p>
        <div className="flex items-center gap-6 mt-8 pt-6 border-t border-outline-variant/20">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined">favorite</span>
            <span className="font-label-caps text-label-caps">{thread.like_count} likes</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined">chat_bubble</span>
            <span className="font-label-caps text-label-caps">{thread.reply_count} replies</span>
          </div>
        </div>
      </article>

      {/* Reply Form */}
      {user ? (
        <form onSubmit={handleReply} className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/20 mb-8">
          <div className="flex items-start gap-4">
            <Avatar src={profile?.avatar_url} name={profile?.full_name} size="sm" />
            <div className="flex-1">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                className="w-full bg-surface-container rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-primary text-body-md p-4 resize-none"
              />
              <div className="flex justify-end mt-3">
                <Button type="submit" loading={submitting} disabled={!reply.trim()}>
                  Post Reply
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/20 mb-8 text-center">
          <p className="text-body-md text-on-surface-variant mb-4">Sign in to join the discussion.</p>
          <Link to="/auth/login"><Button variant="primary">Sign In</Button></Link>
        </div>
      )}
    </div>
  )
}