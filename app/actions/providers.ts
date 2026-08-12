"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requirePlatformRole } from "@/lib/auth/authorization";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ProviderActionState = { message: string; success?: boolean };

const providerSchema = z.object({
  name: z.string().trim().min(2, "Enter the provider's registered or operating name."),
  registrationNumber: z.string().trim().max(80),
  contactName: z.string().trim().max(120),
  contactPhone: z.string().trim().max(40),
});

const verificationSchema = z.object({
  verificationId: z.uuid(),
  decision: z.enum(["under_review", "verified", "rejected", "suspended"]),
  reason: z.string().trim().max(500),
}).refine((value) => !["rejected", "suspended"].includes(value.decision) || value.reason.length >= 3, {
  message: "A reason is required when rejecting or suspending a provider.",
});

export async function createProvider(
  _state: ProviderActionState,
  formData: FormData,
): Promise<ProviderActionState> {
  await requirePlatformRole(["afos_operations", "afos_administrator"]);
  const parsed = providerSchema.safeParse({
    name: formData.get("name"),
    registrationNumber: formData.get("registrationNumber") ?? "",
    contactName: formData.get("contactName") ?? "",
    contactPhone: formData.get("contactPhone") ?? "",
  });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message ?? "Check the provider details." };
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("create_transport_provider", {
    provider_name: parsed.data.name,
    registration_number: parsed.data.registrationNumber,
    contact_name: parsed.data.contactName,
    contact_phone: parsed.data.contactPhone,
  });
  if (error) return { message: "The provider could not be created. Check for duplicate or invalid information." };
  revalidatePath("/app/providers");
  return { message: "Provider created with draft verification.", success: true };
}

export async function reviewProvider(
  _state: ProviderActionState,
  formData: FormData,
): Promise<ProviderActionState> {
  await requirePlatformRole(["afos_operations", "afos_administrator"]);
  const parsed = verificationSchema.safeParse({
    verificationId: formData.get("verificationId"),
    decision: formData.get("decision"),
    reason: formData.get("reason") ?? "",
  });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message ?? "Check the review decision." };
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("review_provider_verification", {
    verification_id: parsed.data.verificationId,
    decision: parsed.data.decision,
    decision_reason: parsed.data.reason,
  });
  if (error) return { message: "The verification decision could not be saved." };
  revalidatePath("/app/providers");
  return { message: "Verification status updated and audited.", success: true };
}

