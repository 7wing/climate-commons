import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'

export type Partner = Tables<'partners'>
export type PartnershipInquiry = Tables<'partnership_inquiries'>

export function usePartners() {
  return useQuery({
    queryKey: ['partners', 'list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .is('deleted_at', null)
        .order('name', { ascending: true })
      if (error) throw error
      return data
    },
  })
}

export function usePartnershipInquiries() {
  return useQuery({
    queryKey: ['partners', 'inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partnership_inquiries')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}
