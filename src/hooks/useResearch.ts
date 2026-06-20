import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Tables, TablesInsert } from '@/types/database'

export type ResearchProject = Tables<'research_projects'>
export type ResearchCategory = Tables<'research_categories'>
export type ResearchParticipant = Tables<'research_participants'>
export type ResearchUpdate = Tables<'research_updates'>
export type ResearchAttachment = Tables<'research_attachments'>

export function useResearchList() {
  return useQuery({
    queryKey: ['research', 'list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('research_projects')
        .select('*, research_categories(*)')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useResearchById(id: string) {
  return useQuery({
    queryKey: ['research', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('research_projects')
        .select(
          '*, research_categories(*), research_participants(*), research_updates(*), research_attachments(*)'
        )
        .eq('id', id)
        .is('deleted_at', null)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useResearchCategories() {
  return useQuery({
    queryKey: ['research', 'categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('research_categories')
        .select('*')
        .is('deleted_at', null)
        .order('name', { ascending: true })
      if (error) throw error
      return data
    },
  })
}

export function useCreateResearchProject() {
  return useMutation({
    mutationFn: async (
      project: Omit<
        TablesInsert<'research_projects'>,
        'id' | 'created_at' | 'updated_at' | 'deleted_at'
      >,
    ) => {
      const { data, error } = await supabase
        .from('research_projects')
        .insert(project)
        .select()
        .single()
      if (error) throw error
      return data
    },
  })
}
