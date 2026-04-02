import { NextRequest, NextResponse } from 'next/server'

import { buildStudyPlan } from '@/lib/ai-service'
import { unauthorized } from '@/lib/http'
import { supabaseAdmin } from '@/lib/supabase'

const CRON_SECRET = process.env.CRON_SECRET ?? ''

type UserProfileRow = {
  user_id: string
  track: string | null
}

export async function POST(request: NextRequest) {
  const incomingSecret = request.headers.get('x-cron-secret')
  if (!CRON_SECRET || incomingSecret !== CRON_SECRET) {
    return unauthorized('Invalid cron secret.')
  }

  const result = await supabaseAdmin
    .from('profiles')
    .select('user_id,track')
    .limit(50)

  if (result.error) {
    return NextResponse.json({ error: result.error.message }, { status: 500 })
  }

  const users = (result.data ?? []) as UserProfileRow[]
  const generatedForUsers: string[] = []

  for (const user of users) {
    try {
      const plan = await buildStudyPlan({
        user_id: user.user_id,
        weekly_availability_hours: 8,
        preferred_topics: [user.track ?? 'medicina'],
      })

      await supabaseAdmin.from('plans').insert({
        user_id: user.user_id,
        payload: plan,
      })

      generatedForUsers.push(user.user_id)
    } catch {
      continue
    }
  }

  return NextResponse.json({ generated_for_users: generatedForUsers.length }, { status: 200 })
}
