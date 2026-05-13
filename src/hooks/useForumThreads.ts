import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { ForumThread } from '@/types'

const THREADS_KEY = 'forum_threads'

export function useForumThreads(category?: string) {
  return useQuery({
    queryKey: [THREADS_KEY, category],
    queryFn: async () => {
      let query = supabase
        .from('forum_threads')
        .select('*, profiles(id, username, full_name, avatar_url, role)')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })

      if (category && category !== 'all') {
        query = query.eq('category', category)
      }

      const { data, error } = await query
      if (error) throw error
      return data as ForumThread[]
    },
  })
}

export function useForumThread(id: string) {
  return useQuery({
    queryKey: [THREADS_KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_threads')
        .select('*, profiles(id, username, full_name, avatar_url, role)')
        .eq('id', id)
        .single()
      if (error) throw error
      await supabase.rpc('increment_thread_views', { thread_id: id })
      return data as ForumThread
    },
    enabled: !!id,
  })
}

export function useCreateThread() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (thread: Partial<ForumThread>) => {
      const { data, error } = await supabase.from('forum_threads').insert(thread).select().single()
      if (error) throw error
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [THREADS_KEY] }),
  })
}

export function useLikeThread() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ threadId, userId }: { threadId: string; userId: string }) => {
      const { error } = await supabase.from('thread_likes').insert({ thread_id: threadId, user_id: userId })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [THREADS_KEY] }),
  })
}