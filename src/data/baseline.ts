import type { BodyEntry } from '../types'

// Historical body-scan baseline (April 2026) + current stats.
export const BASELINE_SCAN: BodyEntry = {
  dateISO: '2026-04-15',
  weightKg: 75.5,
  waistCm: 93.7,
  bodyFatPct: 27.3,
  skeletalMuscleKg: 30.3,
  leanMassKg: 54.9,
  note: 'April 2026 body-scan baseline'
}

// Current profile stats (start of program).
export const PROFILE = {
  name: 'Surya',
  age: 32,
  sex: 'male' as const,
  heightCm: 173,
  startWeightKg: 74,
  goalWeightKg: 69,         // mid of 68-70 range
  goalWaistCm: 84,
  goalBodyFatPct: 18,
  experience: 'Intermediate',
  stepGoal: 8000
}

export const SEED_CURRENT: BodyEntry = {
  dateISO: '2026-09-06',
  weightKg: 74,
  waistCm: 91,
  note: 'Program start'
}
