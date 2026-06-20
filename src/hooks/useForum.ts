import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Tables, TablesInsert } from '@/types/database'

export type ForumThread = Tables<'forum_threads'>
export type ForumCategory = Tables<'forum_categories'>
export type ForumReply = Tables<'forum_replies'>

export function useForumTopics() {
  return useQuery({
    queryKey: ['forum', 'topics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_threads')
        .select('*, forum_categories(*)')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useForumTopicById(id: string) {
  return useQuery({
    queryKey: ['forum', 'topic', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_threads')
        .select('*, forum_categories(*), forum_replies(*)')
        .eq('id', id)
        .is('deleted_at', null)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useForumCategories() {
  return useQuery({
    queryKey: ['forum', 'categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('forum_categories')
        .select('*')
        .is('deleted_at', null)
        .order('name', { ascending: true })
      if (error) throw error
      return data
    },
  })
}

export function useCreateForumTopic() {
  return useMutation({
    mutationFn: async (
      topic: Omit<
        TablesInsert<'forum_threads'>,
        'id' | 'created_at' | 'updated_at' | 'deleted_at'
      >,
    ) => {
      const { data, error } = await supabase
        .from('forum_threads')
        .insert(topic)
        .select()
        .single()
      if (error) throw error
      return data
    },
  })
}
