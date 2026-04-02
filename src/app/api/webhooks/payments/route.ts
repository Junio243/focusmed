import { NextRequest, NextResponse } from 'next/server'

import { badRequest, unauthorized, serverError } from '@/lib/http'
import { supabaseAdmin } from '@/lib/supabase'

type PaymentWebhookPayload = {
  event_id: string
  event_type: 'invoice_paid' | 'subscription_canceled' | 'payment_failed'
  subscription_external_reference: string
  paid_until?: string | null
}

const SECRET = process.env.PAYMENT_WEBHOOK_SECRET ?? ''

export async function POST(request: NextRequest) {
  const incomingSecret = request.headers.get('x-webhook-secret')
  if (!SECRET || incomingSecret !== SECRET) return unauthorized('Invalid webhook secret.')

  const payload = (await request.json()) as PaymentWebhookPayload
  if (!payload.event_id || !payload.event_type || !payload.subscription_external_reference) {
    return badRequest('event_id, event_type and subscription_external_reference are required.')
  }

  const { error: eventError } = await supabaseAdmin.from('payment_events').insert({
    event_id: payload.event_id,
    event_type: payload.event_type,
    payload,
  })

  if (eventError && eventError.code === '23505') {
    return NextResponse.json({ message: 'Duplicate event ignored.' }, { status: 200 })
  }
  if (eventError) return serverError(eventError.message)

  let status: 'active' | 'canceled' | 'past_due' = 'active'
  if (payload.event_type === 'subscription_canceled') status = 'canceled'
  if (payload.event_type === 'payment_failed') status = 'past_due'

  const { error: subscriptionError } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status,
      paid_until: payload.paid_until ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('external_reference', payload.subscription_external_reference)

  if (subscriptionError) return serverError(subscriptionError.message)

  return NextResponse.json({ message: 'Webhook processed.' }, { status: 200 })
}
