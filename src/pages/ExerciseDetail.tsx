import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getExercise } from '../data/exercises'
import { useApp } from '../store/store'
import { lastLogFor } from '../lib/progression'
import { BackHeader, VideoArea } from '../components/ui'
import { fmtDate } from '../lib/dates'

function List({ title, items, icon }: { title: string; items: string[]; icon: string }) {
  return (
    <div className="card">
      <div className="label mb-2">{icon} {title}</div>
      <ul className="space-y-1.5 text-sm">
        {items.map((s, i) => <li key={i} className="flex gap-2"><span className="text-muted">•</span><span>{s}</span></li>)}
      </ul>
    </div>
  )
}

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const { sessions } = useApp()
  const ex = id ? getExercise(id) : undefined
  if (!ex) return <div><BackHeader title="Not found" /><p className="text-muted">Exercise not found.</p></div>

  const alt = ex.easierAltId ? getExercise(ex.easierAltId) : undefined
  const prev = lastLogFor(ex.id, sessions)

  return (
    <div className="space-y-4">
      <BackHeader title={ex.name} subtitle={ex.equipment} />
      <VideoArea url={ex.videoUrl} name={ex.name} />

      <div className="flex flex-wrap gap-1.5">
        {ex.primary.map(m => <span key={m} className="chip bg-brand text-black">{m}</span>)}
        {ex.secondary.map(m => <span key={m} className="chip bg-panel2 text-muted border border-line">{m}</span>)}
      </div>

      <List title="Setup & posture" icon="🧍" items={ex.setup} />

      <div className="card">
        <div className="label mb-2">📋 Step-by-step technique</div>
        <ol className="space-y-2 text-sm">
          {ex.steps.map((s, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="h-5 w-5 shrink-0 rounded-full bg-brand text-black text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="card">
        <div className="label mb-1">🌬 Breathing</div>
        <p className="text-sm">{ex.breathing}</p>
      </div>

      <List title="Common mistakes" icon="⚠️" items={ex.mistakes} />
      <List title="Safety tips" icon="🛡" items={ex.safety} />

      {alt && (
        <button onClick={() => nav(`/exercise/${alt.id}`)} className="w-full card flex items-center justify-between active:scale-[0.99]">
          <div className="text-left">
            <div className="label">🔁 Easier alternative</div>
            <div className="font-semibold mt-0.5">{alt.name}</div>
            <div className="text-xs text-muted">{alt.equipment} · same muscles, less load</div>
          </div>
          <span className="text-brand text-xl">→</span>
        </button>
      )}

      {prev && (
        <div className="card">
          <div className="label mb-1">📅 Previous workout history</div>
          <div className="text-sm">{fmtDate(prev.session.dateISO)} — {prev.log.sets.filter(s => s.done).map(s => `${s.weight}kg×${s.reps}`).join('  ·  ')}</div>
        </div>
      )}

      <button onClick={() => nav('/coach')} className="btn btn-ghost btn-lg w-full">💬 Ask the coach about this exercise</button>
    </div>
  )
}
