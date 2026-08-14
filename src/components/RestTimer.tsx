import React, { useEffect, useRef, useState } from 'react'

export function RestTimer({ seconds, onClose }: { seconds: number; onClose: () => void }) {
  const [left, setLeft] = useState(seconds)
  const [running, setRunning] = useState(true)
  const ref = useRef<number | null>(null)

  useEffect(() => {
    if (!running) return
    ref.current = window.setInterval(() => {
      setLeft(l => {
        if (l <= 1) {
          if (ref.current) clearInterval(ref.current)
          try { navigator.vibrate?.(400) } catch {}
          return 0
        }
        return l - 1
      })
    }, 1000)
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [running])

  const mm = String(Math.floor(left / 60)).padStart(1, '0')
  const ss = String(left % 60).padStart(2, '0')
  const pct = seconds > 0 ? (left / seconds) * 100 : 0

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-end sm:items-center justify-center safe-bottom">
      <div className="card w-full max-w-md m-3 text-center">
        <div className="label">Rest timer</div>
        <div className={`text-6xl font-bold my-3 tabular-nums ${left === 0 ? 'text-brand' : ''}`}>{mm}:{ss}</div>
        <div className="h-2 rounded-full bg-panel2 overflow-hidden mb-4">
          <div className="h-full bg-brand" style={{ width: pct + '%', transition: 'width 1s linear' }} />
        </div>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[-15, 15, 30, 60].map(d => (
            <button key={d} className="btn btn-ghost py-3" onClick={() => setLeft(l => Math.max(0, l + d))}>{d > 0 ? '+' : ''}{d}s</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn btn-ghost btn-lg" onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Resume'}</button>
          <button className="btn btn-primary btn-lg" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  )
}
