import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  WorkoutSession, BodyEntry, NutritionEntry, CheckIn, ChatMessage, DayKey, ExerciseLog
} from '../types'
import { WORKOUTS } from '../data/program'
import { BASELINE_SCAN, SEED_CURRENT } from '../data/baseline'
import { NUTRITION_TARGETS } from '../data/nutrition'
import { todayISO, programWeek, weekStartISO } from '../lib/dates'

interface AppState {
  // auth-ready: userId is set once a backend session exists; null => local demo mode
  userId: string | null
  demoMode: boolean

  sessions: WorkoutSession[]
  body: BodyEntry[]
  nutrition: NutritionEntry[]
  checkins: CheckIn[]
  chat: ChatMessage[]

  // actions
  startOrGetSession: (day: DayKey, dateISO: string) => WorkoutSession
  saveSession: (session: WorkoutSession) => void
  logBody: (entry: BodyEntry) => void
  logNutrition: (entry: Partial<NutritionEntry> & { dateISO: string }) => void
  addNutritionMeal: (dateISO: string, kcal: number, proteinG: number) => void
  addWater: (dateISO: string, ml: number) => void
  setSteps: (dateISO: string, steps: number) => void
  saveCheckin: (c: CheckIn) => void
  addChat: (m: ChatMessage) => void
  clearChat: () => void
  resetDemo: () => void
}

function seedBody(): BodyEntry[] {
  return [BASELINE_SCAN, SEED_CURRENT]
}

// Seed a couple of past workouts so "previous history" and progression work on day 1.
function seedSessions(): WorkoutSession[] {
  const mk = (day: DayKey, dateISO: string, week: number, weights: Record<string, number[]>): WorkoutSession => {
    const tpl = WORKOUTS[day]
    const exercises: ExerciseLog[] = tpl.blocks.map(b => {
      const w = weights[b.exerciseId] || Array(b.plan.sets).fill(0)
      return {
        exerciseId: b.exerciseId,
        sets: Array.from({ length: b.plan.sets }, (_, i) => ({
          weight: w[i] ?? w[w.length - 1] ?? 0,
          reps: /sec/.test(b.plan.reps) ? 40 : 9,
          done: true
        }))
      }
    })
    return { id: `seed-${dateISO}-${day}`, day, title: tpl.title, dateISO, week, exercises, completedPct: 100, finishedAt: dateISO }
  }
  return [
    mk('thu', '2026-09-10', 1, { barbell_bench: [40, 40, 40, 40], lat_pulldown: [45, 45, 45], db_shoulder_press: [14, 14, 14], db_biceps_curl: [10, 10, 10] }),
    mk('fri', '2026-09-11', 1, { back_squat: [50, 50, 50, 50], romanian_deadlift: [40, 40, 40], leg_press: [80, 80, 80] })
  ]
}

const DEMO = {
  sessions: seedSessions(),
  body: seedBody(),
  nutrition: [] as NutritionEntry[],
  checkins: [] as CheckIn[],
  chat: [] as ChatMessage[]
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      userId: null,
      demoMode: true,
      ...DEMO,

      startOrGetSession: (day, dateISO) => {
        const existing = get().sessions.find(s => s.dateISO === dateISO && s.day === day && !s.id.startsWith('seed-'))
        if (existing) return existing
        const tpl = WORKOUTS[day]
        const session: WorkoutSession = {
          id: `${dateISO}-${day}-${Date.now()}`,
          day, title: tpl.title, dateISO,
          week: programWeek(dateISO),
          exercises: tpl.blocks.map(b => ({
            exerciseId: b.exerciseId,
            sets: Array.from({ length: b.plan.sets }, () => ({ weight: 0, reps: 0, done: false }))
          })),
          completedPct: 0
        }
        set(s => ({ sessions: [...s.sessions, session] }))
        return session
      },

      saveSession: (session) => set(s => ({
        sessions: s.sessions.some(x => x.id === session.id)
          ? s.sessions.map(x => (x.id === session.id ? session : x))
          : [...s.sessions, session]
      })),

      logBody: (entry) => set(s => ({
        body: [...s.body.filter(b => b.dateISO !== entry.dateISO), entry].sort((a, b) => a.dateISO.localeCompare(b.dateISO))
      })),

      logNutrition: (entry) => set(s => {
        const cur = s.nutrition.find(n => n.dateISO === entry.dateISO) ||
          { dateISO: entry.dateISO, kcal: 0, proteinG: 0, waterMl: 0 }
        const merged = { ...cur, ...entry }
        return { nutrition: [...s.nutrition.filter(n => n.dateISO !== entry.dateISO), merged].sort((a, b) => a.dateISO.localeCompare(b.dateISO)) }
      }),

      addNutritionMeal: (dateISO, kcal, proteinG) => {
        const cur = get().nutrition.find(n => n.dateISO === dateISO) || { dateISO, kcal: 0, proteinG: 0, waterMl: 0 }
        get().logNutrition({ dateISO, kcal: cur.kcal + kcal, proteinG: cur.proteinG + proteinG })
      },

      addWater: (dateISO, ml) => {
        const cur = get().nutrition.find(n => n.dateISO === dateISO) || { dateISO, kcal: 0, proteinG: 0, waterMl: 0 }
        get().logNutrition({ dateISO, waterMl: Math.max(0, cur.waterMl + ml) })
      },

      setSteps: (dateISO, steps) => get().logNutrition({ dateISO, steps: Math.max(0, steps) }),

      saveCheckin: (c) => set(s => ({
        checkins: [...s.checkins.filter(x => x.weekISO !== c.weekISO), c].sort((a, b) => a.weekISO.localeCompare(b.weekISO))
      })),

      addChat: (m) => set(s => ({ chat: [...s.chat, m] })),
      clearChat: () => set({ chat: [] }),
      resetDemo: () => set({ ...DEMO, sessions: seedSessions(), body: seedBody(), nutrition: [], checkins: [], chat: [] })
    }),
    {
      name: 'fitcoach-surya-v1',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

// ---- Derived selectors ----
export function nutritionFor(dateISO: string, list: NutritionEntry[]): NutritionEntry {
  return list.find(n => n.dateISO === dateISO) || { dateISO, kcal: 0, proteinG: 0, waterMl: 0 }
}

export function weeklyWeightAvg(body: BodyEntry[], refISO = todayISO()): number | undefined {
  const wk = weekStartISO(refISO)
  const inWeek = body.filter(b => b.weightKg != null && weekStartISO(b.dateISO) === wk)
  if (inWeek.length === 0) {
    const withW = body.filter(b => b.weightKg != null)
    return withW.length ? withW[withW.length - 1].weightKg : undefined
  }
  return +(inWeek.reduce((a, b) => a + (b.weightKg || 0), 0) / inWeek.length).toFixed(1)
}

export { NUTRITION_TARGETS }
