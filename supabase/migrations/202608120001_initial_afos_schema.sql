begin;

create extension if not exists pgcrypto;

create type public.organization_type as enum ('customer', 'freight_forwarder', 'transport_provider', 'afos');
create type public.membership_role as enum ('customer_user', 'freight_forwarder_user', 'provider_manager', 'provider_dispatcher', 'driver', 'afos_operations', 'afos_administrator');
create type public.record_status as enum ('active', 'inactive', 'suspended');
create type public.verification_status as enum ('draft', 'submitted', 'under_review', 'verified', 'rejected', 'suspended');
create type public.container_size as enum ('20ft', '40ft');
create type public.request_status as enum ('draft', 'submitted', 'matching', 'partially_matched', 'matched', 'allocated', 'in_progress', 'completed', 'partially_completed', 'unfulfilled', 'failed', 'cancelled');
create type public.offer_status as enum ('draft', 'sent', 'accepted', 'rejected', 'expired', 'withdrawn');
create type public.trip_status as enum ('assigned', 'acknowledged', 'ready', 'dispatched', 'at_pickup', 'in_transit', 'at_destination', 'delivered', 'completed', 'failed', 'cancelled');
create type public.exception_status as enum ('open', 'investigating', 'resolved', 'closed');
create type public.transaction_outcome as enum ('completed', 'partially_completed', 'failed', 'cancelled');

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) >= 2),
  organization_type public.organization_type not null,
  registration_number text,
  primary_contact_name text,
  primary_contact_phone text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete restrict,
  full_name text not null check (char_length(trim(full_name)) >= 2),
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  role public.membership_role not null,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  unique (organization_id, user_id, role)
);

create table public.provider_verifications (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.organizations(id) on delete restrict,
  status public.verification_status not null default 'draft',
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references auth.users(id) on delete set null,
  decision_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider_id)
);

create table public.verification_documents (
  id uuid primary key default gen_random_uuid(),
  verification_id uuid not null references public.provider_verifications(id) on delete cascade,
  document_type text not null,
  storage_path text not null,
  expires_on date,
  status public.verification_status not null default 'submitted',
  created_at timestamptz not null default now()
);

create table public.trucks (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.organizations(id) on delete restrict,
  registration_number text not null,
  make text,
  model text,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider_id, registration_number)
);

create table public.trailers (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.organizations(id) on delete restrict,
  registration_number text not null,
  container_size public.container_size not null,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider_id, registration_number)
);

create table public.drivers (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.organizations(id) on delete restrict,
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  phone text not null,
  license_number text not null,
  license_expires_on date,
  status public.record_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider_id, license_number),
  unique (user_id)
);

create table public.capacity_declarations (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references public.organizations(id) on delete restrict,
  trailer_id uuid references public.trailers(id) on delete restrict,
  container_size public.container_size not null,
  quantity integer not null check (quantity > 0),
  available_from timestamptz not null,
  available_until timestamptz not null,
  pickup_area text,
  destination_area text,
  notes text,
  declared_by uuid not null references auth.users(id) on delete restrict,
  withdrawn_at timestamptz,
  created_at timestamptz not null default now(),
  check (available_until > available_from)
);

