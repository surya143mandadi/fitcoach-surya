-- FitCoach Surya — Postgres schema (auth-ready).
-- The MVP runs entirely on local/demo data (localStorage). When you connect a
-- backend (e.g. Supabase/Postgres), these tables mirror the TypeScript types in
-- src/types.ts. Row-Level Security keys everything to auth.uid().

create extension if not exists "pgcrypto";

-- Users (managed by your auth provider; profile extends it).
create table if not exists profiles (
  id            uuid primary key default gen_random_uuid(),
  auth_user_id  uuid unique,                    -- FK to auth.users(id)
  name          text not null default 'Surya',
  sex           text default 'male',
  age           int,
  height_cm     numeric,
  start_weight_kg numeric,
  goal_weight_kg  numeric,
  goal_waist_cm   numeric,
  experience    text,
  step_goal     int default 8000,
  program_start date default '2026-09-06',
  created_at    timestamptz default now()
);

-- One row per logged workout.
create table if not exists workout_sessions (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references profiles(id) on delete cascade,
  day           text not null check (day in ('thu','fri','sat')),
  title         text not null,
  date          date not null,
  week          int  not null,
  completed_pct int  not null default 0,
  finished_at   timestamptz,
  created_at    timestamptz default now()
);

-- Per-exercise sets within a session (weight/reps logging + history).
create table if not exists set_logs (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null references workout_sessions(id) on delete cascade,
  exercise_id   text not null,                  -- matches EXERCISES keys
  set_index     int  not null,
  weight_kg     numeric not null default 0,
  reps          int not null default 0,
  done          boolean not null default false
);
create index if not exists idx_setlogs_exercise on set_logs(exercise_id);

-- Body / transformation metrics.
create table if not exists body_entries (
  id               uuid primary key default gen_random_uuid(),
  profile_id       uuid not null references profiles(id) on delete cascade,
  date             date not null,
  weight_kg        numeric,
  waist_cm         numeric,
  body_fat_pct     numeric,
  skeletal_muscle_kg numeric,
  lean_mass_kg     numeric,
  photo_url        text,
  note             text,
  unique (profile_id, date)
);

-- Daily nutrition + steps + water.
create table if not exists nutrition_entries (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references profiles(id) on delete cascade,
  date          date not null,
  kcal          numeric not null default 0,
  protein_g     numeric not null default 0,
  water_ml      numeric not null default 0,
  steps         int,
  unique (profile_id, date)
);

-- Weekly check-ins.
create table if not exists checkins (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references profiles(id) on delete cascade,
  week_start    date not null,
  weight_avg_kg numeric,
  waist_cm      numeric,
  avg_steps     int,
  adherence     int,
  energy        int,
  note          text,
  unique (profile_id, week_start)
);

-- AI coach chat history.
create table if not exists chat_messages (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references profiles(id) on delete cascade,
  role          text not null check (role in ('user','coach')),
  text          text not null,
  created_at    timestamptz default now()
);

-- Row-Level Security (enable once auth is wired up).
-- alter table profiles enable row level security;
-- create policy own_profile on profiles using (auth_user_id = auth.uid());
-- (repeat per table keyed on profile_id -> profiles.auth_user_id = auth.uid())
