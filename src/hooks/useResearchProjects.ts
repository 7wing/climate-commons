import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { ResearchProject } from '@/types'

const KEY = 'research_projects'

export function useResearchProjects(category?: string, status?: string) {
  return useQuery({
    queryKey: [KEY, category, status],
    queryFn: async () => {
      let query = supabase
        .from('research_projects')
        .select('*, profiles(id, username, full_name, avatar_url)')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
      if (category) query = query.eq('category', category)
      if (status) query = query.eq('status', status)
      const { data, error } = await query
      if (error) throw error
      return data as ResearchProject[]
    },
  })
}

export function useResearchProject(id: string) {
  return useQuery({
    queryKey: [KEY, id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('research_projects')
        .select('*, profiles(id, username, full_name, avatar_url)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as ResearchProject
    },
    enabled: !!id,
  })
}

export function useJoinProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ projectId, userId }: { projectId: string; userId: string }) => {
      const { error } = await supabase.from('project_members').insert({ project_id: projectId, user_id: userId })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  })
}