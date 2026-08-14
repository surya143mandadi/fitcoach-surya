import { PROGRAM_START_ISO, PROGRAM_WEEKS, DAY_ORDER } from '../data/program'
import type { DayKey } from '../types'

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function toISO(d: Date): string { return d.toISOString().slice(0, 10) }

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// JS getDay(): 0 Sun ... 6 Sat. Gym days Thu(4) Fri(5) Sat(6).
const DAY_MAP: Record<number, DayKey | undefined> = { 4: 'thu', 5: 'fri', 6: 'sat' }

export function dayKeyForDate(iso: string): DayKey | undefined {
  return DAY_MAP[parseISO(iso).getDay()]
}

// Program week 1-12 for a given date (before start => 1, after end => 12).
export function programWeek(iso: string): number {
  const start = parseISO(PROGRAM_START_ISO)
  const d = parseISO(iso)
  const diffDays = Math.floor((d.getTime() - start.getTime()) / 86400000)
  const wk = Math.floor(diffDays / 7) + 1
  return Math.min(Math.max(wk, 1), PROGRAM_WEEKS)
}

export function daysUntilStart(iso: string): number {
  return Math.floor((parseISO(PROGRAM_START_ISO).getTime() - parseISO(iso).getTime()) / 86400000)
}

// Monday ISO of the week containing `iso` (for weekly check-ins/averages).
export function weekStartISO(iso: string): string {
  const d = parseISO(iso)
  const day = d.getDay()               // 0 Sun..6 Sat
  const diff = (day === 0 ? -6 : 1 - day)
  d.setDate(d.getDate() + diff)
  return toISO(d)
}

export function fmtDate(iso: string): string {
  return parseISO(iso).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })
}

// Next gym day (today if it's a gym day, else the upcoming Thu/Fri/Sat).
export function nextGymDay(iso: string): { dayKey: DayKey; dateISO: string } {
  const d = parseISO(iso)
  for (let i = 0; i < 7; i++) {
    const probe = new Date(d); probe.setDate(d.getDate() + i)
    const key = DAY_MAP[probe.getDay()]
    if (key) return { dayKey: key, dateISO: toISO(probe) }
  }
  return { dayKey: DAY_ORDER[0], dateISO: iso }
}
