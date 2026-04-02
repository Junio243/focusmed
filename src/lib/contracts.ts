export type BillingCycle = 'monthly' | 'yearly'

export type PlanId = 'starter' | 'pro'

export interface StudySessionInput {
  user_id: string
  started_at: string
  duration_min: number
  focus_score: number
  topic: string
}

export interface RecommendationItem {
  title: string
  action: string
  duration_min: number
}

export interface Recommendation {
  user_id: string
  generated_at: string
  items: RecommendationItem[]
  confidence: number
}

export interface StudyPlanRequest {
  user_id: string
  weekly_availability_hours: number
  preferred_topics: string[]
}

export interface StudyPlanResponse {
  user_id: string
  generated_at: string
  week_schedule: Array<{
    day: string
    topic: string
    duration_min: number
  }>
}
