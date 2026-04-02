import type { Recommendation, StudyPlanRequest, StudyPlanResponse } from '@/lib/contracts'

const AI_SERVICE_BASE_URL = process.env.AI_SERVICE_BASE_URL ?? 'http://localhost:8000'
const AI_SERVICE_TOKEN = process.env.AI_SERVICE_TOKEN ?? ''

async function aiRequest<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${AI_SERVICE_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-token': AI_SERVICE_TOKEN,
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`AI service error (${response.status}): ${detail}`)
  }

  return (await response.json()) as T
}

export async function getRecommendations(input: {
  user_id: string
  recent_focus_score: number
  recent_topic: string
}): Promise<Recommendation> {
  return aiRequest<Recommendation>('/v1/recommendations', input)
}

export async function buildStudyPlan(input: StudyPlanRequest): Promise<StudyPlanResponse> {
  return aiRequest<StudyPlanResponse>('/v1/study-plan', input)
}
