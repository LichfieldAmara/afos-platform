begin;

create policy audit_operations_insert
on public.audit_events
for insert
to authenticated
with check (
  actor_id = auth.uid()
  and (
    public.has_platform_role('afos_operations')
    or public.has_platform_role('afos_administrator')
  )
);

commit;

