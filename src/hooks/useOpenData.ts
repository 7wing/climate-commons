import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'

export type Dataset = Tables<'datasets'>

export function useDatasets() {
  return useQuery({
    queryKey: ['opendata', 'list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('datasets')
        .select('*')
        .is('deleted_at', null)
        .order('published_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useDatasetById(id: string) {
  return useQuery({
    queryKey: ['opendata', 'detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('datasets')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}
