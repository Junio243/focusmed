import { NextRequest, NextResponse } from 'next/server'

import { badRequest, serverError } from '@/lib/http'
import { supabaseAdmin } from '@/lib/supabase'

type CohortRow = { id: string; name: string }
type MemberRow = { user_id: string }
type SessionRow = { duration_min: number; focus_score: number }

export async function GET(request: NextRequest) {
  const institutionId = request.nextUrl.searchParams.get('institution_id')?.trim()
  if (!institutionId) return badRequest('institution_id query param is required.')

  const cohortsResult = await supabaseAdmin
    .from('cohorts')
    .select('id,name')
    .eq('institution_id', institutionId)

  if (cohortsResult.error) return serverError(cohortsResult.error.message)
  const cohorts = (cohortsResult.data ?? []) as CohortRow[]

  const cohortIds = cohorts.map((cohort) => cohort.id)
  if (cohortIds.length === 0) {
    return NextResponse.json(
      {
        institution_id: institutionId,
        total_students: 0,
        total_minutes: 0,
        avg_focus_score: 0,
      },
      { status: 200 }
    )
  }

  const membersResult = await supabaseAdmin
    .from('cohort_members')
    .select('user_id')
    .in('cohort_id', cohortIds)

  if (membersResult.error) return serverError(membersResult.error.message)
  const members = (membersResult.data ?? []) as MemberRow[]
  const uniqueUserIds = Array.from(new Set(members.map((member) => member.user_id)))

  if (uniqueUserIds.length === 0) {
    return NextResponse.json(
      {
        institution_id: institutionId,
        total_students: 0,
        total_minutes: 0,
        avg_focus_score: 0,
      },
      { status: 200 }
    )
  }

  const sessionsResult = await supabaseAdmin
    .from('study_sessions')
    .select('duration_min,focus_score')
    .in('user_id', uniqueUserIds)
    .limit(2000)

  if (sessionsResult.error) return serverError(sessionsResult.error.message)
  const sessions = (sessionsResult.data ?? []) as SessionRow[]

  const totalMinutes = sessions.reduce((sum, session) => sum + session.duration_min, 0)
  const avgFocusScore =
    sessions.length > 0
      ? sessions.reduce((sum, session) => sum + session.focus_score, 0) / sessions.length
      : 0

  return NextResponse.json(
    {
      institution_id: institutionId,
      cohort_count: cohorts.length,
      total_students: uniqueUserIds.length,
      total_minutes: totalMinutes,
      avg_focus_score: avgFocusScore,
    },
    { status: 200 }
  )
}
