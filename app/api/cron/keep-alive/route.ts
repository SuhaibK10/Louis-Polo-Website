// ─────────────────────────────────────────────────────────────────────────────
// app/api/cron/keep-alive/route.ts
// Runs every 3 days via Vercel Cron to prevent Supabase free tier from pausing.
// Vercel calls this automatically — no manual action needed.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createAdminClient()

    // Lightweight ping — just fetch one product row
    const { error } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (error) throw error

    return NextResponse.json({
      success:   true,
      message:   'Supabase connection alive',
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('[CRON keep-alive] Error:', error)

    return NextResponse.json(
      { success: false, error: 'Keep-alive ping failed' },
      { status: 500 }
    )
  }
}
