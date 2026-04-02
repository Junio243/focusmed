'use client'

import { FormEvent, useState } from 'react'

export function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error ?? 'Could not join waitlist.')
      }

      setStatus('success')
      setMessage('You are in. We will notify you when new spots open.')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unexpected error.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
      <input
        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm outline-none ring-cyan-300 transition focus:ring-2"
        placeholder="your@email.com"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-lg bg-cyan-300 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200 disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending...' : 'Join waitlist'}
      </button>
      {message ? (
        <p className={`text-xs ${status === 'error' ? 'text-rose-300' : 'text-emerald-300'}`}>{message}</p>
      ) : null}
    </form>
  )
}
