import { NextRequest, NextResponse } from 'next/server'

import { unauthorized } from '@/lib/http'
import { supabasePublic } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const authorization = request.headers.get('authorization')
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : ''

  if (!token) return unauthorized('Missing bearer token.')

  const { data, error } = await supabasePublic.auth.getUser(token)

  if (error || !data.user) return unauthorized('Invalid token.')

  return NextResponse.json({ user: data.user }, { status: 200 })
}
