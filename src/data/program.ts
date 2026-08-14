import type { WorkoutTemplate, DayKey } from '../types'

// Program start: Sunday 6 September 2026. 12-week fat-loss + muscle-gain block.
export const PROGRAM_START_ISO = '2026-09-06'
export const PROGRAM_WEEKS = 12

// Gym days: Thu / Fri / Sat (work Sun-Wed on long shifts).
export const WORKOUTS: Record<DayKey, WorkoutTemplate> = {
  thu: {
    day: 'thu', title: 'Upper Body', focus: 'Chest, back, shoulders & arms',
    blocks: [
      { exerciseId: 'barbell_bench', plan: { sets: 4, reps: '6-8', restSec: 120, startWeightHint: 'Bar + light plates; last 2 reps should be tough.' } },
      { exerciseId: 'lat_pulldown', plan: { sets: 4, reps: '8-10', restSec: 90 } },
      { exerciseId: 'incline_db_press', plan: { sets: 3, reps: '8-12', restSec: 90 } },
      { exerciseId: 'seated_cable_row', plan: { sets: 3, reps: '10-12', restSec: 90 } },
      { exerciseId: 'db_shoulder_press', plan: { sets: 3, reps: '8-12', restSec: 75 } },
      { exerciseId: 'db_lateral_raise', plan: { sets: 3, reps: '12-15', restSec: 60 } },
      { exerciseId: 'triceps_pushdown', plan: { sets: 3, reps: '10-15', restSec: 60 } },
      { exerciseId: 'db_biceps_curl', plan: { sets: 3, reps: '10-15', restSec: 60 } }
    ]
  },
  fri: {
    day: 'fri', title: 'Lower Body + Core', focus: 'Quads, hamstrings, glutes, calves & abs',
    blocks: [
      { exerciseId: 'back_squat', plan: { sets: 4, reps: '6-8', restSec: 150, startWeightHint: 'Start light and own the depth before loading.' } },
      { exerciseId: 'romanian_deadlift', plan: { sets: 3, reps: '8-10', restSec: 120 } },
      { exerciseId: 'leg_press', plan: { sets: 3, reps: '10-12', restSec: 90 } },
      { exerciseId: 'walking_lunge', plan: { sets: 3, reps: '10-12 / leg', restSec: 90 } },
      { exerciseId: 'leg_curl', plan: { sets: 3, reps: '10-15', restSec: 75 } },
      { exerciseId: 'standing_calf_raise', plan: { sets: 4, reps: '12-20', restSec: 45 } },
      { exerciseId: 'hanging_leg_raise', plan: { sets: 3, reps: '10-15', restSec: 60 } },
      { exerciseId: 'plank', plan: { sets: 3, reps: '30-60 sec', restSec: 45 } }
    ]
  },
  sat: {
    day: 'sat', title: 'Full Body', focus: 'Whole-body strength & conditioning',
    blocks: [
      { exerciseId: 'deadlift', plan: { sets: 4, reps: '5-6', restSec: 150, startWeightHint: 'Perfect the hinge; keep the back flat.' } },
      { exerciseId: 'db_bench', plan: { sets: 3, reps: '8-12', restSec: 90 } },
      { exerciseId: 'one_arm_db_row', plan: { sets: 3, reps: '8-12 / arm', restSec: 90 } },
      { exerciseId: 'goblet_squat', plan: { sets: 3, reps: '10-12', restSec: 90 } },
      { exerciseId: 'overhead_press', plan: { sets: 3, reps: '8-10', restSec: 90 } },
      { exerciseId: 'kb_swing', plan: { sets: 3, reps: '15-20', restSec: 60 } },
      { exerciseId: 'plank', plan: { sets: 3, reps: '30-60 sec', restSec: 45 } }
    ]
  }
}

export const DAY_ORDER: DayKey[] = ['thu', 'fri', 'sat']

// Weekly progression guidance shown on the dashboard / program page.
export interface PhaseInfo { weeks: string; name: string; focus: string }
export const PHASES: PhaseInfo[] = [
  { weeks: 'Weeks 1-3', name: 'Foundation', focus: 'Groove technique, moderate loads, build the habit. RPE 7.' },
  { weeks: 'Weeks 4-6', name: 'Build', focus: 'Add weight/reps each week. Push compounds harder. RPE 8.' },
  { weeks: 'Weeks 7-9', name: 'Intensify', focus: 'Heavier top sets, tighten nutrition for fat loss. RPE 8-9.' },
  { weeks: 'Weeks 10-11', name: 'Peak', focus: 'Highest quality effort, chase progressive overload. RPE 9.' },
  { weeks: 'Week 12', name: 'Deload / Re-test', focus: 'Lighter volume, re-measure body scan & lifts.' }
]

export function phaseForWeek(week: number): PhaseInfo {
  if (week <= 3) return PHASES[0]
  if (week <= 6) return PHASES[1]
  if (week <= 9) return PHASES[2]
  if (week <= 11) return PHASES[3]
  return PHASES[4]
}
