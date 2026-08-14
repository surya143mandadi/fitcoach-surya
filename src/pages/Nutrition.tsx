import React, { useState } from 'react'
import { useApp, nutritionFor, NUTRITION_TARGETS } from '../store/store'
import { MEALS } from '../data/nutrition'
import { todayISO, weekStartISO, fmtDate } from '../lib/dates'
import { Bar, Section, ProgressRing } from '../components/ui'
import type { Meal } from '../types'

const SLOTS: { key: Meal['slot']; label: string }[] = [
  { key: 'breakfast', label: '🌅 Breakfast' },
  { key: 'lunch', label: '☀️ Lunch' },
  { key: 'dinner', label: '🌙 Dinner' },
  { key: 'snack', label: '🥤 Snacks' }
]

export default function Nutrition() {
  const { nutrition, addNutritionMeal, addWater, saveCheckin, checkins, body } = useApp()
  const today = todayISO()
  const n = nutritionFor(today, nutrition)
  const [tab, setTab] = useState<'log' | 'checkin'>('log')

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-3">Nutrition</h1>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button className={`btn btn-lg ${tab === 'log' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('log')}>Daily log</button>
        <button className={`btn btn-lg ${tab === 'checkin' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab('checkin')}>Weekly check-in</button>
      </div>

      {tab === 'log' ? (
        <>
          {/* Targets */}
          <div className="card mb-4">
            <div className="flex items-center gap-4 mb-3">
              <ProgressRing pct={(n.proteinG / NUTRITION_TARGETS.proteinMin) * 100} size={72} stroke={8}
                label={`${Math.round(n.proteinG)}g`} />
              <div className="flex-1 space-y-2">
                <TargetRow label="Protein" v={n.proteinG} min={NUTRITION_TARGETS.proteinMin} max={NUTRITION_TARGETS.proteinMax} unit="g" />
                <TargetRow label="Calories" v={n.kcal} min={NUTRITION_TARGETS.kcalMin} max={NUTRITION_TARGETS.kcalMax} unit="kcal" color="#f59e0b" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-muted">💧 Water</span><span className="font-semibold">{n.waterMl} / {NUTRITION_TARGETS.waterMl} ml</span></div>
              <Bar value={n.waterMl} max={NUTRITION_TARGETS.waterMl} color="#38bdf8" />
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[250, 500, 750].map(ml => <button key={ml} className="btn btn-ghost py-2.5 text-sm" onClick={() => addWater(today, ml)}>+{ml}</button>)}
                <button className="btn btn-ghost py-2.5 text-sm" onClick={() => addWater(today, -250)}>−250</button>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted mb-4">Indian non-veg plan · target avg {NUTRITION_TARGETS.kcalMin}-{NUTRITION_TARGETS.kcalMax} kcal, {NUTRITION_TARGETS.proteinMin}-{NUTRITION_TARGETS.proteinMax} g protein. Tap a meal to add it.</div>

          {SLOTS.map(slot => (
            <Section key={slot.key} title={slot.label}>
              <div className="space-y-2">
                {MEALS.filter(m => m.slot === slot.key).map(m => (
                  <button key={m.id} onClick={() => addNutritionMeal(today, m.kcal, m.proteinG)}
                    className="card w-full text-left flex items-center gap-3 active:scale-[0.99]">
                    <div className="flex-1">
                      <div className="font-semibold text-sm flex items-center gap-2">{m.name}{!m.veg && <span className="chip bg-danger/20 text-danger">non-veg</span>}</div>
                      <div className="text-xs text-muted mt-0.5">{m.items.join(' · ')}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-brand font-bold text-sm">{m.proteinG}g P</div>
                      <div className="text-xs text-muted">{m.kcal} kcal</div>
                      <div className="text-lg leading-none mt-1">＋</div>
                    </div>
                  </button>
                ))}
              </div>
            </Section>
          ))}
        </>
      ) : (
        <CheckInForm />
      )}
    </div>
  )
}

function TargetRow({ label, v, min, max, unit, color }: { label: string; v: number; min: number; max: number; unit: string; color?: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1"><span className="text-muted">{label}</span><span className="font-semibold">{Math.round(v)} / {min}-{max} {unit}</span></div>
      <Bar value={v} max={max} color={color} />
    </div>
  )
}

function CheckInForm() {
  const { saveCheckin, checkins, body } = useApp()
  const wk = weekStartISO(todayISO())
  const existing = checkins.find(c => c.weekISO === wk)
  const [weight, setWeight] = useState(existing?.weightAvgKg?.toString() || '')
  const [waist, setWaist] = useState(existing?.waistCm?.toString() || '')
  const [steps, setSteps] = useState(existing?.avgSteps?.toString() || '')
  const [energy, setEnergy] = useState(existing?.energy || 3)
  const [note, setNote] = useState(existing?.note || '')
  const [saved, setSaved] = useState(false)

  function save() {
    saveCheckin({
      weekISO: wk,
      weightAvgKg: weight ? parseFloat(weight) : undefined,
      waistCm: waist ? parseFloat(waist) : undefined,
      avgSteps: steps ? parseInt(steps) : undefined,
      energy, note
    })
    setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="label">Week of {fmtDate(wk)}</div>
        <p className="text-sm text-muted mt-1">Log your weekly averages. Weigh in a few mornings and use the mean — daily weight bounces around.</p>
      </div>
      <div className="card space-y-3">
        <Field label="Avg weight this week (kg)" value={weight} onChange={setWeight} />
        <Field label="Waist (cm)" value={waist} onChange={setWaist} />
        <Field label="Avg daily steps" value={steps} onChange={setSteps} />
        <div>
          <label className="label">Energy / recovery (1-5)</label>
          <div className="flex gap-2 mt-1">
            {[1, 2, 3, 4, 5].map(v => (
              <button key={v} onClick={() => setEnergy(v)} className={`btn flex-1 py-3 ${energy === v ? 'btn-primary' : 'btn-ghost'}`}>{v}</button>
            ))}
          </div>
        </div>
        <div><label className="label">Notes</label><textarea className="field mt-1 h-24" value={note} onChange={e => setNote(e.target.value)} placeholder="Wins, struggles, sleep, adherence..." /></div>
        <button className="btn btn-primary btn-lg w-full" onClick={save}>{saved ? '✓ Saved' : 'Save check-in'}</button>
      </div>

      {checkins.length > 0 && (
        <Section title="History">
          <div className="card divide-y divide-line">
            {[...checkins].reverse().map(c => (
              <div key={c.weekISO} className="py-2.5 first:pt-0 last:pb-0 text-sm">
                <div className="font-semibold">{fmtDate(c.weekISO)}</div>
                <div className="text-xs text-muted">{c.weightAvgKg ? c.weightAvgKg + 'kg · ' : ''}{c.waistCm ? c.waistCm + 'cm · ' : ''}{c.avgSteps ? c.avgSteps + ' steps · ' : ''}energy {c.energy}/5</div>
                {c.note && <div className="text-xs mt-1">{c.note}</div>}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return <div><label className="label">{label}</label><input className="field mt-1" type="number" inputMode="decimal" value={value} onChange={e => onChange(e.target.value)} /></div>
}
