-- AFOS DEVELOPMENT ONLY
-- Replace founder@example.com with the exact email created in Supabase Auth.

do $$
declare
  founder_email text := lower('founder@example.com');
  founder_user_id uuid;
  afos_organization_id uuid;
begin
  select id into founder_user_id
  from auth.users
  where lower(email) = founder_email;

  if founder_user_id is null then
    raise exception 'No Supabase Auth user exists for %', founder_email;
  end if;

  select id into afos_organization_id
  from public.organizations
  where name = 'AFOS' and organization_type = 'afos'
  order by created_at
  limit 1;

  if afos_organization_id is null then
    insert into public.organizations (name, organization_type)
    values ('AFOS', 'afos')
    returning id into afos_organization_id;
  end if;

  insert into public.profiles (id, full_name)
  values (founder_user_id, 'AFOS Founder')
  on conflict (id) do update set
    full_name = excluded.full_name,
    updated_at = now();

  insert into public.organization_memberships (
    organization_id,
    user_id,
    role,
    status
  ) values (
    afos_organization_id,
    founder_user_id,
    'afos_administrator',
    'active'
  )
  on conflict (organization_id, user_id, role) do update set
    status = 'active';
end $$;
