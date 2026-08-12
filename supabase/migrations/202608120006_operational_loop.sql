begin;

alter table public.trailers alter column container_size type text using container_size::text;
alter table public.capacity_declarations alter column container_size type text using container_size::text;
alter table public.trailers add constraint trailers_container_size_required check (char_length(trim(container_size)) between 2 and 40);
alter table public.capacity_declarations add constraint capacity_container_size_required check (char_length(trim(container_size)) between 2 and 40);

create or replace function public.create_provider_capacity(
  target_provider_id uuid, truck_registration text, trailer_registration text,
  driver_name text, driver_phone text, driver_license text, license_expires_on date,
  container_size text, capacity_quantity integer, available_from timestamptz,
  available_until timestamptz, pickup_area text default '', destination_area text default '', notes text default ''
) returns uuid language plpgsql security invoker set search_path = '' as $$
declare new_truck uuid; new_trailer uuid; new_driver uuid; new_capacity uuid; provider_status public.verification_status;
begin
  if not (public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) then raise exception 'Not authorized'; end if;
  select v.status into provider_status from public.provider_verifications v join public.organizations o on o.id=v.provider_id where v.provider_id=target_provider_id and o.status='active';
  if provider_status <> 'verified' then raise exception 'Provider must be verified'; end if;
  if char_length(trim(truck_registration))<2 or char_length(trim(trailer_registration))<2 or char_length(trim(driver_name))<2 or char_length(trim(driver_phone))<5 or char_length(trim(driver_license))<2 or char_length(trim(container_size))<2 then raise exception 'Required capacity details are incomplete'; end if;
  if capacity_quantity<1 or capacity_quantity>100 or available_until<=available_from then raise exception 'Availability is invalid'; end if;
  if license_expires_on is not null and license_expires_on < current_date then raise exception 'Driver license is expired'; end if;
  insert into public.trucks(provider_id,registration_number) values(target_provider_id,upper(trim(truck_registration))) returning id into new_truck;
  insert into public.trailers(provider_id,registration_number,container_size) values(target_provider_id,upper(trim(trailer_registration)),trim(container_size)) returning id into new_trailer;
  insert into public.drivers(provider_id,full_name,phone,license_number,license_expires_on) values(target_provider_id,trim(driver_name),trim(driver_phone),upper(trim(driver_license)),license_expires_on) returning id into new_driver;
  insert into public.capacity_declarations(provider_id,trailer_id,container_size,quantity,available_from,available_until,pickup_area,destination_area,notes,declared_by)
  values(target_provider_id,new_trailer,trim(container_size),capacity_quantity,available_from,available_until,nullif(trim(pickup_area),''),nullif(trim(destination_area),''),nullif(trim(notes),''),auth.uid()) returning id into new_capacity;
  insert into public.audit_events(actor_id,organization_id,action,entity_type,entity_id,after_data) values(auth.uid(),target_provider_id,'capacity.created','capacity_declaration',new_capacity,jsonb_build_object('truck_id',new_truck,'trailer_id',new_trailer,'driver_id',new_driver,'quantity',capacity_quantity,'container_size',trim(container_size)));
  return new_capacity;
end; $$;

create or replace function public.send_provider_offer(target_request_id uuid, target_capacity_id uuid, offered_quantity integer, expires_at timestamptz) returns uuid
language plpgsql security invoker set search_path='' as $$
declare req public.transport_requests%rowtype; cap public.capacity_declarations%rowtype; verification public.verification_status; new_offer uuid;
begin
  if not (public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) then raise exception 'Not authorized'; end if;
  select * into req from public.transport_requests where id=target_request_id for update;
  select * into cap from public.capacity_declarations where id=target_capacity_id and withdrawn_at is null;
  select status into verification from public.provider_verifications where provider_id=cap.provider_id;
  if req.id is null or cap.id is null or verification<>'verified' then raise exception 'Request or eligible capacity not found'; end if;
  if lower(trim(req.container_size))<>lower(trim(cap.container_size)) then raise exception 'Container size does not match'; end if;
  if req.required_at<cap.available_from or req.required_at>cap.available_until then raise exception 'Capacity is not available at the requested time'; end if;
  if offered_quantity<1 or offered_quantity>least(req.quantity,cap.quantity) or expires_at<=now() then raise exception 'Offer details are invalid'; end if;
  if exists(select 1 from public.provider_offers where request_id=target_request_id and provider_id=cap.provider_id and status in ('sent','accepted')) then raise exception 'Active offer already exists'; end if;
  insert into public.provider_offers(request_id,provider_id,capacity_id,quantity,status,sent_at,expires_at,created_by) values(target_request_id,cap.provider_id,target_capacity_id,offered_quantity,'sent',now(),expires_at,auth.uid()) returning id into new_offer;
  update public.transport_requests set status='matching',updated_at=now() where id=target_request_id and status='submitted';
  insert into public.audit_events(actor_id,organization_id,action,entity_type,entity_id,after_data) values(auth.uid(),cap.provider_id,'offer.sent','provider_offer',new_offer,jsonb_build_object('request_id',target_request_id,'quantity',offered_quantity));
  return new_offer;
