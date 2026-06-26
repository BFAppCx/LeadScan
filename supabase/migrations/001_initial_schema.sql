create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  focus text,
  crm_type text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  venue text,
  starts_on date,
  ends_on date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_clients (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, client_id)
);

create table if not exists public.qualification_templates (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  name text not null,
  fields jsonb not null default '[]'::jsonb,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.profiles (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  event_id uuid references public.events (id) on delete set null,
  source_type text not null default 'manual',
  status text not null default 'draft',
  warmth text not null default 'warm',
  next_step text,
  raw_notes text,
  consent_status text not null default 'unknown',
  follow_up_due_at timestamptz,
  ai_summary text,
  research_status text not null default 'pending',
  crm_export_status text not null default 'not_exported',
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null unique references public.leads (id) on delete cascade,
  full_name text not null,
  first_name text,
  last_name text,
  job_title text,
  email text,
  phone text,
  linkedin_url text,
  company_name text,
  website text,
  city text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_card_assets (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  image_path text not null,
  ocr_provider text,
  ocr_raw_text text,
  ocr_json jsonb,
  confidence_score numeric(5,2),
  created_at timestamptz not null default now()
);

create table if not exists public.qualification_responses (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  template_id uuid references public.qualification_templates (id) on delete set null,
  answers jsonb not null default '{}'::jsonb,
  quick_score integer,
  priority text,
  next_step text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.research_snapshots (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  provider text not null,
  input_payload jsonb,
  output_payload jsonb,
  summary text,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_clients_updated_at on public.clients;
drop trigger if exists set_events_updated_at on public.events;
drop trigger if exists set_templates_updated_at on public.qualification_templates;
drop trigger if exists set_leads_updated_at on public.leads;
drop trigger if exists set_contacts_updated_at on public.contacts;
drop trigger if exists set_responses_updated_at on public.qualification_responses;

create trigger set_clients_updated_at before update on public.clients for each row execute procedure public.set_updated_at();
create trigger set_events_updated_at before update on public.events for each row execute procedure public.set_updated_at();
create trigger set_templates_updated_at before update on public.qualification_templates for each row execute procedure public.set_updated_at();
create trigger set_leads_updated_at before update on public.leads for each row execute procedure public.set_updated_at();
create trigger set_contacts_updated_at before update on public.contacts for each row execute procedure public.set_updated_at();
create trigger set_responses_updated_at before update on public.qualification_responses for each row execute procedure public.set_updated_at();

alter table public.clients enable row level security;
alter table public.events enable row level security;
alter table public.event_clients enable row level security;
alter table public.qualification_templates enable row level security;
alter table public.leads enable row level security;
alter table public.contacts enable row level security;
alter table public.business_card_assets enable row level security;
alter table public.qualification_responses enable row level security;
alter table public.research_snapshots enable row level security;
alter table public.profiles enable row level security;

create policy "users_manage_own_profile"
on public.profiles
for all
using (id = auth.uid())
with check (id = auth.uid());

create policy "users_manage_own_clients" on public.clients
for all using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());

create policy "users_manage_own_events" on public.events
for all using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());

create policy "users_manage_event_clients" on public.event_clients
for all
using (exists (select 1 from public.events where events.id = event_clients.event_id and events.owner_user_id = auth.uid()))
with check (exists (select 1 from public.events where events.id = event_clients.event_id and events.owner_user_id = auth.uid()));

create policy "users_manage_templates_for_own_clients" on public.qualification_templates
for all
using (exists (select 1 from public.clients where clients.id = qualification_templates.client_id and clients.owner_user_id = auth.uid()))
with check (exists (select 1 from public.clients where clients.id = qualification_templates.client_id and clients.owner_user_id = auth.uid()));

create policy "users_manage_own_leads" on public.leads
for all using (owner_user_id = auth.uid()) with check (owner_user_id = auth.uid());

create policy "users_manage_contacts_for_own_leads" on public.contacts
for all
using (exists (select 1 from public.leads where leads.id = contacts.lead_id and leads.owner_user_id = auth.uid()))
with check (exists (select 1 from public.leads where leads.id = contacts.lead_id and leads.owner_user_id = auth.uid()));

create policy "users_manage_business_cards_for_own_leads" on public.business_card_assets
for all
using (exists (select 1 from public.leads where leads.id = business_card_assets.lead_id and leads.owner_user_id = auth.uid()))
with check (exists (select 1 from public.leads where leads.id = business_card_assets.lead_id and leads.owner_user_id = auth.uid()));

create policy "users_manage_responses_for_own_leads" on public.qualification_responses
for all
using (exists (select 1 from public.leads where leads.id = qualification_responses.lead_id and leads.owner_user_id = auth.uid()))
with check (exists (select 1 from public.leads where leads.id = qualification_responses.lead_id and leads.owner_user_id = auth.uid()));

create policy "users_manage_research_for_own_leads" on public.research_snapshots
for all
using (exists (select 1 from public.leads where leads.id = research_snapshots.lead_id and leads.owner_user_id = auth.uid()))
with check (exists (select 1 from public.leads where leads.id = research_snapshots.lead_id and leads.owner_user_id = auth.uid()));
