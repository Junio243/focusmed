import Link from 'next/link'

import { WaitlistForm } from '@/components/waitlist-form'
import { PRICING } from '@/lib/pricing'

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(103,232,249,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.2),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(250,204,21,0.2),transparent_35%)]" />

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-14">
        <header className="flex items-center justify-between">
          <span className="text-sm font-semibold tracking-[0.14em] text-cyan-200">FOCUSMED</span>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/onboarding" className="text-zinc-300 hover:text-white">
              Onboarding
            </Link>
            <Link href="/student" className="text-zinc-300 hover:text-white">
              Student Area
            </Link>
            <Link href="/institucional" className="rounded-full bg-white px-3 py-1 text-zinc-950">
              Institutional
            </Link>
          </nav>
        </header>

        <div className="mt-16 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">
              Built for health students with neurodiverse learning styles
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-white md:text-6xl">
              Study with structure, protect focus, improve retention.
            </h1>
            <p className="mt-5 max-w-xl text-base text-zinc-300">
              FocusMed combines adaptive planning, clinical-content blocks, and weekly performance
              analytics so students can stay consistent and convert study time into measurable progress.
            </p>

            <div className="mt-8 max-w-xl">
              <WaitlistForm />
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-black/30 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold">Revenue-ready MVP offer</h2>
            <div className="mt-4 grid gap-3">
              <article className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold">Starter</p>
                <p className="text-3xl font-semibold">${PRICING.starter.monthly.toFixed(2)} / month</p>
                <p className="text-xs text-zinc-300">7-day free trial, adaptive daily blocks, weekly metrics.</p>
              </article>
              <article className="rounded-xl border border-cyan-200/30 bg-cyan-400/10 p-4">
                <p className="text-sm font-semibold">Pro</p>
                <p className="text-3xl font-semibold">${PRICING.pro.monthly.toFixed(2)} / month</p>
                <p className="text-xs text-zinc-300">Everything in Starter plus advanced AI recommendations.</p>
              </article>
              <article className="rounded-xl border border-emerald-200/30 bg-emerald-400/10 p-4">
                <p className="text-sm font-semibold">Institutional Pilot</p>
                <p className="text-3xl font-semibold">${PRICING.b2b_pilot.monthly.toFixed(2)} / month</p>
                <p className="text-xs text-zinc-300">One cohort dashboard with aggregated class focus analytics.</p>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
