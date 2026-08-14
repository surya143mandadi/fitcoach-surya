import React, { useEffect, useRef, useState } from 'react'
import { useApp } from '../store/store'
import { coachReply, SAMPLE_QUESTIONS } from '../lib/coach'
import type { ChatMessage } from '../types'

function render(text: string) {
  // minimal markdown: **bold** and newlines
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : <React.Fragment key={i}>{p}</React.Fragment>)
}

export default function Coach() {
  const { chat, addChat, clearChat, sessions } = useApp()
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chat, busy])

  async function send(text: string) {
    const t = text.trim(); if (!t || busy) return
    setInput('')
    const userMsg: ChatMessage = { role: 'user', text: t, ts: Date.now() }
    addChat(userMsg)
    setBusy(true)
    const reply = await coachReply(t, { sessions })
    addChat({ role: 'coach', text: reply, ts: Date.now() })
    setBusy(false)
  }

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 120px)' }}>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-extrabold">AI Coach</h1>
        {chat.length > 0 && <button className="text-muted text-sm" onClick={clearChat}>Clear</button>}
      </div>
      <div className="rounded-2xl bg-accent/10 border border-accent/30 text-xs text-accent px-3 py-2 mb-3">
        ⚠️ I don't diagnose injuries. If something causes significant pain, stop and see a healthcare professional.
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pb-2">
        {chat.length === 0 && (
          <div className="card">
            <div className="font-semibold mb-2">👋 Ask me anything about your training</div>
            <div className="space-y-2">
              {SAMPLE_QUESTIONS.map(q => (
                <button key={q} onClick={() => send(q)} className="w-full text-left text-sm bg-panel2 border border-line rounded-2xl px-3 py-2.5 active:scale-[0.99]">{q}</button>
              ))}
            </div>
          </div>
        )}
        {chat.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-brand text-black' : 'bg-panel border border-line'}`}>
              {render(m.text)}
            </div>
          </div>
        ))}
        {busy && <div className="flex justify-start"><div className="bg-panel border border-line rounded-2xl px-4 py-3 text-sm text-muted">Coach is typing…</div></div>}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 pt-2 bg-ink safe-bottom">
        <div className="flex gap-2">
          <input className="field" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(input) }}
            placeholder="Ask your coach…" />
          <button className="btn btn-primary px-5" onClick={() => send(input)} disabled={busy}>Send</button>
        </div>
      </div>
    </div>
  )
}
