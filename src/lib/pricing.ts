import type { BillingCycle, PlanId } from '@/lib/contracts'

export const PRICING = {
  starter: {
    monthly: 9.9,
    yearly: 99,
  },
  pro: {
    monthly: 19.9,
    yearly: 199,
  },
  b2b_pilot: {
    monthly: 299,
  },
} as const

export function getPlanPrice(planId: PlanId, billingCycle: BillingCycle): number {
  return PRICING[planId][billingCycle]
}
