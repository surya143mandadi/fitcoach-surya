import { EXERCISE_LIST, getExercise } from '../data/exercises'
import type { Exercise, WorkoutSession, PlannedSet } from '../types'
import { overloadAdvice } from './progression'

// ---- Injury / pain safety guardrail (non-negotiable) ----
const PAIN_WORDS = ['pain', 'hurts', 'hurt', 'injured', 'injury', 'pop', 'popped', 'snap', 'sharp',
  'swollen', 'swelling', 'sprain', 'strain', 'tear', 'torn', 'numb', 'tingling', 'dizzy',
  'faint', 'can\'t breathe', 'cant breathe', 'chest pain', 'pulled']

export function isPainReport(text: string): boolean {
  const t = text.toLowerCase()
  return PAIN_WORDS.some(w => t.includes(w))
}

export const INJURY_RESPONSE =
  'It sounds like you may be experiencing pain or an injury. I am a coaching assistant, not a medical professional, and I cannot diagnose injuries.\n\n' +
  'Please stop the exercise now. If you have significant pain, swelling, numbness, chest pain or trouble breathing, ' +
  'seek an appropriate healthcare professional (your doctor, physiotherapist, or emergency services if it is serious).\n\n' +
  'Once you have been cleared, I can help you ease back in with lighter alternatives.'

// ---- Intent matching for the demo coach (works offline) ----
function findExerciseInText(text: string): Exercise | undefined {
  const t = text.toLowerCase()
  // direct name / keyword matches
  const aliases: Record<string, string> = {
    'romanian deadlift': 'romanian_deadlift', 'rdl': 'romanian_deadlift',
    'deadlift': 'deadlift', 'bench': 'barbell_bench', 'squat': 'back_squat',
    'lat pulldown': 'lat_pulldown', 'pulldown': 'lat_pulldown', 'row': 'seated_cable_row',
    'shoulder press': 'db_shoulder_press', 'overhead press': 'overhead_press', 'ohp': 'overhead_press',
    'lateral raise': 'db_lateral_raise', 'curl': 'db_biceps_curl', 'pushdown': 'triceps_pushdown',
    'leg press': 'leg_press', 'lunge': 'walking_lunge', 'leg curl': 'leg_curl',
    'calf': 'standing_calf_raise', 'plank': 'plank', 'leg raise': 'hanging_leg_raise',
    'woodchop': 'cable_woodchop', 'kettlebell': 'kb_swing', 'swing': 'kb_swing',
    'goblet': 'goblet_squat', 'push up': 'pushup', 'pushup': 'pushup'
  }
  for (const [k, id] of Object.entries(aliases)) if (t.includes(k)) return getExercise(id)
  return EXERCISE_LIST.find(e => t.includes(e.name.toLowerCase()))
}

export interface CoachContext {
  sessions: WorkoutSession[]
  currentExerciseId?: string
  currentPlan?: PlannedSet
}

