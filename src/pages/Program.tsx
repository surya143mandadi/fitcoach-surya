import React from 'react'
import { useNavigate } from 'react-router-dom'
import { WORKOUTS, DAY_ORDER, PHASES, phaseForWeek, PROGRAM_START_ISO, PROGRAM_WEEKS } from '../data/program'
import { getExercise } from '../data/exercises'
import { PROFILE, BASELINE_SCAN } from '../data/baseline'
import { NUTRITION_TARGETS } from '../data/nutrition'
import { useApp } from '../store/store'
import { todayISO, programWeek, fmtDate } from '../lib/dates'
import { Section } from '../components/ui'

export default function Program() {
  const nav = useNavigate()
  const { resetDemo } = useApp()
  const week = programWeek(todayISO())
  const curPhase = phaseForWeek(week)

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">12-Week Plan</h1>
      <p className="text-sm text-muted mb-5">Starts {fmtDate(PROGRAM_START_ISO)} · fat loss + muscle gain</p>

      <div className="card mb-5 border-brand/30">
        <div className="label text-brand">Current phase · Week {week}/{PROGRAM_WEEKS}</div>
        <div className="text-xl font-bold mt-0.5">{curPhase.name}</div>
        <div className="text-sm text-muted mt-1">{curPhase.focus}</div>
      </div>

      <Section title="Your profile">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info k="Age / height" v={`${PROFILE.age} · ${PROFILE.heightCm} cm`} />
          <Info k="Experience" v={PROFILE.experience} />
          <Info k="Start weight" v={`${PROFILE.startWeightKg} kg`} />
          <Info k="Goal weight" v={`${PROFILE.goalWeightKg} kg (68-70)`} />
          <Info k="Baseline BF%" v={`${BASELINE_SCAN.bodyFatPct}%`} />
          <Info k="Baseline waist" v={`${BASELINE_SCAN.waistCm} cm`} />
          <Info k="Skeletal muscle" v={`${BASELINE_SCAN.skeletalMuscleKg} kg`} />
          <Info k="Step goal" v={`${PROFILE.stepGoal}/day`} />
        </div>
      </Section>

      <Section title="Nutrition targets">
        <div className="card text-sm space-y-1">
          <div className="flex justify-between"><span className="text-muted">Calories</span><span className="font-semibold">{NUTRITION_TARGETS.kcalMin}-{NUTRITION_TARGETS.kcalMax} kcal/day</span></div>
          <div className="flex justify-between"><span className="text-muted">Protein</span><span className="font-semibold">{NUTRITION_TARGETS.proteinMin}-{NUTRITION_TARGETS.proteinMax} g/day</span></div>
          <div className="flex justify-between"><span className="text-muted">Water</span><span className="font-semibold">{NUTRITION_TARGETS.waterMl}+ ml/day</span></div>
          <div className="text-xs text-muted pt-1">Indian non-veg · chicken, fish, prawns, lamb</div>
        </div>
      </Section>

      <Section title="Weekly split">
        <div className="space-y-2">
          {DAY_ORDER.map(d => {
            const t = WORKOUTS[d]
            return (
              <button key={d} onClick={() => nav(`/workout/${d}`)} className="card w-full text-left active:scale-[0.99]">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="label">{d === 'thu' ? 'Thursday' : d === 'fri' ? 'Friday' : 'Saturday'}</div>
                    <div className="font-bold text-lg">{t.title}</div>
                    <div className="text-xs text-muted">{t.blocks.map(b => getExercise(b.exerciseId)?.name).slice(0, 3).join(', ')}…</div>
                  </div>
                  <span className="text-brand text-xl">→</span>
                </div>
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="Progression phases">
        <div className="card divide-y divide-line">
          {PHASES.map(p => (
            <div key={p.weeks} className={`py-2.5 first:pt-0 last:pb-0 ${p.name === curPhase.name ? '' : 'opacity-70'}`}>
              <div className="flex justify-between"><span className="font-semibold text-sm">{p.name}</span><span className="text-xs text-muted">{p.weeks}</span></div>
              <div className="text-xs text-muted mt-0.5">{p.focus}</div>
            </div>
          ))}
        </div>
      </Section>

      <div className="card mb-4">
        <div className="label mb-1">Account</div>
        <p className="text-xs text-muted mb-3">Running in local demo mode — all data is stored privately on this device. Sign-in and cloud sync are ready to enable in a future update.</p>
        <button className="btn btn-ghost w-full text-danger" onClick={() => { if (confirm('Reset all demo data?')) resetDemo() }}>Reset demo data</button>
      </div>
    </div>
  )
}

function Info({ k, v }: { k: string; v: string }) {
  return <div className="card py-2.5"><div className="label">{k}</div><div className="font-semibold mt-0.5">{v}</div></div>
}
