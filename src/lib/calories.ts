// MET-based session energy estimate (Compendium of Physical Activities).
// kcal = MET × bodyMassKg × durationHours.
// No heart-rate data in a web PWA, so this is the standard estimator apps use
// for resistance training. Once wrapped natively, HealthKit active-energy can override.

import type { WorkoutSession } from '../types'

// Per-exercise MET. Heavy multi-joint barbell work burns more than isolation.
const MET: Record<string, number> = {
  // vigorous compound
  barbell_bench: 6, back_squat: 6, deadlift: 6, romanian_deadlift: 6,
  overhead_press: 6, leg_press: 6, db_rdl: 6,
  kb_swing: 9.8,
  // moderate compound / machine
  incline_db_press: 5, db_bench: 5, db_shoulder_press: 5, machine_chest_press: 5,
  lat_pulldown: 5, seated_cable_row: 5, one_arm_db_row: 5, band_row: 5,
  assisted_pullup: 5, seated_shoulder_machine: 5, goblet_squat: 5,
  walking_lunge: 5, static_split_squat: 5, leg_curl: 5,
  pushup: 5, incline_pushup: 4.5, bodyweight_squat: 4.5,
  // isolation
  db_lateral_raise: 3.5, triceps_pushdown: 3.5, db_biceps_curl: 3.5,
  standing_calf_raise: 3.5,
  // core / drills
  plank: 3.5, lying_leg_raise: 3.5, hanging_leg_raise: 3.5,
  cable_woodchop: 4, hip_hinge_drill: 3
}

const DEFAULT_MET = 5

export function metForExercise(id: string): number {
  return MET[id] ?? DEFAULT_MET
}

// Weighted average MET across exercises the user actually worked this session.
export function sessionMET(session: WorkoutSession): number {
  const worked = session.exercises.filter(e => e.sets.some(s => s.done))
  const pool = worked.length ? worked : session.exercises
  if (!pool.length) return DEFAULT_MET
  return pool.reduce((a, e) => a + metForExercise(e.exerciseId), 0) / pool.length
}

// kcal for a finished session. durationSec preferred; falls back to a
// per-completed-set estimate (~2.5 min/set) when no timer was running.
export function estimateSessionKcal(session: WorkoutSession, bodyMassKg: number): number {
  const met = sessionMET(session)
  let hours: number
  if (session.durationSec && session.durationSec > 0) {
    hours = session.durationSec / 3600
  } else {
    const doneSets = session.exercises.reduce((a, e) => a + e.sets.filter(s => s.done).length, 0)
    hours = (doneSets * 2.5) / 60
  }
  return Math.round(met * bodyMassKg * hours)
}

export function fmtDuration(sec: number): string {
  const m = Math.floor(sec / 60), s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
