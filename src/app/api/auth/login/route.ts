import { NextRequest, NextResponse } from 'next/server'

import { badRequest } from '@/lib/http'
import { supabasePublic } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const email = String(body.email ?? '').trim().toLowerCase()
  const password = String(body.password ?? '')

  if (!email.includes('@')) return badRequest('Invalid email.')
  if (!password) return badRequest('Password is required.')

  const { data, error } = await supabasePublic.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  return NextResponse.json(
    {
      user: data.user,
      session: data.session,
    },
    { status: 200 }
  )
}
