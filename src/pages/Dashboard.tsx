import React, { useRef, useState } from 'react'
import { useApp, nutritionFor, weeklyWeightAvg, currentBodyWeightKg, NUTRITION_TARGETS } from '../store/store'
import { BASELINE_SCAN, PROFILE } from '../data/baseline'
import { getExercise } from '../data/exercises'
import { todayISO, fmtDate, weekStartISO } from '../lib/dates'
import { estimateSessionKcal, fmtDuration } from '../lib/calories'
import { ProgressRing, Bar, Stat, Section } from '../components/ui'
import type { BodyEntry } from '../types'

const KEY_LIFTS = ['barbell_bench', 'back_squat', 'deadlift', 'overhead_press']

export default function Dashboard() {
  const { body, sessions, nutrition, logBody, setSteps } = useApp()
  const today = todayISO()
  const fileRef = useRef<HTMLInputElement>(null)

  const latest = [...body].reverse().find(b => b.weightKg != null)
  const latestWaist = [...body].reverse().find(b => b.waistCm != null)
  const wAvg = weeklyWeightAvg(body, today)
  const startW = PROFILE.startWeightKg, goalW = PROFILE.goalWeightKg
  const curW = wAvg ?? latest?.weightKg ?? startW
  const lostPct = Math.min(100, Math.max(0, ((startW - curW) / (startW - goalW)) * 100))
  const n = nutritionFor(today, nutrition)
  const workoutsDone = sessions.filter(s => (s.completedPct ?? 0) >= 60).length

  const bw = currentBodyWeightKg(body)
  const kcalOf = (s: typeof sessions[number]) => s.kcalBurned ?? estimateSessionKcal(s, bw)
  const wkStart = weekStartISO(today)
  const kcalToday = sessions.filter(s => s.dateISO === today).reduce((a, s) => a + kcalOf(s), 0)
  const kcalWeek = sessions.filter(s => weekStartISO(s.dateISO) === wkStart).reduce((a, s) => a + kcalOf(s), 0)
  const todaySteps = n.steps || 0
  const stepPct = Math.min(100, Math.round((todaySteps / PROFILE.stepGoal) * 100))
  const recentSessions = [...sessions].filter(s => s.finishedAt).sort((a, b) => b.dateISO.localeCompare(a.dateISO)).slice(0, 4)

  // avg steps over last 7 logged days
  const stepDays = nutrition.filter(x => x.steps != null).slice(-7)
  const avgSteps = stepDays.length ? Math.round(stepDays.reduce((a, b) => a + (b.steps || 0), 0) / stepDays.length) : undefined

  // strength progress: best working set per key lift
  const strength = KEY_LIFTS.map(id => {
    let best = 0, when = ''
    sessions.forEach(s => s.exercises.filter(e => e.exerciseId === id).forEach(e =>
      e.sets.filter(x => x.done).forEach(x => { if (x.weight > best) { best = x.weight; when = s.dateISO } })))
    return { id, name: getExercise(id)?.name || id, best, when }
  }).filter(x => x.best > 0)

  const photos = body.filter(b => b.photoDataUrl).slice(-6)

  // quick body log form
  const [w, setW] = useState('')
  const [waist, setWaist] = useState('')
  function saveMeasure() {
    const entry: BodyEntry = { dateISO: today }
    if (w) entry.weightKg = parseFloat(w)
    if (waist) entry.waistCm = parseFloat(waist)
    if (entry.weightKg || entry.waistCm) { logBody({ ...(body.find(b => b.dateISO === today) || {}), ...entry }); setW(''); setWaist('') }
  }
  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader()
    r.onload = () => logBody({ ...(body.find(b => b.dateISO === today) || { dateISO: today }), dateISO: today, photoDataUrl: r.result as string })
    r.readAsDataURL(f)
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-1">Transformation</h1>
      <p className="text-sm text-muted mb-5">Baseline scan {fmtDate(BASELINE_SCAN.dateISO)} → goal {goalW} kg</p>

      {/* Weight hero */}
      <div className="card mb-4 flex items-center gap-5">
        <ProgressRing pct={lostPct} size={92} stroke={9} label={`${Math.round(lostPct)}%`} />
        <div className="flex-1">
          <div className="label">Body weight</div>
          <div className="text-3xl font-bold">{curW} <span className="text-sm text-muted">kg</span></div>
          <div className="text-xs text-muted">weekly avg · start {startW} → target {goalW}</div>
          <div className="mt-2 text-xs">{(startW - curW).toFixed(1)} kg of {(startW - goalW).toFixed(1)} kg to goal</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Stat label="Target weight" value={goalW} unit="kg" sub="68-70 kg range" />
        <Stat label="Waist" value={latestWaist?.waistCm ?? BASELINE_SCAN.waistCm} unit="cm" sub={`baseline ${BASELINE_SCAN.waistCm} cm`} />
        <Stat label="Weekly avg" value={wAvg ?? '—'} unit="kg" sub="7-day mean" />
        <Stat label="Workouts done" value={workoutsDone} sub="this program" />
        <Stat label="Avg steps" value={avgSteps ?? '—'} sub={`goal ${PROFILE.stepGoal}`} />
        <Stat label="Body fat" value={BASELINE_SCAN.bodyFatPct} unit="%" sub={`goal ${PROFILE.goalBodyFatPct}%`} />
      </div>

      {/* Activity: steps + calories burned */}
      <Section title="Activity">
        <div className="card flex items-center gap-5">
          <ProgressRing pct={stepPct} size={84} stroke={8} label={`${stepPct}%`} />
          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between text-sm"><span className="text-muted">Steps today</span><span className="font-bold">{todaySteps.toLocaleString()} / {PROFILE.stepGoal.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">🔥 Burned today</span><span className="font-bold text-amber-400">{kcalToday} kcal</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">Burned this week</span><span className="font-semibold">{kcalWeek} kcal</span></div>
          </div>
        </div>
        {recentSessions.length > 0 && (
          <div className="card mt-3 divide-y divide-line">
            {recentSessions.map(s => (
              <div key={s.id} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
                <div><div className="font-semibold text-sm">{s.title}</div><div className="text-xs text-muted">{fmtDate(s.dateISO)}{s.durationSec ? ` · ${fmtDuration(s.durationSec)}` : ''}</div></div>
                <div className="text-right"><div className="text-brand font-bold">{kcalOf(s)} kcal</div><div className="text-xs text-muted">{s.completedPct}% done</div></div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Today intake */}
      <Section title="Today's intake">
        <div className="card space-y-3">
          <Row label="Protein" v={n.proteinG} t={NUTRITION_TARGETS.proteinMin} unit="g" />
          <Row label="Calories" v={n.kcal} t={NUTRITION_TARGETS.kcalMax} unit="kcal" color="#f59e0b" />
          <Row label="Water" v={n.waterMl} t={NUTRITION_TARGETS.waterMl} unit="ml" color="#38bdf8" />
        </div>
      </Section>

      {/* Strength progress */}
      {strength.length > 0 && (
        <Section title="Strength progress">
          <div className="card divide-y divide-line">
            {strength.map(s => (
              <div key={s.id} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
                <div><div className="font-semibold text-sm">{s.name}</div><div className="text-xs text-muted">best set · {fmtDate(s.when)}</div></div>
                <div className="text-lg font-bold text-brand">{s.best} kg</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Progress photos */}
      <Section title="Progress photos" right={<button className="text-brand text-sm font-semibold" onClick={() => fileRef.current?.click()}>+ Add</button>}>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onPhoto} />
        {photos.length === 0 ? (
          <button onClick={() => fileRef.current?.click()} className="card w-full text-muted text-sm py-8">📷 Add your first progress photo</button>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((p, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden border border-line">
                <img src={p.photoDataUrl} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Quick log */}
      <Section title="Log measurement">
        <div className="card space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Weight (kg)</label><input className="field mt-1" type="number" inputMode="decimal" value={w} onChange={e => setW(e.target.value)} placeholder={String(curW)} /></div>
            <div><label className="label">Waist (cm)</label><input className="field mt-1" type="number" inputMode="decimal" value={waist} onChange={e => setWaist(e.target.value)} placeholder={String(latestWaist?.waistCm ?? BASELINE_SCAN.waistCm)} /></div>
          </div>
          <button className="btn btn-primary btn-lg w-full" onClick={saveMeasure}>Save today's measurement</button>
          <div className="pt-2 border-t border-line">
            <label className="label">Today's steps</label>
            <div className="flex gap-2 mt-1">
              <input className="field" type="number" inputMode="numeric" defaultValue={n.steps || ''} placeholder={String(PROFILE.stepGoal)}
                onBlur={e => e.target.value && setSteps(today, parseInt(e.target.value))} />
              <button className="btn btn-ghost px-5" onClick={() => setSteps(today, PROFILE.stepGoal)}>Goal</button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

function Row({ label, v, t, unit, color }: { label: string; v: number; t: number; unit: string; color?: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1"><span className="text-muted">{label}</span><span className="font-semibold">{Math.round(v)} / {t} {unit}</span></div>
      <Bar value={v} max={t} color={color} />
    </div>
  )
}
