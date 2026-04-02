import { NextRequest, NextResponse } from 'next/server'

import { badRequest, serverError } from '@/lib/http'
import { supabaseAdmin } from '@/lib/supabase'

type StudySessionRow = {
  duration_min: number
  focus_score: number
}

type SubscriptionRow = {
  plan_id: string
  status: string
  trial_ends_at: string | null
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('user_id')?.trim()
  if (!userId) return badRequest('user_id query param is required.')

  const sessionsResult = await supabaseAdmin
    .from('study_sessions')
    .select('duration_min,focus_score')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(100)

  if (sessionsResult.error) return serverError(sessionsResult.error.message)

  const sessions = (sessionsResult.data ?? []) as StudySessionRow[]
  const totalSessions = sessions.length
  const totalMinutes = sessions.reduce((sum, session) => sum + session.duration_min, 0)
  const avgFocusScore =
    totalSessions === 0
      ? 0
      : sessions.reduce((sum, session) => sum + session.focus_score, 0) / totalSessions

  const subscriptionResult = await supabaseAdmin
    .from('subscriptions')
    .select('plan_id,status,trial_ends_at')
    .eq('user_id', userId)
    .in('status', ['trialing', 'active'])
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (subscriptionResult.error) return serverError(subscriptionResult.error.message)

  return NextResponse.json(
    {
      total_sessions: totalSessions,
      total_minutes: totalMinutes,
      avg_focus_score: avgFocusScore,
      active_subscription: (subscriptionResult.data ?? null) as SubscriptionRow | null,
    },
    { status: 200 }
  )
}
