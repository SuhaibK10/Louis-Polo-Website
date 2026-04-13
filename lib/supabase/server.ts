// ─────────────────────────────────────────────────────────────────────────────
// lib/supabase/server.ts
// Server-side Supabase client — use in Server Components and API routes
// This client has access to the service role key for admin operations
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Regular server client — respects Row Level Security
// Use this for reading user-specific data
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: object }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
            })
          } catch {
            // Server Component — cookie writes are ignored here
          }
        },
      },
    }
  )
}

// Admin client — bypasses Row Level Security
// Only use in API routes for server-side operations like creating orders
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        getAll() { return [] },
        setAll() {},
      },
    }
  )
}
