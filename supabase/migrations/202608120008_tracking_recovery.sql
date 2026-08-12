begin;
create or replace function public.regenerate_guest_tracking_access(target_request_id uuid,new_tracking_token text,verification_note text) returns jsonb language plpgsql security definer set search_path='' as $recovery$
declare request_record public.transport_requests%rowtype;
begin
  if not (public.has_platform_role('afos_operations') or public.has_platform_role('afos_administrator')) then raise exception 'Not authorized'; end if;
  if char_length(new_tracking_token)<32 then raise exception 'Tracking token is too short'; end if;
  if char_length(trim(verification_note))<8 then raise exception 'Record how the customer identity was verified'; end if;
  select * into request_record from public.transport_requests where id=target_request_id for update;
  if request_record.id is null then raise exception 'Request not found'; end if;
  update public.transport_requests set tracking_token_hash=encode(extensions.digest(new_tracking_token,'sha256'),'hex'),updated_at=now() where id=target_request_id;
  insert into public.audit_events(actor_id,organization_id,action,entity_type,entity_id,reason,after_data) values(auth.uid(),request_record.organization_id,'transport_request.tracking_access_regenerated','transport_request',target_request_id,trim(verification_note),jsonb_build_object('reference',request_record.reference,'previous_access_invalidated',true));
  return jsonb_build_object('reference',request_record.reference,'contact_email',request_record.contact_email,'contact_name',request_record.operational_contact_name);
end;$recovery$;
revoke all on function public.regenerate_guest_tracking_access(uuid,text,text) from public,anon;
grant execute on function public.regenerate_guest_tracking_access(uuid,text,text) to authenticated;
commit;
