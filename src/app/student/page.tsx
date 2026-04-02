import Link from 'next/link'

import { StudentDashboard } from '@/components/student-dashboard'

export default function StudentPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Student Area</h1>
          <p className="text-sm text-zinc-300">
            Daily execution workspace for sessions, metrics, and AI recommendations.
          </p>
        </div>
        <Link href="/" className="text-sm text-cyan-300 hover:text-cyan-200">
          Back to landing
        </Link>
      </div>
      <StudentDashboard />
    </main>
  )
}
