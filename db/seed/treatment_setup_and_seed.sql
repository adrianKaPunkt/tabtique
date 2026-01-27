-- treatment_setup_and_seed.sql
-- Clean setup (DROP + CREATE + SEED) for Supabase Postgres
-- Includes: types, variants, offerings, addons, offering_addons, requests
-- NOTE: This script DROPS tables. Run only on a fresh / reset DB.

begin;

-- =========================
-- 0) Extensions
-- =========================
create extension if not exists "pgcrypto";

-- =========================
-- 1) Drop (in dependency order)
-- =========================
drop table if exists treatment_requests cascade;
drop table if exists treatment_offering_addons cascade;
drop table if exists treatment_addons cascade;
drop table if exists treatment_offerings cascade;
drop table if exists treatment_variants cascade;
drop table if exists treatment_types cascade;

-- =========================
-- 2) Create tables
-- =========================

-- 2.1 treatment_types
create table treatment_types (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,      -- signature, microneedling, aquafacial, ultimate
  label text not null,
  is_active boolean not null default true
);

-- 2.2 treatment_variants
create table treatment_variants (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,      -- exo, dna, pdx
  label text not null,
  is_active boolean not null default true
);

-- 2.3 treatment_offerings (Treatment + Variant + Price + Duration)
create table treatment_offerings (
  id uuid primary key default gen_random_uuid(),
  treatment_type_id uuid not null references treatment_types(id) on delete restrict,
  treatment_variant_id uuid not null references treatment_variants(id) on delete restrict,
  price_cents integer not null,
  duration_min integer not null,
  is_active boolean not null default true,
  unique (treatment_type_id, treatment_variant_id)
);

create index idx_treatment_offerings_type on treatment_offerings(treatment_type_id);
create index idx_treatment_offerings_variant on treatment_offerings(treatment_variant_id);

-- 2.4 treatment_addons (e.g. Dermaplaning)
create table treatment_addons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,              -- dermaplaning
  label text not null,                    -- Dermaplaning
  is_active boolean not null default true
);

-- 2.5 treatment_offering_addons (rules per offering)
create table treatment_offering_addons (
  id uuid primary key default gen_random_uuid(),
  treatment_offering_id uuid not null references treatment_offerings(id) on delete restrict,
  treatment_addon_id uuid not null references treatment_addons(id) on delete restrict,

  -- business rule per offering:
  is_included boolean not null default false,  -- true for Aquafacial
  is_optional boolean not null default true,   -- false for included-only addons

  price_delta_cents integer not null default 0,   -- 0 for Aquafacial, 4000 for others
  duration_delta_min integer not null default 0,  -- optional

  unique (treatment_offering_id, treatment_addon_id)
);

-- Prevent contradictory states (exactly one of the two must be true)
alter table treatment_offering_addons
add constraint chk_treatment_offering_addons_flags
check (
  (is_included = true  and is_optional = false) or
  (is_included = false and is_optional = true)
);

create index idx_treatment_offering_addons_offering on treatment_offering_addons(treatment_offering_id);
create index idx_treatment_offering_addons_addon on treatment_offering_addons(treatment_addon_id);

-- 2.6 treatment_requests (references offering + snapshots)
create table treatment_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  status text not null default 'new',

  name text not null,
  email text not null,
  phone text not null,
  message text,

  requested_at timestamptz not null,

  treatment_offering_id uuid not null references treatment_offerings(id) on delete restrict,

  -- snapshots (historically correct)
  price_snapshot_cents integer not null,
  duration_snapshot_min integer not null,

  -- optional for auth later
  user_id text
);

create index idx_treatment_requests_created_at on treatment_requests(created_at);
create index idx_treatment_requests_status on treatment_requests(status);
create index idx_treatment_requests_requested_at on treatment_requests(requested_at);
create index idx_treatment_requests_offering_id on treatment_requests(treatment_offering_id);

