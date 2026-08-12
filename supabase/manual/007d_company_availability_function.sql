create or replace function public.create_company_availability(target_provider_id uuid,size text,available_quantity integer,start_date date,end_date date,area text default '',notes text default '') returns uuid language plpgsql security invoker set search_path='' as $fn$
declare verification public.verification_status;result uuid;
begin
if not(public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) then raise exception 'Not authorized';end if;
select status into verification from public.provider_verifications where provider_id=target_provider_id;
if verification<>'verified' then raise exception 'Provider must be verified';end if;
insert into public.provider_availability(provider_id,container_size,quantity,available_from,available_until,operating_area,notes,recorded_by) values(target_provider_id,trim(size),available_quantity,start_date,end_date,nullif(trim(area),''),nullif(trim(notes),''),auth.uid()) returning id into result;
return result;
end;$fn$;
grant execute on function public.create_company_availability(uuid,text,integer,date,date,text,text) to authenticated;
