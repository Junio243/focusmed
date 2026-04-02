import { NextResponse } from 'next/server'

export function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 })
}

export function unauthorized(error = 'Unauthorized') {
  return NextResponse.json({ error }, { status: 401 })
}

export function serverError(error = 'Internal server error') {
  return NextResponse.json({ error }, { status: 500 })
}
