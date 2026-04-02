import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { email } = await request.json()
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }
  const { error } = await supabase
    .from('waitlist')
    .insert({ email: email.toLowerCase().trim() })
  if (error && error.code !== '23505') {
    return NextResponse.json({ error: 'Erro' }, { status: 500 })
  }
  return NextResponse.json({ message: 'ok' }, { status: 201 })
}