-- 2.7 treatment_request_addons (addon snapshots per request)
create table treatment_request_addons (
  id uuid primary key default gen_random_uuid(),

  treatment_request_id uuid not null
    references treatment_requests(id)
    on delete cascade,

  -- snapshot fields (stable even if addons change later)
  addon_code_snapshot text not null,        -- e.g. "dermaplaning"
  addon_label_snapshot text not null,       -- e.g. "Dermaplaning"

  is_included_snapshot boolean not null,    -- true if included, false if user-selected optional

  price_delta_snapshot_cents integer not null default 0,
  duration_delta_snapshot_min integer not null default 0,

  unique (treatment_request_id, addon_code_snapshot)
);

create index idx_treatment_request_addons_request_id
  on treatment_request_addons(treatment_request_id);

-- =========================
-- 3) Seed core data
-- =========================

-- 3.1 treatment_types
insert into treatment_types (code, label, is_active)
values
  ('signature',     'Signature Combination',      true),
  ('microneedling', 'Microneedling Treatment',    true),
  ('aquafacial',    'Aquafacial Treatment',       true),
  ('ultimate',      'The Ultimate Ritual',        true);

-- 3.2 treatment_variants
insert into treatment_variants (code, label, is_active)
values
  ('bas', 'Basic',                  true), 
  ('exo', 'Cica Aqua EXO',          true),
  ('dna', 'Salmon DNA',             true),
  ('pdx', 'PDX Exosomen Premium',   true);

-- 3.3 treatment_offerings (base price already includes everything that is "included")
-- Assumption: Aquafacial base offering uses DNA (Dermaplaning will be marked as included via addons)
with
t as (select id, code from treatment_types),
v as (select id, code from treatment_variants)
insert into treatment_offerings (treatment_type_id, treatment_variant_id, price_cents, duration_min, is_active)
select
  t.id,
  v.id,
  x.price_cents,
  x.duration_min,
  true
from (values
  -- Signature
  ('signature','exo', 17500, 80),
  ('signature','dna', 19000, 80),

  -- Microneedling
  ('microneedling','exo', 14000, 80),
  ('microneedling','dna', 15500, 80),
  ('microneedling','pdx', 17000, 80),

  -- Aquafacial (Dermaplaning included)
  ('aquafacial','bas', 17500, 90),

  -- Ultimate
  ('ultimate','exo', 19500, 90),
  ('ultimate','dna', 21000, 90),
  ('ultimate','pdx', 23500, 90)
) as x(treatment_code, variant_code, price_cents, duration_min)
join t on t.code = x.treatment_code
join v on v.code = x.variant_code;

-- 3.4 treatment_addons
insert into treatment_addons (code, label, is_active)
values
  ('dermaplaning', 'Dermaplaning', true);

-- =========================
-- 4) Seed addon rules per offering
-- =========================

-- 4.1 Aquafacial: Dermaplaning included (0 delta, not optional)
with
addon as (
  select id as addon_id from treatment_addons where code = 'dermaplaning'
),
aq_offerings as (
  select o.id as offering_id
  from treatment_offerings o
  join treatment_types t on t.id = o.treatment_type_id
  where t.code = 'aquafacial'
)
insert into treatment_offering_addons (
  treatment_offering_id,
  treatment_addon_id,
  is_included,
  is_optional,
  price_delta_cents,
  duration_delta_min
)
select
  aq_offerings.offering_id,
  addon.addon_id,
  true,
  false,
  0,
  0
from aq_offerings, addon;

-- 4.2 All other treatments: Dermaplaning optional (+40€)
with
addon as (
  select id as addon_id from treatment_addons where code = 'dermaplaning'
),
other_offerings as (
  select o.id as offering_id
  from treatment_offerings o
  join treatment_types t on t.id = o.treatment_type_id
  where t.code <> 'aquafacial'
)
insert into treatment_offering_addons (
  treatment_offering_id,
  treatment_addon_id,
  is_included,
  is_optional,
  price_delta_cents,
  duration_delta_min
)
select
  other_offerings.offering_id,
  addon.addon_id,
  false,
  true,
  4000,
  0
from other_offerings, addon;

commit;
