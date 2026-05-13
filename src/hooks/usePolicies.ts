import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { PolicyUpdate } from '@/types'

const KEY = 'policy_updates'

export function usePolicies(scope?: string) {
  return useQuery({
    queryKey: [KEY, scope],
    queryFn: async () => {
      let query = supabase
        .from('policy_updates')
        .select('*, profiles(id, username, full_name, avatar_url)')
        .order('published_at', { ascending: false })

      if (scope && scope !== 'all') query = query.eq('scope', scope)

      const { data, error } = await query
      if (error) throw error
      return data as PolicyUpdate[]
    },
  })
}

export function useSupportPolicy() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ policyId, userId }: { policyId: string; userId: string }) => {
      const { error } = await supabase
        .from('policy_supports')
        .insert({ policy_id: policyId, user_id: userId })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}