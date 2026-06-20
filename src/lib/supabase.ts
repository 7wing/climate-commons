import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// WARNING: The service role key must NEVER be used on the client side.
// It bypasses Row Level Security (RLS) and should only be used in secure server environments.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are defined in your .env file.'
  )
}

let options: any = {}

if (typeof globalThis.WebSocket === 'undefined') {
  try {
    const wsModule: any = await import('ws')
    const ws = wsModule.default || wsModule.WebSocket || wsModule
    options = { realtime: { transport: ws } }
  } catch {
    // ws unavailable, leave options empty
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, options)
