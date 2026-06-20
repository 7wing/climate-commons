import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Tables } from '@/types/database'

export type Bookmark = Tables<'bookmarks'>
export type ResearchProject = Tables<'research_projects'>

export interface BookmarkWithProject extends Bookmark {
  research_project: ResearchProject | null
}

export function useBookmarks() {
  return useQuery({
    queryKey: ['bookmarks', 'list'],
    queryFn: async () => {
      const { data: bookmarks, error: bookmarksError } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('entity_type', 'research_project')
        .order('created_at', { ascending: false })
      if (bookmarksError) throw bookmarksError

      const projectIds = bookmarks?.map((b) => b.entity_id) ?? []
      const { data: projects, error: projectsError } = await supabase
        .from('research_projects')
        .select('*')
        .in('id', projectIds)
      if (projectsError) throw projectsError

      const result: BookmarkWithProject[] =
        bookmarks?.map((b) => ({
          ...b,
          research_project:
            projects?.find((p) => p.id === b.entity_id) ?? null,
        })) ?? []
      return result
    },
  })
}
