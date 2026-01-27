-- treatment_setup_and_seed.sql
-- Postgres (Supabase) — idempotent: can be run multiple times safely

begin;

-- =========================
-- 0) Extensions (UUID)
-- =========================
create extension if not exists "pgcrypto";

-- =========================
-- 1) Tables
-- =========================

-- 1.1 treatment_types
create table if not exists treatment_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,       -- signature, microneedling, aquafacial, ultimate
  label text not null,
  is_active boolean not null default true
);

-- 1.2 treatment_variants
create table if not exists treatment_variants (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,       -- exo, dna, pdx
  label text not null,
  is_active boolean not null default true
);

-- 1.3 treatment_offerings (Treatment + Variant + Price + Duration)
create table if not exists treatment_offerings (
  id uuid primary key default gen_random_uuid(),
  treatment_type_id uuid not null references treatment_types(id) on delete restrict,
  treatment_variant_id uuid not null references treatment_variants(id) on delete restrict,
  price_cents integer not null,
  duration_min integer not null,
  is_active boolean not null default true,
  unique (treatment_type_id, treatment_variant_id)
);

create index if not exists idx_treatment_offerings_type
  on treatment_offerings(treatment_type_id);

create index if not exists idx_treatment_offerings_variant
  on treatment_offerings(treatment_variant_id);

-- 1.4 treatment_requests (Requests reference offerings + snapshot fields)
create table if not exists treatment_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  status text not null default 'new',

  name text not null,
  email text not null,
  phone text not null,
  message text,

  requested_at timestamptz,

  treatment_offering_id uuid not null
    references treatment_offerings(id)
    on delete restrict,

  -- snapshots (historically correct)
  price_snapshot_cents integer not null,
  duration_snapshot_min integer not null,

  -- optional (for auth later)
  user_id text
);

create index if not exists idx_treatment_requests_created_at
  on treatment_requests(created_at);

create index if not exists idx_treatment_requests_status
  on treatment_requests(status);

create index if not exists idx_treatment_requests_requested_at
  on treatment_requests(requested_at);

create index if not exists idx_treatment_requests_offering_id
  on treatment_requests(treatment_offering_id);

-- =========================
-- 2) Seed: treatment_types
-- =========================
insert into treatment_types (code, label, is_active)
values
  ('signature',     'Signature Combination',      true),
  ('microneedling', 'Microneedling Treatment',    true),
  ('aquafacial',    'Aquafacial Treatment',       true),
  ('ultimate',      'The Ultimate Ritual',        true)
on conflict (code)
do update set
  label = excluded.label,
  is_active = excluded.is_active;

-- =========================
-- 3) Seed: treatment_variants
-- =========================
insert into treatment_variants (code, label, is_active)
values
  ('exo', 'Cica Aqua EXO',          true),
  ('dna', 'Salmon DNA',             true),
  ('pdx', 'PDX Exosomen Premium',   true),
  ('dp', 'Derma Planning',            true),
on conflict (code)
do update set
  label = excluded.label,
  is_active = excluded.is_active;

-- =========================
-- 4) Seed: treatment_offerings (your price list)
-- =========================
with
t as (select id, code from treatment_types),
v as (select id, code from treatment_variants),
seed as (
  select * from (values
    -- Signature Combinations
    ('signature','exo', 17500, 80),
    ('signature','dna', 19000, 80),

    -- Microneedling Treatments
    ('microneedling','exo', 14000, 80),
    ('microneedling','dna', 15500, 80),
    ('microneedling','pdx', 17000, 80),

    -- Aquafacial Treatment (laut Preisliste: nur DP)
    ('aquafacial','dp', 17500, 90),

    -- The Ultimate Ritual
    ('ultimate','exo', 19500, 90),
    ('ultimate','dna', 21000, 90),
    ('ultimate','pdx', 23500, 90)
  ) as x(treatment_code, variant_code, price_cents, duration_min)
)
insert into treatment_offerings (
  treatment_type_id,
  treatment_variant_id,
  price_cents,
  duration_min,
  is_active
)
select
  t.id,
  v.id,
  seed.price_cents,
  seed.duration_min,
  true
from seed
join t on t.code = seed.treatment_code
join v on v.code = seed.variant_code
on conflict (treatment_type_id, treatment_variant_id)
do update set
  price_cents = excluded.price_cents,
  duration_min = excluded.duration_min,
  is_active = excluded.is_active;

commit;