end; $$;

create or replace function public.record_offer_response(target_offer_id uuid, decision text, reason text default '') returns void
language plpgsql security invoker set search_path='' as $$
declare current_offer public.provider_offers%rowtype;
begin
  if not (public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) then raise exception 'Not authorized'; end if;
  if decision not in ('accepted','rejected') then raise exception 'Invalid response'; end if;
  select * into current_offer from public.provider_offers where id=target_offer_id for update;
  if current_offer.status<>'sent' or current_offer.expires_at<=now() then raise exception 'Offer cannot be answered'; end if;
  if decision='rejected' and char_length(trim(reason))<2 then raise exception 'Rejection reason is required'; end if;
  update public.provider_offers set status=decision::public.offer_status,responded_at=now(),rejection_reason=case when decision='rejected' then trim(reason) else null end where id=target_offer_id;
  update public.transport_requests set status=case when decision='accepted' then 'matched'::public.request_status else 'matching'::public.request_status end,updated_at=now() where id=current_offer.request_id;
  insert into public.audit_events(actor_id,organization_id,action,entity_type,entity_id,reason,before_data,after_data) values(auth.uid(),current_offer.provider_id,'offer.responded','provider_offer',target_offer_id,nullif(trim(reason),''),jsonb_build_object('status','sent'),jsonb_build_object('status',decision));
end; $$;

create or replace function public.allocate_offer_and_create_trip(target_offer_id uuid, target_truck_id uuid, target_trailer_id uuid, target_driver_id uuid, scheduled_start timestamptz, scheduled_end timestamptz) returns uuid
language plpgsql security invoker set search_path='' as $$
declare offer_record public.provider_offers%rowtype; allocation_id uuid; trip_id uuid; trip_reference text;
begin
  if not (public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) then raise exception 'Not authorized'; end if;
  select * into offer_record from public.provider_offers where id=target_offer_id for update;
  if offer_record.status<>'accepted' then raise exception 'Offer must be accepted'; end if;
  if scheduled_end<=scheduled_start then raise exception 'Trip schedule is invalid'; end if;
  if not exists(select 1 from public.trucks where id=target_truck_id and provider_id=offer_record.provider_id and status='active') or not exists(select 1 from public.trailers where id=target_trailer_id and provider_id=offer_record.provider_id and status='active') or not exists(select 1 from public.drivers where id=target_driver_id and provider_id=offer_record.provider_id and status='active' and (license_expires_on is null or license_expires_on>=scheduled_start::date)) then raise exception 'Resources are not eligible'; end if;
  insert into public.allocations(request_id,offer_id,provider_id,quantity,allocated_by) values(offer_record.request_id,target_offer_id,offer_record.provider_id,offer_record.quantity,auth.uid()) returning id into allocation_id;
  trip_reference := 'TRIP-'||to_char(now(),'YYMMDD')||'-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,6));
  insert into public.trips(reference,allocation_id,provider_id,truck_id,trailer_id,driver_id,scheduled_start,scheduled_end) values(trip_reference,allocation_id,offer_record.provider_id,target_truck_id,target_trailer_id,target_driver_id,scheduled_start,scheduled_end) returning id into trip_id;
  insert into public.trip_status_events(trip_id,to_status,notes,changed_by) values(trip_id,'assigned','Resources allocated by AFOS Operations',auth.uid());
  update public.transport_requests set status='allocated',updated_at=now() where id=offer_record.request_id;
  insert into public.audit_events(actor_id,organization_id,action,entity_type,entity_id,after_data) values(auth.uid(),offer_record.provider_id,'trip.created','trip',trip_id,jsonb_build_object('reference',trip_reference,'allocation_id',allocation_id));
  return trip_id;
end; $$;

grant execute on function public.create_provider_capacity(uuid,text,text,text,text,text,date,text,integer,timestamptz,timestamptz,text,text,text) to authenticated;
grant execute on function public.send_provider_offer(uuid,uuid,integer,timestamptz) to authenticated;
grant execute on function public.record_offer_response(uuid,text,text) to authenticated;
grant execute on function public.allocate_offer_and_create_trip(uuid,uuid,uuid,uuid,timestamptz,timestamptz) to authenticated;
commit;
