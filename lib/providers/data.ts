import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requirePlatformRole } from "@/lib/auth/authorization";

export type ProviderSummary = {
  id: string;
  name: string;
  registrationNumber: string | null;
  contactName: string | null;
  contactPhone: string | null;
  organizationStatus: string;
  verificationId: string;
  verificationStatus: string;
  updatedAt: string;
  providerKind:string|null;declaredTrucks:number|null;declaredTrailers:number|null;contactEmail:string|null;operatingAreas:string|null;trucks:Array<{id:string;registration:string;status:string;insurance:string|null;roadworthiness:string|null;unavailableUntil:string|null}>;trailers:Array<{id:string;registration:string;size:string;status:string;insurance:string|null;roadworthiness:string|null;unavailableUntil:string|null}>;drivers:Array<{id:string;name:string;phone:string;license:string;expiry:string|null;status:string}>;
  fleet:{registeredTrucks:number;registeredTrailers:number;availableUnits:number;engagedUnits:number;unavailableAssets:number;expiredAssets:number;truckGap:number;trailerGap:number};
};

export async function listProviders(): Promise<ProviderSummary[]> {
  await requirePlatformRole(["afos_operations", "afos_administrator"]);
  const supabase = await createServerSupabaseClient();
  const [{ data, error }, trips] = await Promise.all([supabase
    .from("organizations")
    .select("id, name, registration_number, primary_contact_name, primary_contact_phone, primary_contact_email, provider_kind, declared_truck_count, declared_trailer_count, operating_areas, status, provider_verifications!inner(id, status, updated_at), trucks(id,registration_number,status,insurance_expires_on,roadworthiness_expires_on,unavailable_until), trailers(id,registration_number,container_size,status,insurance_expires_on,roadworthiness_expires_on,unavailable_until), drivers(id,full_name,phone,license_number,license_expires_on,status)")
    .eq("organization_type", "transport_provider")
    .order("created_at", { ascending: false }),supabase.from("trips").select("provider_id,truck_id,trailer_id,status").not("status","in",'(completed,failed,cancelled)')]);
  if (error||trips.error) throw new Error("Providers could not be loaded.");
  return (data ?? []).map((provider) => {
    const verification = Array.isArray(provider.provider_verifications)
      ? provider.provider_verifications[0]
      : provider.provider_verifications;
    const trucks=(provider.trucks??[]).map(x=>({id:x.id,registration:x.registration_number,status:x.status,insurance:x.insurance_expires_on,roadworthiness:x.roadworthiness_expires_on,unavailableUntil:x.unavailable_until})),trailers=(provider.trailers??[]).map(x=>({id:x.id,registration:x.registration_number,size:x.container_size,status:x.status,insurance:x.insurance_expires_on,roadworthiness:x.roadworthiness_expires_on,unavailableUntil:x.unavailable_until})),drivers=(provider.drivers??[]).map(x=>({id:x.id,name:x.full_name,phone:x.phone,license:x.license_number,expiry:x.license_expires_on,status:x.status}));const activeTrips=(trips.data??[]).filter(x=>x.provider_id===provider.id),engagedTrucks=new Set(activeTrips.map(x=>x.truck_id)),engagedTrailers=new Set(activeTrips.map(x=>x.trailer_id)),today=new Date().toISOString().slice(0,10),expired=(x:{insurance:string|null;roadworthiness:string|null})=>(x.insurance!=null&&x.insurance<today)||(x.roadworthiness!=null&&x.roadworthiness<today),available=(x:{id:string;status:string;insurance:string|null;roadworthiness:string|null;unavailableUntil:string|null},engaged:Set<string>)=>x.status==="active"&&!engaged.has(x.id)&&!expired(x)&&(!x.unavailableUntil||x.unavailableUntil<today);const availableUnits=Math.min(trucks.filter(x=>available(x,engagedTrucks)).length,trailers.filter(x=>available(x,engagedTrailers)).length,drivers.filter(x=>x.status==="active"&&(!x.expiry||x.expiry>=today)).length),engagedUnits=Math.min(engagedTrucks.size,engagedTrailers.size),unavailableAssets=[...trucks,...trailers].filter(x=>x.status!=="active"||(x.unavailableUntil!=null&&x.unavailableUntil>=today)).length,expiredAssets=[...trucks,...trailers].filter(expired).length;
    return {
      id: provider.id,
      name: provider.name,
      registrationNumber: provider.registration_number,
      contactName: provider.primary_contact_name,
      contactPhone: provider.primary_contact_phone,
      organizationStatus: provider.status,
      verificationId: verification.id,
      verificationStatus: verification.status,
      updatedAt: verification.updated_at,
      providerKind:provider.provider_kind,declaredTrucks:provider.declared_truck_count,declaredTrailers:provider.declared_trailer_count,contactEmail:provider.primary_contact_email,operatingAreas:provider.operating_areas,trucks,trailers,drivers,fleet:{registeredTrucks:trucks.length,registeredTrailers:trailers.length,availableUnits,engagedUnits,unavailableAssets,expiredAssets,truckGap:(provider.declared_truck_count??0)-trucks.length,trailerGap:(provider.declared_trailer_count??0)-trailers.length},
    };
  });
}
