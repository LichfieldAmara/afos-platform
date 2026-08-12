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
};

export async function listProviders(): Promise<ProviderSummary[]> {
  await requirePlatformRole(["afos_operations", "afos_administrator"]);
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("id, name, registration_number, primary_contact_name, primary_contact_phone, status, provider_verifications!inner(id, status, updated_at)")
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
    };
  });
}

