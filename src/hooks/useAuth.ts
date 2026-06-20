import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Tables, TablesUpdate } from '@/types/database'

export type User = Tables<'users'>

export function useAuth() {
  return useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return data.session
    },
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      return data.user
    },
  })
}

export function useUserProfile(id: string) {
  return useQuery({
    queryKey: ['user', 'profile', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: async (
      payload: { id: string } & Partial<Omit<User, 'id'>>,
    ) => {
      const { id, ...rest } = payload
      const { data, error } = await supabase
        .from('users')
        .update(rest as TablesUpdate<'users'>)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
  })
}
