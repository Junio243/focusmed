import { NextRequest, NextResponse } from 'next/server'

import { getRecommendations } from '@/lib/ai-service'
import type { StudySessionInput } from '@/lib/contracts'
import { badRequest, serverError } from '@/lib/http'
import { supabaseAdmin } from '@/lib/supabase'

function validatePayload(payload: StudySessionInput): string | null {
  if (!payload.user_id) return 'user_id is required.'
  if (!payload.topic) return 'topic is required.'
  if (!payload.started_at) return 'started_at is required.'
  if (payload.duration_min <= 0 || payload.duration_min > 240) return 'duration_min must be between 1 and 240.'
  if (payload.focus_score < 0 || payload.focus_score > 10) return 'focus_score must be between 0 and 10.'
  return null
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as StudySessionInput
  const validationError = validatePayload(payload)
  if (validationError) return badRequest(validationError)

  const { data, error } = await supabaseAdmin
    .from('study_sessions')
    .insert({
      user_id: payload.user_id,
      started_at: payload.started_at,
      duration_min: payload.duration_min,
      focus_score: payload.focus_score,
      topic: payload.topic,
    })
    .select('id')
    .single()

  if (error) return serverError(error.message)

  await supabaseAdmin.from('events').insert({
    user_id: payload.user_id,
    event_name: 'study_session_logged',
    payload: {
      study_session_id: data.id,
      duration_min: payload.duration_min,
      focus_score: payload.focus_score,
      topic: payload.topic,
    },
  })

  let recommendation = null
  try {
    recommendation = await getRecommendations({
      user_id: payload.user_id,
      recent_focus_score: payload.focus_score,
      recent_topic: payload.topic,
    })
  } catch {
    recommendation = null
  }

  return NextResponse.json({ study_session_id: data.id, recommendation }, { status: 201 })
}
