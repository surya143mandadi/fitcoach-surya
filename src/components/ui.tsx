import React from 'react'
import { useNavigate } from 'react-router-dom'

export function ProgressRing({ pct, size = 64, stroke = 7, label }: { pct: number; size?: number; stroke?: number; label?: string }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const off = c - (Math.min(100, Math.max(0, pct)) / 100) * c
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#2a2a30" strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#22d3aa" strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" style={{ transition: 'stroke-dashoffset .4s' }} />
      </svg>
      <span className="absolute text-sm font-bold">{label ?? `${Math.round(pct)}%`}</span>
    </div>
  )
}

export function Stat({ label, value, unit, sub }: { label: string; value: React.ReactNode; unit?: string; sub?: string }) {
  return (
    <div className="card">
      <div className="label">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}<span className="text-sm text-muted font-medium">{unit ? ' ' + unit : ''}</span></div>
      {sub && <div className="text-xs text-muted mt-0.5">{sub}</div>}
    </div>
  )
}

export function Bar({ value, max, color = '#22d3aa' }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div className="h-2.5 w-full rounded-full bg-panel2 overflow-hidden">
      <div className="h-full rounded-full" style={{ width: pct + '%', background: color, transition: 'width .4s' }} />
    </div>
  )
}

export function Section({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold">{title}</h2>
        {right}
      </div>
      {children}
    </section>
  )
}

export function BackHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const nav = useNavigate()
  return (
    <div className="flex items-center gap-3 mb-4">
      <button onClick={() => nav(-1)} className="btn btn-ghost h-11 w-11 rounded-2xl text-xl">‹</button>
      <div>
        <h1 className="text-xl font-bold leading-tight">{title}</h1>
        {subtitle && <div className="text-sm text-muted">{subtitle}</div>}
      </div>
    </div>
  )
}

export function VideoArea({ url, name }: { url?: string; name: string }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-black border border-line aspect-video flex items-center justify-center">
      {url ? (
        <video src={url} controls playsInline className="w-full h-full object-contain" />
      ) : (
        <div className="text-center px-4">
          <div className="text-5xl mb-2">▶</div>
          <div className="text-sm font-semibold">Demonstration video</div>
          <div className="text-xs text-muted mt-1">{name}</div>
          <div className="text-[11px] text-muted mt-2">Drop a clip into this exercise to play it here.</div>
        </div>
      )}
    </div>
  )
}
