import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Solution } from '@/types'

const KEY = 'solutions'

export function useSolutions(category?: string) {
  return useQuery({
    queryKey: [KEY, category],
    queryFn: async () => {
      let query = supabase
        .from('solutions')
        .select('*, profiles(id, username, full_name, avatar_url)')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (category && category !== 'all') query = query.eq('category', category)

      const { data, error } = await query
      if (error) throw error
      return data as Solution[]
    },
  })
}

export function useLikeSolution() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ solutionId, userId }: { solutionId: string; userId: string }) => {
      const { error } = await supabase
        .from('solution_likes')
        .insert({ solution_id: solutionId, user_id: userId })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}