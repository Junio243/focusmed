'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'

export default function OnboardingPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [track, setTrack] = useState('medicina')
  const [status, setStatus] = useState('')
  const [userId, setUserId] = useState('')

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('Creating account...')

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName, track }),
    })
    const payload = await response.json()

    if (!response.ok) {
      setStatus(payload.error ?? 'Could not create account.')
      return
    }

    setUserId(payload.user?.id ?? '')
    setStatus('Account created. Start your free trial below.')
  }

  async function startTrial(planId: 'starter' | 'pro') {
    if (!userId) {
      setStatus('Create your account first to start trial.')
      return
    }

    setStatus(`Starting ${planId} trial...`)
    const response = await fetch('/api/checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, plan_id: planId, billing_cycle: 'monthly' }),
    })
    const payload = await response.json()

    if (!response.ok) {
      setStatus(payload.error ?? 'Could not start trial.')
      return
    }

    setStatus(`Trial started. Subscription ID: ${payload.subscription_id}`)
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-14">
      <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">
        ← Back to landing
      </Link>
      <h1 className="mt-5 text-4xl font-semibold">Onboarding</h1>
      <p className="mt-2 text-zinc-300">
        Create your account and activate a 7-day trial with Starter or Pro.
      </p>

      <form onSubmit={handleSignup} className="mt-8 grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-6">
        <input
          className="rounded-lg border border-white/20 bg-black/20 px-3 py-2"
          placeholder="Full name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          required
        />
        <input
          className="rounded-lg border border-white/20 bg-black/20 px-3 py-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          className="rounded-lg border border-white/20 bg-black/20 px-3 py-2"
          type="password"
          placeholder="Password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <select
          className="rounded-lg border border-white/20 bg-black/20 px-3 py-2"
          value={track}
          onChange={(event) => setTrack(event.target.value)}
        >
          <option value="medicina">Medicina</option>
          <option value="enfermagem">Enfermagem</option>
          <option value="fisioterapia">Fisioterapia</option>
        </select>
        <button className="rounded-lg bg-cyan-300 px-4 py-2 font-semibold text-zinc-950">
          Create account
        </button>
      </form>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Start free trial</h2>
        <div className="mt-3 flex gap-3">
          <button
            className="rounded-lg bg-emerald-300 px-4 py-2 font-semibold text-zinc-950"
            onClick={() => startTrial('starter')}
          >
            Starter trial
          </button>
          <button
            className="rounded-lg bg-cyan-300 px-4 py-2 font-semibold text-zinc-950"
            onClick={() => startTrial('pro')}
          >
            Pro trial
          </button>
        </div>
      </section>

      <p className="mt-4 text-sm text-zinc-300">{status}</p>
    </main>
  )
}
