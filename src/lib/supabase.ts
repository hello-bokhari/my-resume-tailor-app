import { createClient } from '@supabase/supabase-js'
import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { NextApiRequest, NextApiResponse } from 'next'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client for API routes
export const createServerSupabaseClient = (req: NextApiRequest, res: NextApiResponse) =>
  createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name: string) => req.cookies[name],
      set: (name: string, value: string, options: any) => res.cookie(name, value, options),
      remove: (name: string, options: any) => res.clearCookie(name, options),
    },
  })
