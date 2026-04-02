import { NextRequest, NextResponse } from 'next/server'

import { badRequest, serverError } from '@/lib/http'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const email = String(body.email ?? '').trim().toLowerCase()
  const password = String(body.password ?? '')
  const fullName = String(body.full_name ?? '').trim()
  const track = String(body.track ?? 'medicina').trim().toLowerCase()

  if (!email.includes('@')) return badRequest('Invalid email.')
  if (password.length < 8) return badRequest('Password must have at least 8 chars.')
  if (!fullName) return badRequest('Full name is required.')

  const signUpResult = await supabaseAdmin.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, track },
    },
  })

  if (signUpResult.error) {
    return NextResponse.json({ error: signUpResult.error.message }, { status: 400 })
  }

  const user = signUpResult.data.user
  if (!user) return serverError('Account created without user object.')

  const { error: upsertUserError } = await supabaseAdmin.from('users').upsert(
    {
      id: user.id,
      email,
      role: 'student',
      created_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  )

  if (upsertUserError) return serverError(upsertUserError.message)

  const { error: profileError } = await supabaseAdmin.from('profiles').upsert(
    {
      user_id: user.id,
      full_name: fullName,
      track,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )

  if (profileError) return serverError(profileError.message)

  await supabaseAdmin.from('events').insert({
    user_id: user.id,
    event_name: 'signup_completed',
    payload: { track },
  })

  return NextResponse.json({ user: { id: user.id, email: user.email } }, { status: 201 })
}
