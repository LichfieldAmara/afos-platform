begin;

alter table public.transport_requests alter column requested_by drop not null;
alter table public.transport_requests add column if not exists tracking_token_hash text unique;
alter table public.transport_requests add column if not exists estimated_price numeric check (estimated_price is null or estimated_price >= 0);
alter table public.transport_requests add column if not exists price_status text not null default 'confirmation_required' check (price_status in ('estimated','confirmation_required','confirmed'));
alter table public.transport_requests add column if not exists contact_email text;

create table public.route_tariffs (
  id uuid primary key default gen_random_uuid(), pickup_pattern text not null, destination_pattern text not null,
  container_size text not null, base_price numeric not null check(base_price>=0), currency text not null default 'SLE',
  additional_container_price numeric not null default 0 check(additional_container_price>=0), active boolean not null default true,
  created_at timestamptz not null default now(), unique(pickup_pattern,destination_pattern,container_size)
);
alter table public.route_tariffs enable row level security;
create policy tariffs_public_read on public.route_tariffs for select using(active=true);
create policy tariffs_admin_all on public.route_tariffs for all using(public.has_platform_role('afos_administrator')) with check(public.has_platform_role('afos_administrator'));

create table public.provider_availability (
 id uuid primary key default gen_random_uuid(), provider_id uuid not null references public.organizations(id) on delete restrict,
 container_size text not null, quantity integer not null check(quantity>0), available_from date not null, available_until date not null,
 operating_area text, notes text, status text not null default 'available' check(status in('available','reserved','unavailable')),
 recorded_by uuid not null references auth.users(id), created_at timestamptz not null default now(), check(available_until>=available_from)
);
alter table public.provider_availability enable row level security;
create policy provider_availability_operations on public.provider_availability for all using(public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) with check(public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator'));

create table public.company_assignments (
 id uuid primary key default gen_random_uuid(), request_id uuid not null unique references public.transport_requests(id) on delete restrict,
 provider_id uuid not null references public.organizations(id) on delete restrict, availability_id uuid references public.provider_availability(id),
 assigned_by uuid not null references auth.users(id), status text not null default 'assigned' check(status in('assigned','confirmed','cancelled')),
 assigned_at timestamptz not null default now()
);
alter table public.company_assignments enable row level security;
create policy assignments_operations on public.company_assignments for all using(public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) with check(public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator'));

create or replace function public.submit_guest_transport_request(
 customer_name text, container_size text, container_quantity integer, pickup_location text, destination_location text,
 required_at timestamptz, contact_name text, contact_phone text, contact_email text default '', cargo_category text default '',
 estimated_weight_kg numeric default null, container_number text default '', notes text default '', tracking_token text default ''
) returns jsonb language plpgsql security definer set search_path='' as $guest_request$
declare org_id uuid; req_id uuid; ref text; tariff public.route_tariffs%rowtype; estimate numeric;
begin
 if char_length(trim(customer_name))<2 or char_length(trim(container_size))<2 or container_quantity<1 or container_quantity>100 or char_length(trim(pickup_location))<2 or char_length(trim(destination_location))<2 or char_length(trim(contact_name))<2 or char_length(trim(contact_phone))<5 or char_length(tracking_token)<32 then raise exception 'Required information is incomplete'; end if;
 insert into public.organizations(name,organization_type,primary_contact_name,primary_contact_phone) values(trim(customer_name),'customer',trim(contact_name),trim(contact_phone)) returning id into org_id;
 select * into tariff from public.route_tariffs where active=true and lower(trim(container_size))=lower(trim(submit_guest_transport_request.container_size)) and lower(trim(pickup_location)) like '%'||lower(pickup_pattern)||'%' and lower(trim(destination_location)) like '%'||lower(destination_pattern)||'%' order by char_length(pickup_pattern)+char_length(destination_pattern) desc limit 1;
 if tariff.id is not null then estimate:=tariff.base_price+greatest(container_quantity-1,0)*tariff.additional_container_price; end if;
 ref:='REQ-'||to_char(now(),'YYMMDD')||'-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,6));
 insert into public.transport_requests (
   reference, organization_id, requested_by, container_size, quantity,
   pickup_location, destination_location, required_at,
   operational_contact_name, operational_contact_phone, status, movement_type,
   cargo_category, estimated_weight_kg, container_number, notes,
   tracking_token_hash, estimated_price, price_status, contact_email
 )
 select
   ref, org_id, null, trim(container_size), container_quantity,
   trim(pickup_location), trim(destination_location), required_at,
   trim(contact_name), trim(contact_phone), 'submitted', 'other',
   nullif(trim(cargo_category), ''), estimated_weight_kg,
   nullif(upper(trim(container_number)), ''), nullif(trim(notes), ''),
   encode(extensions.digest(tracking_token, 'sha256'), 'hex'), estimate,
   case when estimate is null then 'confirmation_required' else 'estimated' end,
   nullif(trim(contact_email), '')
 returning id into req_id;
 insert into public.audit_events(organization_id,action,entity_type,entity_id,after_data) values(org_id,'transport_request.guest_created','transport_request',req_id,jsonb_build_object('reference',ref,'price_status',case when estimate is null then 'confirmation_required' else 'estimated' end));
 return jsonb_build_object('reference',ref,'estimated_price',estimate,'currency',coalesce(tariff.currency,'SLE'),'price_status',case when estimate is null then 'confirmation_required' else 'estimated' end);
end;
$guest_request$;

create or replace function public.track_guest_request(
  request_reference text,
  tracking_token text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $track_request$
declare
  tracking_result jsonb;
begin
  select jsonb_build_object(
    'reference', r.reference,
    'status', r.status,
    'container_size', r.container_size,
    'quantity', r.quantity,
    'pickup', r.pickup_location,
    'destination', r.destination_location,
    'required_at', r.required_at,
    'estimated_price', r.estimated_price,
    'price_status', r.price_status,
    'provider', o.name,
    'trip_status', t.status
  )
  into tracking_result
  from public.transport_requests as r
  left join public.company_assignments as a on a.request_id = r.id
  left join public.organizations as o on o.id = a.provider_id
  left join public.allocations as al on al.request_id = r.id
  left join public.trips as t on t.allocation_id = al.id
  where upper(r.reference) = upper(trim(request_reference))
    and r.tracking_token_hash = encode(
      extensions.digest(tracking_token, 'sha256'),
      'hex'
    )
  limit 1;

  return tracking_result;
end;
$track_request$;

create or replace function public.create_company_availability(
  target_provider_id uuid, size text, available_quantity integer,
  start_date date, end_date date, area text default '', notes text default ''
) returns uuid language plpgsql security invoker set search_path = '' as $company_availability$
declare
  verification public.verification_status;
  result uuid;
begin
  if not (public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) then raise exception 'Not authorized'; end if;
  select status into verification from public.provider_verifications where provider_id = target_provider_id;
  if verification <> 'verified' then raise exception 'Provider must be verified'; end if;
  insert into public.provider_availability(provider_id, container_size, quantity, available_from, available_until, operating_area, notes, recorded_by)
  values(target_provider_id, trim(size), available_quantity, start_date, end_date, nullif(trim(area), ''), nullif(trim(notes), ''), auth.uid())
  returning id into result;
  return result;
end;
$company_availability$;

create or replace function public.assign_company_to_request(
  target_request_id uuid, target_availability_id uuid
) returns uuid language plpgsql security invoker set search_path = '' as $company_assignment$
declare
  request_record public.transport_requests%rowtype;
  availability_record public.provider_availability%rowtype;
  result uuid;
begin
  if not (public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) then raise exception 'Not authorized'; end if;
  select * into request_record from public.transport_requests where id = target_request_id for update;
  select * into availability_record from public.provider_availability where id = target_availability_id for update;
  if availability_record.status <> 'available'
    or lower(trim(availability_record.container_size)) <> lower(trim(request_record.container_size))
    or request_record.required_at::date < availability_record.available_from
    or request_record.required_at::date > availability_record.available_until
    or availability_record.quantity < request_record.quantity then
    raise exception 'Company is not available for this request';
  end if;
  insert into public.company_assignments(request_id, provider_id, availability_id, assigned_by)
  values(request_record.id, availability_record.provider_id, availability_record.id, auth.uid()) returning id into result;
  update public.provider_availability set quantity = quantity - request_record.quantity,
    status = case when quantity - request_record.quantity = 0 then 'reserved' else status end where id = availability_record.id;
  update public.transport_requests set status = 'allocated', updated_at = now() where id = request_record.id;
  insert into public.audit_events(actor_id, organization_id, action, entity_type, entity_id, after_data)
  values(auth.uid(), availability_record.provider_id, 'company.assigned', 'company_assignment', result, jsonb_build_object('request_id', request_record.id));
  return result;
end;
$company_assignment$;

grant execute on function public.submit_guest_transport_request(text,text,integer,text,text,timestamptz,text,text,text,text,numeric,text,text,text) to anon,authenticated;
grant execute on function public.track_guest_request(text,text) to anon,authenticated;
grant execute on function public.create_company_availability(uuid,text,integer,date,date,text,text) to authenticated;
grant execute on function public.assign_company_to_request(uuid,uuid) to authenticated;
commit;
