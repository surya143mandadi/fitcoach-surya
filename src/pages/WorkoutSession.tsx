import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { DayKey, WorkoutSession as WS, SetLog } from '../types'
import { WORKOUTS } from '../data/program'
import { getExercise } from '../data/exercises'
import { useApp } from '../store/store'
import { todayISO, programWeek, fmtDate } from '../lib/dates'
import { overloadAdvice, lastLogFor, sessionCompletion } from '../lib/progression'
import { RestTimer } from '../components/RestTimer'
import { ProgressRing, VideoArea } from '../components/ui'

export default function WorkoutSession() {
  const { day } = useParams<{ day: DayKey }>()
  const nav = useNavigate()
  const { sessions, startOrGetSession, saveSession } = useApp()
  const dayKey = (day as DayKey) || 'thu'
  const tpl = WORKOUTS[dayKey]
  const dateISO = todayISO()

  const [session, setSession] = useState<WS>(() => startOrGetSession(dayKey, dateISO))
  const [restSec, setRestSec] = useState<number | null>(null)
  const [openIdx, setOpenIdx] = useState(0)

  const plannedSetsById = useMemo(() => {
    const m: Record<string, number> = {}
    tpl.blocks.forEach(b => { m[b.exerciseId] = b.plan.sets })
    return m
  }, [tpl])

  const completion = sessionCompletion(session, plannedSetsById)

  function update(next: WS) {
    const withPct = { ...next, completedPct: sessionCompletion(next, plannedSetsById) }
    setSession(withPct)
    saveSession(withPct)
  }

  function setSetVal(exId: string, setIdx: number, patch: Partial<SetLog>) {
    update({
      ...session,
      exercises: session.exercises.map(e => e.exerciseId !== exId ? e : {
        ...e, sets: e.sets.map((s, i) => i === setIdx ? { ...s, ...patch } : s)
      })
    })
  }

  function finish() {
    update({ ...session, finishedAt: new Date().toISOString() })
    nav('/dashboard')
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => nav('/')} className="btn btn-ghost h-11 w-11 rounded-2xl text-xl">‹</button>
        <div className="flex-1">
          <div className="text-xs text-muted">Week {programWeek(dateISO)} · {fmtDate(dateISO)}</div>
          <h1 className="text-xl font-bold leading-tight">{tpl.title}</h1>
        </div>
        <ProgressRing pct={completion} size={52} stroke={6} />
      </div>

      <div className="space-y-3">
        {tpl.blocks.map((b, idx) => {
          const ex = getExercise(b.exerciseId)!
          const log = session.exercises.find(e => e.exerciseId === b.exerciseId)!
          const open = openIdx === idx
          const doneSets = log.sets.filter(s => s.done).length
          const prev = lastLogFor(b.exerciseId, sessions.filter(s => s.id !== session.id))
          const advice = overloadAdvice(b.plan, b.exerciseId, sessions.filter(s => s.id !== session.id))
          return (
            <div key={b.exerciseId} className="card">
              <button className="w-full flex items-center gap-3 text-left" onClick={() => setOpenIdx(open ? -1 : idx)}>
                <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center font-bold text-sm ${doneSets === b.plan.sets ? 'bg-brand text-black' : 'bg-panel2 text-muted'}`}>
                  {doneSets === b.plan.sets ? '✓' : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold leading-tight truncate">{ex.name}</div>
                  <div className="text-xs text-muted">{b.plan.sets} × {b.plan.reps} · rest {b.plan.restSec}s · {doneSets}/{b.plan.sets} done</div>
                </div>
                <span className="text-muted">{open ? '▾' : '▸'}</span>
              </button>

              {open && (
                <div className="mt-3 pt-3 border-t border-line space-y-3">
                  <VideoArea url={ex.videoUrl} name={ex.name} />

                  {/* Progression recommendation */}
                  <div className={`rounded-2xl p-3 text-sm ${advice.tone === 'up' ? 'bg-brand2/20 border border-brand/30' : 'bg-panel2 border border-line'}`}>
                    <div className="font-semibold flex items-center gap-1">
                      {advice.tone === 'up' ? '⬆️' : advice.tone === 'info' ? '💡' : '➡️'} {advice.headline}
                    </div>
                    <div className="text-muted text-xs mt-1">{advice.detail}</div>
                  </div>

                  {prev && (
                    <div className="text-xs text-muted">
                      Previous ({fmtDate(prev.session.dateISO)}): {prev.log.sets.filter(s => s.done).map(s => `${s.weight}kg×${s.reps}`).join('  ·  ') || '—'}
                    </div>
                  )}

                  {/* Set logging grid */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-[28px_1fr_1fr_52px] gap-2 text-[11px] text-muted font-semibold px-1">
                      <span>SET</span><span>KG</span><span>REPS</span><span className="text-center">DONE</span>
                    </div>
                    {log.sets.map((s, i) => (
                      <div key={i} className={`grid grid-cols-[28px_1fr_1fr_52px] gap-2 items-center ${s.done ? 'opacity-70' : ''}`}>
                        <span className="text-sm font-bold text-muted text-center">{i + 1}</span>
                        <input type="number" inputMode="decimal" className="field py-2.5 text-center" value={s.weight || ''}
                          placeholder={advice.suggestWeight ? String(advice.suggestWeight) : '0'}
                          onChange={e => setSetVal(b.exerciseId, i, { weight: parseFloat(e.target.value) || 0 })} />
                        <input type="number" inputMode="numeric" className="field py-2.5 text-center" value={s.reps || ''}
                          placeholder="0"
                          onChange={e => setSetVal(b.exerciseId, i, { reps: parseInt(e.target.value) || 0 })} />
                        <button onClick={() => { setSetVal(b.exerciseId, i, { done: !s.done }); if (!s.done) setRestSec(b.plan.restSec) }}
                          className={`btn h-10 ${s.done ? 'btn-primary' : 'btn-ghost'}`}>{s.done ? '✓' : '○'}</button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button className="btn btn-ghost btn-lg" onClick={() => setRestSec(b.plan.restSec)}>⏱ Rest {b.plan.restSec}s</button>
                    <button className="btn btn-ghost btn-lg" onClick={() => nav(`/exercise/${ex.id}`)}>ℹ️ How-to</button>
                  </div>
                  {ex.easierAltId && (
                    <button className="w-full text-sm text-brand font-semibold py-1" onClick={() => nav(`/exercise/${ex.easierAltId}`)}>
                      Need it easier? → {getExercise(ex.easierAltId)?.name}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="sticky bottom-4 mt-5">
        <button onClick={finish} className="btn btn-primary btn-lg w-full shadow-lg shadow-black/40">
          Finish workout · {completion}% complete
        </button>
      </div>

      {restSec !== null && <RestTimer seconds={restSec} onClose={() => setRestSec(null)} />}
    </div>
  )
}
