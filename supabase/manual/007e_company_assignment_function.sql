create or replace function public.assign_company_to_request(target_request_id uuid,target_availability_id uuid) returns uuid language plpgsql security invoker set search_path='' as $fn$
declare req public.transport_requests%rowtype;avail public.provider_availability%rowtype;result uuid;
begin
if not(public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) then raise exception 'Not authorized';end if;
select * into req from public.transport_requests where id=target_request_id for update;select * into avail from public.provider_availability where id=target_availability_id for update;
if avail.status<>'available' or lower(trim(avail.container_size))<>lower(trim(req.container_size)) or req.required_at::date<avail.available_from or req.required_at::date>avail.available_until or avail.quantity<req.quantity then raise exception 'Company is not available for this request';end if;
insert into public.company_assignments(request_id,provider_id,availability_id,assigned_by) values(req.id,avail.provider_id,avail.id,auth.uid()) returning id into result;
update public.provider_availability set quantity=quantity-req.quantity,status=case when quantity-req.quantity=0 then 'reserved' else status end where id=avail.id;update public.transport_requests set status='allocated',updated_at=now() where id=req.id;
return result;
end;$fn$;
grant execute on function public.assign_company_to_request(uuid,uuid) to authenticated;
