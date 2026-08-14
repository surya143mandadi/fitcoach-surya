// ---- Core domain types (mirror db/schema.sql) ----

export type MuscleGroup =
  | 'Chest' | 'Back' | 'Shoulders' | 'Biceps' | 'Triceps'
  | 'Quads' | 'Hamstrings' | 'Glutes' | 'Calves' | 'Core' | 'Forearms' | 'Full Body'

export interface Exercise {
  id: string
  name: string
  primary: MuscleGroup[]
  secondary: MuscleGroup[]
  equipment: string
  videoUrl?: string          // demonstration video (embed/mp4). Empty => placeholder area
  setup: string[]            // setup & posture
  steps: string[]            // step-by-step technique
  breathing: string
  mistakes: string[]         // common mistakes
  safety: string[]           // safety tips
  easierAltId?: string       // easier alternative exercise id
  tags?: string[]
}

export type DayKey = 'thu' | 'fri' | 'sat'

export interface PlannedSet {
  sets: number
  reps: string               // e.g. "8-10" or "12"
  restSec: number
  startWeightHint?: string   // guidance for first working weight
}

export interface WorkoutBlock {
  exerciseId: string
  plan: PlannedSet
  note?: string
}

export interface WorkoutTemplate {
  day: DayKey
  title: string              // Upper Body etc.
  focus: string
  blocks: WorkoutBlock[]
}

// ---- Logging / history ----
export interface SetLog {
  weight: number             // kg
  reps: number
  done: boolean
}

export interface ExerciseLog {
  exerciseId: string
  sets: SetLog[]
}

export interface WorkoutSession {
  id: string
  day: DayKey
  title: string
  dateISO: string            // yyyy-mm-dd
  week: number               // program week 1-12
  exercises: ExerciseLog[]
  completedPct: number
  startedAt?: string         // ISO timestamp when session began
  finishedAt?: string
  durationSec?: number       // active session length in seconds
  kcalBurned?: number        // MET-based energy estimate at finish
}

// ---- Transformation / body metrics ----
export interface BodyEntry {
  dateISO: string
  weightKg?: number
  waistCm?: number
  bodyFatPct?: number
  skeletalMuscleKg?: number
  leanMassKg?: number
  photoDataUrl?: string      // progress photo (local base64)
  note?: string
}

// ---- Nutrition ----
export interface NutritionEntry {
  dateISO: string
  kcal: number
  proteinG: number
  waterMl: number
  steps?: number
}

export interface Meal {
  id: string
  name: string
  slot: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  kcal: number
  proteinG: number
  items: string[]
  veg: boolean
}

// ---- Weekly check-in ----
export interface CheckIn {
  weekISO: string            // Monday of the week
  weightAvgKg?: number
  waistCm?: number
  avgSteps?: number
  adherence?: number         // 0-100 self-rated
  energy?: number            // 1-5
  note?: string
}

// ---- Coach ----
export interface ChatMessage {
  role: 'user' | 'coach'
  text: string
  ts: number
}