export function demoCoachReply(text: string, ctx: CoachContext): string {
  if (isPainReport(text)) return INJURY_RESPONSE
  const t = text.toLowerCase()
  const ex = findExerciseInText(text) ||
    (ctx.currentExerciseId ? getExercise(ctx.currentExerciseId) : undefined)

  // "I completed 10,10,10 reps - should I increase the weight?"
  const repMatches = text.match(/\b(\d{1,3})\s*(?:,|\/|reps?|x)\s*(\d{1,3})/i)
  const listedReps = (text.match(/\d{1,3}/g) || []).map(Number).filter(n => n > 0 && n < 100)
  const asksIncrease = /increase|heavier|go up|more weight|add weight|progress/.test(t)
  if ((asksIncrease || repMatches) && (ex || ctx.currentPlan) && listedReps.length >= 2) {
    const plan = ctx.currentPlan
    const exId = ex?.id || ctx.currentExerciseId
    if (plan && exId) {
      const adv = overloadAdvice(plan, exId, ctx.sessions)
      const top = plan.reps
      const min = Math.min(...listedReps)
      const consistent = listedReps.every(r => r === listedReps[0])
      const hitTop = listedReps.every(r => r >= parseInt((top.match(/(\d+)\s*-?\s*(\d+)?/) || [])[2] || top, 10))
      const answer = hitTop
        ? `Yes. You hit the top of your ${top} range on every set (${listedReps.join(', ')}), so bump the weight up by 2.5-5 kg next session and aim for the lower end of the range again.`
        : `Not yet. Your sets were ${listedReps.join(', ')}. Keep the same weight until you can hit the top of the ${top} range on all sets with clean form, then add 2.5-5 kg.`
      return `${answer}${!consistent && min < listedReps[0] ? ' Your reps dropped across sets, which is normal from fatigue.' : ''}`
    }
  }

  // "What weight should I use?"
  if (/what weight|how (much|heavy)|which weight|starting weight/.test(t)) {
    if (ex && ctx.currentPlan) {
      const adv = overloadAdvice(ctx.currentPlan, ex.id, ctx.sessions)
      return `For ${ex.name}: ${adv.detail}${ctx.currentPlan.startWeightHint ? ' Tip: ' + ctx.currentPlan.startWeightHint : ''}`
    }
    if (ex) return `For ${ex.name}, pick a weight where your last 1-2 reps are challenging but your technique stays clean. Log it and I will guide the next jump.`
    return 'Tell me which exercise, and pick a weight where the last 1-2 reps are hard but your form stays clean. When in doubt, start lighter and add weight next set.'
  }

  // "Show me an easier alternative" / "My gym doesn't have this machine"
  if (/easier|alternative|substitut|swap|replace|instead|don'?t have|no machine|machine.*broken|missing/.test(t)) {
    if (ex) {
      const alt = ex.easierAltId ? getExercise(ex.easierAltId) : undefined
      if (alt) {
        return `Easier / no-equipment swap for ${ex.name}: **${alt.name}** (${alt.equipment}).\n\n` +
          `How to do it: ${alt.steps.join(' ')}\n\nIt trains the same muscles (${alt.primary.join(', ')}) with less setup. Open it from the exercise screen's "Easier alternative" button too.`
      }
      const sameMuscle = EXERCISE_LIST.filter(e => e.id !== ex.id && e.primary.some(m => ex.primary.includes(m)))
      if (sameMuscle[0]) return `Try **${sameMuscle[0].name}** instead of ${ex.name} - it hits the same muscles (${ex.primary.join(', ')}).`
    }
    return 'Tell me which exercise you want to swap and I will give you an easier or no-equipment alternative that trains the same muscles.'
  }

  // "How do I do X?" / technique
  if (ex && /how (do|to)|technique|form|perform|do (a|the)|proper/.test(t)) {
    return `**${ex.name}** - ${ex.primary.join(', ')}\n\n` +
      `Setup: ${ex.setup.join(' ')}\n\n` +
      `Steps:\n${ex.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n` +
      `Breathing: ${ex.breathing}\n\n` +
      `Watch out for: ${ex.mistakes.join(' ')}\n\n` +
      `Safety: ${ex.safety.join(' ')}` +
      (ex.easierAltId ? `\n\nEasier option: ${getExercise(ex.easierAltId)?.name}.` : '')
  }

  if (ex) {
    return `**${ex.name}** trains ${ex.primary.join(', ')}${ex.secondary.length ? ' (plus ' + ex.secondary.join(', ') + ')' : ''}. ` +
      `Ask me "how do I do it", "what weight should I use", or "show me an easier alternative".`
  }

  // Nutrition / general
  if (/protein|eat|diet|food|meal|calorie|kcal/.test(t)) {
    return 'Aim for ~1,850-1,900 kcal/day and 140-150 g protein, built around chicken, fish, prawns and lamb. ' +
      'Check the Nutrition tab for Indian meal suggestions that hit those numbers, and log your intake there.'
  }
  if (/water|hydrat/.test(t)) return 'Target 2.5+ litres of water a day. Log it on the Nutrition tab - front-load water earlier in the day around your long shifts.'
  if (/step|walk|cardio/.test(t)) return 'Keep daily steps around 7-8k. On work days, a couple of short walks during your shift and commute add up fast.'

  return 'I can help with exercise technique, easier alternatives, what weight to use, progression, and nutrition. ' +
    'Try: "How do I do Romanian deadlifts?", "Show me an easier alternative", or "I did 10,10,10 - should I go heavier?"\n\n' +
    'Note: I cannot diagnose injuries. If something hurts, stop and see a healthcare professional.'
}

// ---- Optional external LLM (auth-ready). If VITE_COACH_API_URL is set, use it. ----
export async function coachReply(text: string, ctx: CoachContext): Promise<string> {
  if (isPainReport(text)) return INJURY_RESPONSE
  const url = import.meta.env.VITE_COACH_API_URL as string | undefined
  if (!url) return demoCoachReply(text, ctx)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        context: { currentExerciseId: ctx.currentExerciseId },
        system: 'You are FitCoach, a supportive gym coach. Never diagnose injuries; if the user reports significant pain or injury, tell them to stop and see a healthcare professional.'
      })
    })
    if (!res.ok) throw new Error('bad status')
    const data = await res.json()
    return (data.reply as string) || demoCoachReply(text, ctx)
  } catch {
    return demoCoachReply(text, ctx)
  }
}

export const SAMPLE_QUESTIONS = [
  'How do I do Romanian deadlifts?',
  'Show me an easier alternative.',
  'What weight should I use?',
  'I completed 10,10,10 reps - should I increase the weight?',
  'My gym doesn\'t have this machine.'
]
