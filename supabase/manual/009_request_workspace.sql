begin;

create or replace function public.confirm_transport_request_price(target_request_id uuid,confirmed_price numeric,review_note text default '') returns void language plpgsql security invoker set search_path='' as $price$
declare request_record public.transport_requests%rowtype;
begin
  if not(public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) then raise exception 'Not authorized';end if;
  if confirmed_price<=0 then raise exception 'Price must be greater than zero';end if;
  select * into request_record from public.transport_requests where id=target_request_id for update;
  if request_record.id is null then raise exception 'Request not found';end if;
  update public.transport_requests set estimated_price=confirmed_price,price_status='confirmed',updated_at=now() where id=target_request_id;
  insert into public.audit_events(actor_id,organization_id,action,entity_type,entity_id,reason,before_data,after_data) values(auth.uid(),request_record.organization_id,'transport_request.price_confirmed','transport_request',target_request_id,nullif(trim(review_note),''),jsonb_build_object('price',request_record.estimated_price,'price_status',request_record.price_status),jsonb_build_object('price',confirmed_price,'price_status','confirmed'));
end;$price$;

create or replace function public.update_transport_request_status(target_request_id uuid,next_status text,status_note text) returns void language plpgsql security invoker set search_path='' as $status$
declare request_record public.transport_requests%rowtype;allowed boolean:=false;
begin
  if not(public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) then raise exception 'Not authorized';end if;
  if char_length(trim(status_note))<3 then raise exception 'Status note is required';end if;
  select * into request_record from public.transport_requests where id=target_request_id for update;
  if request_record.id is null then raise exception 'Request not found';end if;
  allowed:=case request_record.status::text when 'submitted' then next_status in('matching','cancelled') when 'matching' then next_status in('allocated','cancelled') when 'matched' then next_status in('allocated','cancelled') when 'allocated' then next_status in('in_progress','cancelled') when 'in_progress' then next_status in('completed','failed') else false end;
  if not allowed then raise exception 'Invalid status transition from % to %',request_record.status,next_status;end if;
  update public.transport_requests set status=next_status::public.request_status,updated_at=now(),cancellation_reason=case when next_status='cancelled' then trim(status_note) else cancellation_reason end where id=target_request_id;
  insert into public.audit_events(actor_id,organization_id,action,entity_type,entity_id,reason,before_data,after_data) values(auth.uid(),request_record.organization_id,'transport_request.status_updated','transport_request',target_request_id,trim(status_note),jsonb_build_object('status',request_record.status),jsonb_build_object('status',next_status));
end;$status$;

grant execute on function public.confirm_transport_request_price(uuid,numeric,text) to authenticated;
grant execute on function public.update_transport_request_status(uuid,text,text) to authenticated;
commit;
