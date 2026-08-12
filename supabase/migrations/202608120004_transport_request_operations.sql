begin;

alter table public.transport_requests
  add column if not exists movement_type text not null default 'import' check (movement_type in ('import', 'export', 'empty_return', 'other')),
  add column if not exists cargo_category text,
  add column if not exists estimated_weight_kg numeric check (estimated_weight_kg is null or estimated_weight_kg > 0),
  add column if not exists container_number text,
  add column if not exists notes text;

create function public.create_transport_request_for_customer(
  customer_name text,
  container_size public.container_size,
  container_quantity integer,
  pickup_location text,
  destination_location text,
  required_at timestamptz,
  contact_name text,
  contact_phone text,
  movement_type text default 'import',
  cargo_category text default '',
  estimated_weight_kg numeric default null,
  container_number text default '',
  notes text default ''
) returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  demand_organization_id uuid;
  new_request_id uuid;
  new_reference text;
begin
  if not (
    public.has_platform_role('afos_operations')
    or public.has_platform_role('afos_administrator')
  ) then
    raise exception 'Not authorized';
  end if;

  if char_length(trim(customer_name)) < 2
    or char_length(trim(pickup_location)) < 2
    or char_length(trim(destination_location)) < 2
    or char_length(trim(contact_name)) < 2
    or char_length(trim(contact_phone)) < 5 then
    raise exception 'Required request information is incomplete';
  end if;

  if container_quantity < 1 or container_quantity > 100 then
    raise exception 'Container quantity is invalid';
  end if;

  if movement_type not in ('import', 'export', 'empty_return', 'other') then
    raise exception 'Movement type is invalid';
  end if;

  select id into demand_organization_id
  from public.organizations
  where organization_type in ('customer', 'freight_forwarder')
    and lower(name) = lower(trim(customer_name))
  order by created_at
  limit 1;

  if demand_organization_id is null then
    insert into public.organizations (
      name, organization_type, primary_contact_name, primary_contact_phone
    ) values (
      trim(customer_name), 'customer', trim(contact_name), trim(contact_phone)
    ) returning id into demand_organization_id;
  end if;

  new_reference := 'REQ-' || to_char(now(), 'YYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  insert into public.transport_requests (
    reference, organization_id, requested_by, container_size, quantity,
    pickup_location, destination_location, required_at,
    operational_contact_name, operational_contact_phone, status,
    movement_type, cargo_category, estimated_weight_kg, container_number, notes
  ) values (
    new_reference, demand_organization_id, auth.uid(), container_size, container_quantity,
    trim(pickup_location), trim(destination_location), required_at,
    trim(contact_name), trim(contact_phone), 'submitted',
    movement_type, nullif(trim(cargo_category), ''), estimated_weight_kg,
    nullif(upper(trim(container_number)), ''), nullif(trim(notes), '')
  ) returning id into new_request_id;

  insert into public.audit_events (
    actor_id, organization_id, action, entity_type, entity_id, after_data
  ) values (
    auth.uid(), demand_organization_id, 'transport_request.created',
    'transport_request', new_request_id,
    jsonb_build_object('reference', new_reference, 'status', 'submitted', 'quantity', container_quantity)
  );

  return new_request_id;
end;
$$;

grant execute on function public.create_transport_request_for_customer(
  text, public.container_size, integer, text, text, timestamptz, text, text,
  text, text, numeric, text, text
) to authenticated;

commit;
