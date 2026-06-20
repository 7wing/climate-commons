import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'

export type PolicyUpdate = Tables<'policy_updates'>
export type PolicyEndorsement = Tables<'policy_endorsements'>
export type PolicyReport = Tables<'policy_reports'>

export function usePolicies() {
  return useQuery({
    queryKey: ['policy', 'list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policy_updates')
        .select('*')
        .is('deleted_at', null)
        .order('published_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function usePolicyById(id: string) {
  return useQuery({
    queryKey: ['policy', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policy_updates')
        .select('*, policy_endorsements(*)')
        .eq('id', id)
        .is('deleted_at', null)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function usePolicyEndorsements(policyId: string) {
  return useQuery({
    queryKey: ['policy', 'endorsements', policyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('policy_endorsements')
        .select('*')
        .eq('policy_id', policyId)
      if (error) throw error
      return data
    },
    enabled: !!policyId,
  })
}
