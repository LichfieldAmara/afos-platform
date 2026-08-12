begin;

drop function if exists public.create_transport_request_for_customer(
  text, public.container_size, integer, text, text, timestamptz, text, text,
  text, text, numeric, text, text
);

alter table public.transport_requests
  alter column container_size type text using container_size::text;

alter table public.transport_requests
  add constraint transport_requests_container_size_required
  check (char_length(trim(container_size)) between 2 and 40);

create function public.create_transport_request_for_customer(
  customer_name text,
  container_size text,
  container_quantity integer,
  pickup_location text,
  destination_location text,
  required_at timestamptz,
  contact_name text,
  contact_phone text,
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
  ) then raise exception 'Not authorized'; end if;

  if char_length(trim(customer_name)) < 2
    or char_length(trim(container_size)) < 2
    or char_length(trim(pickup_location)) < 2
    or char_length(trim(destination_location)) < 2
    or char_length(trim(contact_name)) < 2
    or char_length(trim(contact_phone)) < 5 then
    raise exception 'Required request information is incomplete';
  end if;

  if container_quantity < 1 or container_quantity > 100 then
    raise exception 'Container quantity is invalid';
  end if;

  select id into demand_organization_id from public.organizations
  where organization_type in ('customer', 'freight_forwarder')
    and lower(name) = lower(trim(customer_name))
  order by created_at limit 1;

  if demand_organization_id is null then
    insert into public.organizations (name, organization_type, primary_contact_name, primary_contact_phone)
    values (trim(customer_name), 'customer', trim(contact_name), trim(contact_phone))
    returning id into demand_organization_id;
  end if;

  new_reference := 'REQ-' || to_char(now(), 'YYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  insert into public.transport_requests (
    reference, organization_id, requested_by, container_size, quantity,
    pickup_location, destination_location, required_at,
    operational_contact_name, operational_contact_phone, status,
    movement_type, cargo_category, estimated_weight_kg, container_number, notes
  ) values (
    new_reference, demand_organization_id, auth.uid(), trim(container_size), container_quantity,
    trim(pickup_location), trim(destination_location), required_at,
    trim(contact_name), trim(contact_phone), 'submitted', 'other',
    nullif(trim(cargo_category), ''), estimated_weight_kg,
    nullif(upper(trim(container_number)), ''), nullif(trim(notes), '')
  ) returning id into new_request_id;

  insert into public.audit_events (actor_id, organization_id, action, entity_type, entity_id, after_data)
  values (auth.uid(), demand_organization_id, 'transport_request.created', 'transport_request', new_request_id,
    jsonb_build_object('reference', new_reference, 'status', 'submitted', 'quantity', container_quantity, 'container_size', trim(container_size)));

  return new_request_id;
end;
$$;

grant execute on function public.create_transport_request_for_customer(
  text, text, integer, text, text, timestamptz, text, text,
  text, numeric, text, text
) to authenticated;

commit;
