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
  providerKind:string|null;declaredVehicles:number|null;contactEmail:string|null;operatingAreas:string|null;trucks:Array<{id:string;registration:string;status:string;insurance:string|null;roadworthiness:string|null;unavailableUntil:string|null}>;trailers:Array<{id:string;registration:string;size:string;status:string;insurance:string|null;roadworthiness:string|null;unavailableUntil:string|null}>;
};

export async function listProviders(): Promise<ProviderSummary[]> {
  await requirePlatformRole(["afos_operations", "afos_administrator"]);
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("id, name, registration_number, primary_contact_name, primary_contact_phone, primary_contact_email, provider_kind, declared_vehicle_count, operating_areas, status, provider_verifications!inner(id, status, updated_at), trucks(id,registration_number,status,insurance_expires_on,roadworthiness_expires_on,unavailable_until), trailers(id,registration_number,container_size,status,insurance_expires_on,roadworthiness_expires_on,unavailable_until)")
    .eq("organization_type", "transport_provider")
    .order("created_at", { ascending: false });
  if (error) throw new Error("Providers could not be loaded.");
  return (data ?? []).map((provider) => {
    const verification = Array.isArray(provider.provider_verifications)
      ? provider.provider_verifications[0]
      : provider.provider_verifications;
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
      providerKind:provider.provider_kind,declaredVehicles:provider.declared_vehicle_count,contactEmail:provider.primary_contact_email,operatingAreas:provider.operating_areas,trucks:(provider.trucks??[]).map(x=>({id:x.id,registration:x.registration_number,status:x.status,insurance:x.insurance_expires_on,roadworthiness:x.roadworthiness_expires_on,unavailableUntil:x.unavailable_until})),trailers:(provider.trailers??[]).map(x=>({id:x.id,registration:x.registration_number,size:x.container_size,status:x.status,insurance:x.insurance_expires_on,roadworthiness:x.roadworthiness_expires_on,unavailableUntil:x.unavailable_until})),
    };
  });
}
