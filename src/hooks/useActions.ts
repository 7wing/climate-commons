import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Action } from '@/types'

const KEY = 'actions'

export function useActions(category?: string) {
  return useQuery({
    queryKey: [KEY, category],
    queryFn: async () => {
      let query = supabase
        .from('actions')
        .select('*, profiles(id, username, full_name, avatar_url)')
        .gte('event_date', new Date().toISOString())
        .order('is_featured', { ascending: false })
        .order('event_date', { ascending: true })

      if (category && category !== 'all') query = query.eq('category', category)

      const { data, error } = await query
      if (error) throw error
      return data as Action[]
    },
  })
}

export function useRSVP() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ actionId, userId, status }: { actionId: string; userId: string; status: string }) => {
      const { error } = await supabase
        .from('action_rsvps')
        .upsert({ action_id: actionId, user_id: userId, status })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}