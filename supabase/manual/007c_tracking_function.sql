create or replace function public.track_guest_request(request_reference text,tracking_token text) returns jsonb language plpgsql security definer set search_path='' as $fn$
declare result jsonb;
begin
select jsonb_build_object('reference',r.reference,'status',r.status,'container_size',r.container_size,'quantity',r.quantity,'pickup',r.pickup_location,'destination',r.destination_location,'required_at',r.required_at,'estimated_price',r.estimated_price,'price_status',r.price_status,'provider',o.name,'trip_status',t.status) into result from public.transport_requests r left join public.company_assignments a on a.request_id=r.id left join public.organizations o on o.id=a.provider_id left join public.allocations al on al.request_id=r.id left join public.trips t on t.allocation_id=al.id where upper(r.reference)=upper(trim(request_reference)) and r.tracking_token_hash=encode(extensions.digest(tracking_token,'sha256'),'hex') limit 1;
return result;
end;$fn$;
grant execute on function public.track_guest_request(text,text) to anon,authenticated;
