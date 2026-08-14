import type { WorkoutSession, PlannedSet } from '../types'

// Parse the top of a rep range like "8-10" or "10-12 / leg" -> 10
export function repTarget(reps: string): number {
  const m = reps.match(/(\d+)\s*-\s*(\d+)/)
  if (m) return parseInt(m[2], 10)
  const single = reps.match(/(\d+)/)
  return single ? parseInt(single[1], 10) : 0
}

export function repFloor(reps: string): number {
  const m = reps.match(/(\d+)/)
  return m ? parseInt(m[1], 10) : 0
}

// Find the most recent logged session that contains this exercise.
export function lastLogFor(exerciseId: string, sessions: WorkoutSession[], beforeISO?: string) {
  const sorted = [...sessions].sort((a, b) => b.dateISO.localeCompare(a.dateISO))
  for (const s of sorted) {
    if (beforeISO && s.dateISO >= beforeISO) continue
    const ex = s.exercises.find(e => e.exerciseId === exerciseId && e.sets.some(x => x.done))
    if (ex) return { session: s, log: ex }
  }
  return undefined
}

export interface OverloadAdvice {
  headline: string
  detail: string
  suggestWeight?: number
  tone: 'up' | 'hold' | 'down' | 'info'
}

// Double-progression logic: hit top of rep range on all sets -> add weight; else repeat & add reps.
export function overloadAdvice(
  plan: PlannedSet,
  exerciseId: string,
  sessions: WorkoutSession[],
  beforeISO?: string
): OverloadAdvice {
  const last = lastLogFor(exerciseId, sessions, beforeISO)
  const top = repTarget(plan.reps)
  const floor = repFloor(plan.reps)
  if (!last) {
    return {
      tone: 'info',
      headline: 'First time logging this',
      detail: `Pick a weight where the last 1-2 reps of ${plan.reps} feel challenging but your form stays clean. We will track it from here.`
    }
  }
  const doneSets = last.log.sets.filter(s => s.done && s.reps > 0)
  if (doneSets.length === 0) {
    return { tone: 'info', headline: 'No completed sets last time', detail: 'Repeat last session and log your working sets.' }
  }
  const weight = Math.max(...doneSets.map(s => s.weight))
  const minReps = Math.min(...doneSets.map(s => s.reps))
  const allHitTop = doneSets.length >= plan.sets && doneSets.every(s => s.reps >= top)

  const isTimed = /sec/.test(plan.reps)
  if (isTimed) {
    return {
      tone: 'up',
      headline: `Last time: ${minReps}s holds`,
      detail: `Add 5-10 seconds per set this time, or add light load once you pass the top of the range.`
    }
  }

  const step = weight <= 20 ? 2.5 : weight <= 60 ? 5 : 5
  if (allHitTop) {
    return {
      tone: 'up',
      headline: `Add weight: try ${weight + step} kg`,
      detail: `You hit ${top}+ reps on all sets at ${weight} kg last time. Increase by ${step} kg and aim for the bottom of the range (${floor} reps).`,
      suggestWeight: weight + step
    }
  }
  if (minReps < floor) {
    return {
      tone: 'hold',
      headline: `Stay at ${weight} kg`,
      detail: `Last time your lowest set was ${minReps} reps, below the ${floor}-rep floor. Keep this weight and build all sets up to ${top} reps before adding load.`,
      suggestWeight: weight
    }
  }
  return {
    tone: 'hold',
    headline: `Repeat ${weight} kg, chase more reps`,
    detail: `You did ${minReps}-${Math.max(...doneSets.map(s => s.reps))} reps at ${weight} kg. Keep the weight and push every set toward ${top} reps, then add weight next time.`,
    suggestWeight: weight
  }
}

// Completion % for a session: fraction of planned sets marked done.
export function sessionCompletion(session: WorkoutSession, plannedSetsById: Record<string, number>): number {
  let planned = 0, done = 0
  for (const ex of session.exercises) {
    planned += plannedSetsById[ex.exerciseId] ?? ex.sets.length
    done += ex.sets.filter(s => s.done).length
  }
  if (planned === 0) return 0
  return Math.round((done / planned) * 100)
}
