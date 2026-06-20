import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Tables, TablesInsert } from '@/types/database'

export type ClimateAction = Tables<'actions'>
export type ActionParticipant = Tables<'action_participants'>

export function useActionsList() {
  return useQuery({
    queryKey: ['actions', 'list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('actions')
        .select('*')
        .is('deleted_at', null)
        .order('event_date', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useActionById(id: string) {
  return useQuery({
    queryKey: ['actions', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('actions')
        .select('*, action_participants(*)')
        .eq('id', id)
        .is('deleted_at', null)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useActionParticipants(actionId: string) {
  return useQuery({
    queryKey: ['actions', 'participants', actionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('action_participants')
        .select('*')
        .eq('action_id', actionId)
      if (error) throw error
      return data
    },
    enabled: !!actionId,
  })
}

export function useCreateAction() {
  return useMutation({
    mutationFn: async (
      action: Omit<
        TablesInsert<'actions'>,
        'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'approved_at' | 'approved_by' | 'review_notes' | 'submitted_at'
      >,
    ) => {
      const { data, error } = await supabase
        .from('actions')
        .insert(action)
        .select()
        .single()
      if (error) throw error
      return data
    },
  })
}

export function useRegisterForAction() {
  return useMutation({
    mutationFn: async (
      registration: Omit<
        TablesInsert<'action_participants'>,
        'id' | 'created_at' | 'updated_at' | 'joined_at'
      >,
    ) => {
      const { data, error } = await supabase
        .from('action_participants')
        .insert({ ...registration, joined_at: new Date().toISOString() })
        .select()
        .single()
      if (error) throw error
      return data
    },
  })
}
