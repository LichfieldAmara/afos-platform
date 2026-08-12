begin;

create function public.create_transport_provider(
  provider_name text,
  registration_number text,
  contact_name text,
  contact_phone text
) returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  new_provider_id uuid;
begin
  if not (
    public.has_platform_role('afos_operations')
    or public.has_platform_role('afos_administrator')
  ) then
    raise exception 'Not authorized';
  end if;

  if char_length(trim(provider_name)) < 2 then
    raise exception 'Provider name is required';
  end if;

  insert into public.organizations (
    name,
    organization_type,
    registration_number,
    primary_contact_name,
    primary_contact_phone
  ) values (
    trim(provider_name),
    'transport_provider',
    nullif(trim(registration_number), ''),
    nullif(trim(contact_name), ''),
    nullif(trim(contact_phone), '')
  ) returning id into new_provider_id;

  insert into public.provider_verifications (provider_id, status)
  values (new_provider_id, 'draft');

  insert into public.audit_events (
    actor_id,
    organization_id,
    action,
    entity_type,
    entity_id,
    after_data
  ) values (
    auth.uid(),
    new_provider_id,
    'provider.created',
    'organization',
    new_provider_id,
    jsonb_build_object('name', trim(provider_name), 'verification_status', 'draft')
  );

  return new_provider_id;
end;
$$;

create function public.review_provider_verification(
  verification_id uuid,
  decision public.verification_status,
  decision_reason text
) returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  target_provider_id uuid;
  previous_status public.verification_status;
begin
  if not (
    public.has_platform_role('afos_operations')
    or public.has_platform_role('afos_administrator')
  ) then
    raise exception 'Not authorized';
  end if;

  if decision not in ('under_review', 'verified', 'rejected', 'suspended') then
    raise exception 'Invalid verification decision';
  end if;

  if decision in ('rejected', 'suspended') and char_length(trim(decision_reason)) < 3 then
    raise exception 'A reason is required';
  end if;

  select provider_id, status
  into target_provider_id, previous_status
  from public.provider_verifications
  where id = verification_id
  for update;

  if target_provider_id is null then
    raise exception 'Verification not found';
  end if;

  update public.provider_verifications
  set status = decision,
      reviewed_at = case when decision in ('verified', 'rejected', 'suspended') then now() else reviewed_at end,
      reviewed_by = auth.uid(),
      decision_reason = nullif(trim(decision_reason), ''),
      updated_at = now()
  where id = verification_id;

  update public.organizations
  set status = case when decision = 'suspended' then 'suspended'::public.record_status else status end,
      updated_at = now()
  where id = target_provider_id;

  insert into public.audit_events (
    actor_id,
    organization_id,
    action,
    entity_type,
    entity_id,
    reason,
    before_data,
    after_data
  ) values (
    auth.uid(),
    target_provider_id,
    'provider.verification_reviewed',
    'provider_verification',
    verification_id,
    nullif(trim(decision_reason), ''),
    jsonb_build_object('status', previous_status),
    jsonb_build_object('status', decision)
  );
end;
$$;

grant execute on function public.create_transport_provider(text, text, text, text) to authenticated;
grant execute on function public.review_provider_verification(uuid, public.verification_status, text) to authenticated;

commit;