create table public.transport_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  requested_by uuid not null references auth.users(id) on delete restrict,
  container_size public.container_size not null,
  quantity integer not null check (quantity > 0),
  pickup_location text not null,
  destination_location text not null,
  required_at timestamptz not null,
  operational_contact_name text not null,
  operational_contact_phone text not null,
  status public.request_status not null default 'draft',
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.provider_offers (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.transport_requests(id) on delete restrict,
  provider_id uuid not null references public.organizations(id) on delete restrict,
  capacity_id uuid references public.capacity_declarations(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  status public.offer_status not null default 'draft',
  sent_at timestamptz,
  responded_at timestamptz,
  expires_at timestamptz,
  rejection_reason text,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table public.allocations (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.transport_requests(id) on delete restrict,
  offer_id uuid not null references public.provider_offers(id) on delete restrict,
  provider_id uuid not null references public.organizations(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  allocated_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (offer_id)
);

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  allocation_id uuid not null references public.allocations(id) on delete restrict,
  provider_id uuid not null references public.organizations(id) on delete restrict,
  truck_id uuid not null references public.trucks(id) on delete restrict,
  trailer_id uuid not null references public.trailers(id) on delete restrict,
  driver_id uuid not null references public.drivers(id) on delete restrict,
  status public.trip_status not null default 'assigned',
  scheduled_start timestamptz not null,
  delivered_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.trip_status_events (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  from_status public.trip_status,
  to_status public.trip_status not null,
  notes text,
  changed_by uuid not null references auth.users(id) on delete restrict,
  occurred_at timestamptz not null default now()
);

create table public.exceptions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.transport_requests(id) on delete restrict,
  trip_id uuid references public.trips(id) on delete restrict,
  exception_type text not null,
  status public.exception_status not null default 'open',
  description text not null,
  operational_impact text,
  resolution text,
  replacement_capacity_required boolean not null default false,
  reported_by uuid not null references auth.users(id) on delete restrict,
  resolved_by uuid references auth.users(id) on delete restrict,
  reported_at timestamptz not null default now(),
  resolved_at timestamptz,
  check (request_id is not null or trip_id is not null)
);

create table public.deliveries (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete restrict unique,
  outcome public.transaction_outcome not null,
  delivered_at timestamptz,
  evidence_path text,
  submitted_by uuid not null references auth.users(id) on delete restrict,
  confirmed_by uuid references auth.users(id) on delete restrict,
  confirmed_at timestamptz,
  outcome_reason text,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  entity_type text,
  entity_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete restrict,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  reason text,
  before_data jsonb,
  after_data jsonb,
  occurred_at timestamptz not null default now()
);

create index memberships_user_idx on public.organization_memberships(user_id, status);
create index requests_org_status_idx on public.transport_requests(organization_id, status);
create index offers_provider_status_idx on public.provider_offers(provider_id, status);
create index trips_provider_status_idx on public.trips(provider_id, status);
create index trip_events_trip_time_idx on public.trip_status_events(trip_id, occurred_at);
create index audit_entity_idx on public.audit_events(entity_type, entity_id, occurred_at);

create function public.is_active_member(target_organization uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.organization_memberships m
    where m.organization_id = target_organization and m.user_id = auth.uid() and m.status = 'active'
  );
$$;

create function public.has_platform_role(required_role public.membership_role) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.organization_memberships m
    join public.organizations o on o.id = m.organization_id
    where m.user_id = auth.uid() and m.role = required_role and m.status = 'active' and o.organization_type = 'afos'
  );
$$;

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.provider_verifications enable row level security;
alter table public.verification_documents enable row level security;
alter table public.trucks enable row level security;
alter table public.trailers enable row level security;
alter table public.drivers enable row level security;
alter table public.capacity_declarations enable row level security;
alter table public.transport_requests enable row level security;
alter table public.provider_offers enable row level security;
alter table public.allocations enable row level security;
alter table public.trips enable row level security;
alter table public.trip_status_events enable row level security;
alter table public.exceptions enable row level security;
alter table public.deliveries enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_events enable row level security;

create policy profiles_self_select on public.profiles for select using (id = auth.uid() or public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator'));
create policy memberships_member_select on public.organization_memberships for select using (user_id = auth.uid() or public.is_active_member(organization_id) or public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator'));
create policy organizations_member_select on public.organizations for select using (public.is_active_member(id) or public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator'));

create policy requests_member_select on public.transport_requests for select using (public.is_active_member(organization_id) or public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator'));
create policy requests_member_insert on public.transport_requests for insert with check (requested_by = auth.uid() and public.is_active_member(organization_id));
create policy requests_member_update on public.transport_requests for update using (requested_by = auth.uid() and public.is_active_member(organization_id)) with check (requested_by = auth.uid() and public.is_active_member(organization_id));

create policy trucks_provider_all on public.trucks for all using (public.is_active_member(provider_id) or public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) with check (public.is_active_member(provider_id) or public.has_platform_role('afos_administrator'));
create policy trailers_provider_all on public.trailers for all using (public.is_active_member(provider_id) or public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) with check (public.is_active_member(provider_id) or public.has_platform_role('afos_administrator'));
create policy drivers_provider_all on public.drivers for all using (public.is_active_member(provider_id) or user_id = auth.uid() or public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) with check (public.is_active_member(provider_id) or public.has_platform_role('afos_administrator'));
create policy capacity_provider_all on public.capacity_declarations for all using (public.is_active_member(provider_id) or public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) with check (public.is_active_member(provider_id) or public.has_platform_role('afos_administrator'));

create policy verifications_provider_select on public.provider_verifications for select using (public.is_active_member(provider_id) or public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator'));
create policy verifications_operations_all on public.provider_verifications for all using (public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) with check (public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator'));

create policy offers_participant_select on public.provider_offers for select using (public.is_active_member(provider_id) or public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator'));
create policy offers_participant_update on public.provider_offers for update using (public.is_active_member(provider_id) or public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) with check (public.is_active_member(provider_id) or public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator'));
create policy offers_operations_insert on public.provider_offers for insert with check (public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator'));

create policy allocations_participant_select on public.allocations for select using (public.is_active_member(provider_id) or public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator'));
create policy allocations_operations_write on public.allocations for all using (public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) with check (public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator'));

create policy trips_participant_select on public.trips for select using (public.is_active_member(provider_id) or exists (select 1 from public.drivers d where d.id = driver_id and d.user_id = auth.uid()) or public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator'));
create policy trips_operations_write on public.trips for all using (public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) with check (public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator'));
create policy trip_events_participant_select on public.trip_status_events for select using (exists (select 1 from public.trips t left join public.drivers d on d.id = t.driver_id where t.id = trip_id and (public.is_active_member(t.provider_id) or d.user_id = auth.uid() or public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator'))));
create policy trip_events_assigned_insert on public.trip_status_events for insert with check (changed_by = auth.uid() and exists (select 1 from public.trips t left join public.drivers d on d.id = t.driver_id where t.id = trip_id and (d.user_id = auth.uid() or public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator'))));

create policy notifications_self on public.notifications for select using (user_id = auth.uid());
create policy notifications_self_update on public.notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy audit_operations_select on public.audit_events for select using (public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator'));

revoke update, delete on public.audit_events from authenticated;

commit;
