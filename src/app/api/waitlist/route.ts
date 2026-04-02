import { NextRequest, NextResponse } from 'next/server'

import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  if (!email || !String(email).includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('waitlist')
    .insert({ email: String(email).toLowerCase().trim() })

  if (error && error.code !== '23505') {
    return NextResponse.json({ error: 'Could not save email' }, { status: 500 })
  }

  return NextResponse.json({ message: 'ok' }, { status: 201 })
}
