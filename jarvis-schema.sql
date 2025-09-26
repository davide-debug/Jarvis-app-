
-- =========================================
--  Jarvis v13 - Schema Supabase
-- =========================================

-- Tabella chiamate
create table if not exists calls (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now(),
  client_id uuid,
  duration int,
  words int,
  sentiment text,
  objections int,
  transcript text
);

-- Tabella segmenti (più righe per ogni call)
create table if not exists segments (
  id uuid primary key default gen_random_uuid(),
  call_id uuid references calls(id) on delete cascade,
  start_sec int,
  end_sec int,
  text text
);

-- Tabella clienti (opzionale)
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  notes text
);

-- Relazioni utili
alter table calls
  add constraint fk_calls_clients foreign key (client_id) references clients(id) on delete set null;

-- Indici per velocizzare query
create index if not exists idx_calls_created_at on calls(created_at desc);
create index if not exists idx_segments_call_id on segments(call_id);

-- =========================================
-- FINE
-- =========================================
