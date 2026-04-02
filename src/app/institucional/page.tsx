import Link from 'next/link'

export default function InstitucionalPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">FocusMed Institucional</h1>
        <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">
          Back to landing
        </Link>
      </div>

      <p className="mt-4 max-w-2xl text-zinc-300">
        Institutional pilot for small schools and exam prep providers. Includes cohort setup,
        engagement tracking, and aggregated focus analytics dashboard.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="font-semibold">Cohorts</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Invite students by cohort and track participation week by week.
          </p>
        </article>
        <article className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="font-semibold">Aggregated metrics</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Focus sessions, average study time, and activation funnel by class.
          </p>
        </article>
        <article className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="font-semibold">Pilot pricing</h2>
          <p className="mt-2 text-sm text-zinc-300">$299/month for one active cohort.</p>
        </article>
      </div>
    </main>
  )
}
