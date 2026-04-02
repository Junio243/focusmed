import crypto from 'crypto'

import { NextRequest, NextResponse } from 'next/server'

import type { BillingCycle, PlanId } from '@/lib/contracts'
import { badRequest, serverError } from '@/lib/http'
import { getPlanPrice } from '@/lib/pricing'
import { supabaseAdmin } from '@/lib/supabase'

const VALID_PLAN_IDS: PlanId[] = ['starter', 'pro']
const VALID_BILLING_CYCLES: BillingCycle[] = ['monthly', 'yearly']

function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const userId = String(body.user_id ?? '').trim()
  const planId = String(body.plan_id ?? '').trim() as PlanId
  const billingCycle = String(body.billing_cycle ?? '').trim() as BillingCycle

  if (!userId) return badRequest('user_id is required.')
  if (!VALID_PLAN_IDS.includes(planId)) return badRequest('Invalid plan_id.')
  if (!VALID_BILLING_CYCLES.includes(billingCycle)) return badRequest('Invalid billing_cycle.')

  const now = new Date()
  const trialEndsAt = addDays(now, 7).toISOString()
  const externalReference = `chk_${crypto.randomUUID()}`
  const amount = getPlanPrice(planId, billingCycle)

  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_id: planId,
      billing_cycle: billingCycle,
      status: 'trialing',
      trial_ends_at: trialEndsAt,
      amount_usd: amount,
      external_reference: externalReference,
    })
    .select('id')
    .single()

  if (error) return serverError(error.message)

  await supabaseAdmin.from('events').insert({
    user_id: userId,
    event_name: 'trial_started',
    payload: { plan_id: planId, billing_cycle: billingCycle, external_reference: externalReference },
  })

  return NextResponse.json(
    {
      subscription_id: data.id,
      checkout_url: `/onboarding?checkout_reference=${externalReference}`,
      status: 'trialing',
      trial_ends_at: trialEndsAt,
    },
    { status: 201 }
  )
}
