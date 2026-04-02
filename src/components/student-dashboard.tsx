'use client'

import { FormEvent, useState } from 'react'

type DashboardData = {
  total_sessions: number
  total_minutes: number
  avg_focus_score: number
  active_subscription: {
    plan_id: string
    status: string
    trial_ends_at: string | null
  } | null
}

type RecommendationData = {
  user_id: string
  generated_at: string
  confidence: number
  items: Array<{
    title: string
    action: string
    duration_min: number
  }>
}

export function StudentDashboard() {
  const [userId, setUserId] = useState('')
  const [topic, setTopic] = useState('Anatomia')
  const [focusScore, setFocusScore] = useState(7)
  const [duration, setDuration] = useState(40)

  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null)
  const [status, setStatus] = useState('')

  async function loadDashboard(event: FormEvent) {
    event.preventDefault()
    setStatus('Loading dashboard...')

    const response = await fetch(`/api/study/dashboard?user_id=${encodeURIComponent(userId)}`)
    const payload = await response.json()

    if (!response.ok) {
      setStatus(payload.error ?? 'Could not load dashboard.')
      return
    }

    setDashboard(payload)
    setStatus('Dashboard loaded.')
  }

  async function submitSession(event: FormEvent) {
    event.preventDefault()
    setStatus('Saving session...')

    const response = await fetch('/api/study/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        started_at: new Date().toISOString(),
        duration_min: duration,
        focus_score: focusScore,
        topic,
      }),
    })

    const payload = await response.json()

    if (!response.ok) {
      setStatus(payload.error ?? 'Could not save session.')
      return
    }

    setRecommendation(payload.recommendation)
    setStatus('Session saved and recommendation generated.')
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Student workspace</h2>
        <p className="mt-1 text-sm text-zinc-300">
          Track focus sessions and receive adaptive study recommendations.
        </p>
        <form onSubmit={submitSession} className="mt-5 grid gap-3">
          <input
            className="rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-sm"
            placeholder="User ID (UUID)"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            required
          />
          <input
            className="rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-sm"
            placeholder="Topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            required
          />
          <input
            className="rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-sm"
            type="number"
            min={1}
            max={240}
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
            required
          />
          <input
            className="rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-sm"
            type="number"
            min={0}
            max={10}
            value={focusScore}
            onChange={(event) => setFocusScore(Number(event.target.value))}
            required
          />
          <button className="rounded-lg bg-emerald-300 px-4 py-2 text-sm font-semibold text-zinc-950">
            Save study session
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Progress dashboard</h2>
        <form onSubmit={loadDashboard} className="mt-4 flex gap-2">
          <button className="rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-zinc-950">
            Refresh metrics
          </button>
        </form>
        <p className="mt-3 text-xs text-zinc-300">{status}</p>

        {dashboard ? (
          <div className="mt-4 space-y-2 text-sm">
            <p>Total sessions: {dashboard.total_sessions}</p>
            <p>Total minutes: {dashboard.total_minutes}</p>
            <p>Average focus score: {dashboard.avg_focus_score.toFixed(1)}</p>
            <p>
              Active subscription:{' '}
              {dashboard.active_subscription
                ? `${dashboard.active_subscription.plan_id} (${dashboard.active_subscription.status})`
                : 'none'}
            </p>
          </div>
        ) : null}

        {recommendation ? (
          <div className="mt-6 rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-4">
            <h3 className="text-sm font-semibold">Recommended next blocks</h3>
            <p className="text-xs text-zinc-300">
              Confidence: {(recommendation.confidence * 100).toFixed(0)}%
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {recommendation.items.map((item, index) => (
                <li key={`${item.title}-${index}`} className="rounded-lg bg-black/20 p-2">
                  <strong>{item.title}</strong> - {item.action} ({item.duration_min} min)
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </div>
  )
}
