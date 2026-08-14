import React from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import Today from './pages/Today'
import WorkoutSession from './pages/WorkoutSession'
import ExerciseDetail from './pages/ExerciseDetail'
import Dashboard from './pages/Dashboard'
import Nutrition from './pages/Nutrition'
import Coach from './pages/Coach'
import Program from './pages/Program'

const TABS = [
  { to: '/', label: 'Today', icon: '🏠' },
  { to: '/dashboard', label: 'Progress', icon: '📈' },
  { to: '/nutrition', label: 'Nutrition', icon: '🍗' },
  { to: '/coach', label: 'Coach', icon: '💬' },
  { to: '/program', label: 'Plan', icon: '🗓' }
]

function BottomNav() {
  const loc = useLocation()
  // hide during an active workout session for a focused view
  if (/^\/workout\//.test(loc.pathname)) return null
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-panel/95 backdrop-blur border-t border-line safe-bottom">
      <div className="max-w-md mx-auto grid grid-cols-5">
        {TABS.map(t => (
          <NavLink key={t.to} to={t.to} end={t.to === '/'}
            className={({ isActive }) => `flex flex-col items-center py-2.5 text-[11px] font-semibold ${isActive ? 'text-brand' : 'text-muted'}`}>
            <span className="text-xl leading-none mb-1">{t.icon}</span>{t.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default function App() {
  const loc = useLocation()
  const inWorkout = /^\/workout\//.test(loc.pathname)
  return (
    <div className="min-h-full">
      <main className={`max-w-md mx-auto px-4 safe-top ${inWorkout ? 'pb-8' : 'pb-24'} pt-4`}>
        <Routes>
          <Route path="/" element={<Today />} />
          <Route path="/workout/:day" element={<WorkoutSession />} />
          <Route path="/exercise/:id" element={<ExerciseDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/coach" element={<Coach />} />
          <Route path="/program" element={<Program />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
