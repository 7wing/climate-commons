export interface Profile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  location: string | null
  role: 'member' | 'researcher' | 'moderator' | 'admin'
  reputation: number
  created_at: string
  updated_at: string
}

export interface ForumThread {
  id: string
  author_id: string
  title: string
  body: string
  category: 'research' | 'policy' | 'action' | 'solutions' | 'general'
  tags: string[]
  view_count: number
  like_count: number
  reply_count: number
  is_verified: boolean
  is_pinned: boolean
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface ForumReply {
  id: string
  thread_id: string
  author_id: string
  body: string
  parent_reply_id: string | null
  like_count: number
  created_at: string
  updated_at: string
  profiles?: Profile
  replies?: ForumReply[]
}

export interface ResearchProject {
  id: string
  lead_id: string
  title: string
  description: string
  category: 'marine' | 'urban' | 'soil' | 'arctic' | 'fauna' | 'energy' | 'water'
  status: 'enrolling' | 'active' | 'data_collection' | 'completed' | 'paused'
  image_url: string | null
  participant_count: number
  max_participants: number
  tags: string[]
  start_date: string | null
  end_date: string | null
  is_featured: boolean
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Action {
  id: string
  organizer_id: string
  title: string
  description: string
  category: 'conservation' | 'cleanup' | 'energy' | 'advocacy' | 'workshop' | 'sustainability'
  location: string
  latitude: number | null
  longitude: number | null
  event_date: string
  end_date: string | null
  max_participants: number
  current_count: number
  image_url: string | null
  is_featured: boolean
  impact_level: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface PolicyUpdate {
  id: string
  submitted_by: string
  title: string
  body: string
  scope: 'local' | 'regional' | 'national' | 'international'
  source_url: string | null
  pdf_url: string | null
  support_count: number
  is_verified: boolean
  region: string | null
  published_at: string
  created_at: string
  profiles?: Profile
}

export interface Solution {
  id: string
  author_id: string
  title: string
  description: string
  body: string | null
  category: 'household' | 'industrial' | 'community'
  image_url: string | null
  guide_url: string | null
  impact_score: number
  co2_reduction_pct: number | null
  download_count: number
  like_count: number
  is_featured: boolean
  tags: string[]
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Notification {
  id: string
  user_id: string
  type: 'reply' | 'like' | 'join' | 'policy' | 'action' | 'mention' | 'system'
  title: string
  message: string | null
  reference_id: string | null
  reference_type: string | null
  is_read: boolean
  created_at: string
}