import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp, nutritionFor, weeklyWeightAvg, NUTRITION_TARGETS } from '../store/store'
import { WORKOUTS, DAY_ORDER, phaseForWeek, PROGRAM_START_ISO } from '../data/program'
import { PROFILE } from '../data/baseline'
import { todayISO, dayKeyForDate, programWeek, nextGymDay, fmtDate, daysUntilStart } from '../lib/dates'
import { ProgressRing, Bar } from '../components/ui'

export default function Today() {
  const nav = useNavigate()
  const { sessions, body, nutrition } = useApp()
  const today = todayISO()
  const week = programWeek(today)
  const phase = phaseForWeek(week)
  const todayKey = dayKeyForDate(today)
  const next = nextGymDay(today)
  const daysToStart = daysUntilStart(today)

  const wAvg = weeklyWeightAvg(body, today)
  const latestWeight = [...body].reverse().find(b => b.weightKg != null)?.weightKg
  const n = nutritionFor(today, nutrition)
  const completedCount = sessions.filter(s => (s.completedPct ?? 0) >= 60).length

  const heroKey = todayKey ?? next.dayKey
  const heroDate = todayKey ? today : next.dateISO
  const tpl = WORKOUTS[heroKey]

  return (
    <div>
      <header className="mb-5">
        <div className="text-sm text-muted">Week {week} of 12 · {phase.name}</div>
        <h1 className="text-3xl font-extrabold tracking-tight">FitCoach <span className="text-brand">Surya</span></h1>
      </header>

      {daysToStart > 0 && (
        <div className="card mb-4 border-accent/40">
          <div className="label text-accent">Program starts</div>
          <div className="font-semibold">{fmtDate(PROGRAM_START_ISO)} · in {daysToStart} day{daysToStart === 1 ? '' : 's'}</div>
          <div className="text-xs text-muted mt-1">You can explore workouts and log data now — everything runs on demo data.</div>
        </div>
      )}

      {/* Hero: today's / next workout */}
      <button onClick={() => nav(`/workout/${heroKey}`)}
        className="w-full text-left card mb-5 bg-gradient-to-br from-brand2/25 to-panel border-brand/30 active:scale-[0.99] transition">
        <div className="flex items-center justify-between">
          <div>
            <div className="label text-brand">{todayKey ? "Today's workout" : `Next · ${fmtDate(heroDate)}`}</div>
            <div className="text-2xl font-bold mt-0.5">{tpl.title}</div>
            <div className="text-sm text-muted">{tpl.focus}</div>
            <div className="text-xs text-muted mt-2">{tpl.blocks.length} exercises · up to 90 min</div>
          </div>
          <div className="text-4xl">🏋️</div>
        </div>
        <div className="btn btn-primary btn-lg w-full mt-4">{todayKey ? 'Start workout' : 'Preview workout'}</div>
      </button>

      {/* Week schedule */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {DAY_ORDER.map(d => {
          const done = sessions.some(s => s.day === d && (s.completedPct ?? 0) >= 60 && programWeek(s.dateISO) === week)
          const t = WORKOUTS[d]
          const isToday = d === todayKey
          return (
            <button key={d} onClick={() => nav(`/workout/${d}`)}
              className={`card py-3 text-center ${isToday ? 'border-brand' : ''}`}>
              <div className="label">{d === 'thu' ? 'Thu' : d === 'fri' ? 'Fri' : 'Sat'}</div>
              <div className="text-sm font-semibold mt-1 leading-tight">{t.title}</div>
              <div className="mt-1 text-lg">{done ? '✅' : '⬜'}</div>
            </button>
          )
        })}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="card flex items-center gap-3">
          <ProgressRing pct={PROFILE.startWeightKg && latestWeight ? weightProgressPct(latestWeight) : 0} />
          <div>
            <div className="label">Weight</div>
            <div className="text-xl font-bold">{wAvg ?? latestWeight ?? '—'} <span className="text-xs text-muted">kg</span></div>
            <div className="text-xs text-muted">goal {PROFILE.goalWeightKg} kg</div>
          </div>
        </div>
        <div className="card">
          <div className="label">Workouts done</div>
          <div className="text-3xl font-bold mt-1">{completedCount}</div>
          <div className="text-xs text-muted">this program</div>
        </div>
      </div>

      {/* Nutrition snapshot */}
      <div className="card mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="label">Today's nutrition</div>
          <button className="text-brand text-sm font-semibold" onClick={() => nav('/nutrition')}>Log →</button>
        </div>
        <div className="space-y-2.5">
          <MiniBar label="Protein" value={n.proteinG} target={NUTRITION_TARGETS.proteinMin} unit="g" />
          <MiniBar label="Calories" value={n.kcal} target={NUTRITION_TARGETS.kcalMax} unit="kcal" color="#f59e0b" />
          <MiniBar label="Water" value={n.waterMl} target={NUTRITION_TARGETS.waterMl} unit="ml" color="#38bdf8" />
        </div>
      </div>

      <button onClick={() => nav('/coach')} className="w-full card flex items-center gap-3 active:scale-[0.99]">
        <span className="text-2xl">💬</span>
        <div className="text-left">
          <div className="font-semibold">Ask your AI Coach</div>
          <div className="text-xs text-muted">"How do I do Romanian deadlifts?"</div>
        </div>
      </button>
    </div>
  )
}

function weightProgressPct(current: number) {
  const start = 74, goal = 69
  const pct = ((start - current) / (start - goal)) * 100
  return Math.min(100, Math.max(0, pct))
}

function MiniBar({ label, value, target, unit, color }: { label: string; value: number; target: number; unit: string; color?: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted">{label}</span>
        <span className="font-semibold">{Math.round(value)} / {target} {unit}</span>
      </div>
      <Bar value={value} max={target} color={color} />
    </div>
  )
}
