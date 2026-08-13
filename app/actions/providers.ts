"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requirePlatformRole } from "@/lib/auth/authorization";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ProviderActionState = { message: string; success?: boolean };

const providerSchema=z.object({name:z.string().trim().min(2),kind:z.enum(["company","individual_owner"]),registrationNumber:z.string().trim().max(80),contactName:z.string().trim().min(2),contactPhone:z.string().trim().min(5),contactEmail:z.string().trim().email().or(z.literal("")),declaredVehicles:z.coerce.number().int().min(1).max(1000),areas:z.string().trim().max(500)}).refine(x=>x.kind!=="company"||x.registrationNumber.length>=2,{message:"Enter the company registration number."});

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
    kind:formData.get("kind"),contactEmail:formData.get("contactEmail")??"",declaredVehicles:formData.get("declaredVehicles"),areas:formData.get("areas")??"",
  });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message ?? "Check the provider details." };
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.rpc("create_transport_provider_v2", {
    provider_name: parsed.data.name,
    registration_number: parsed.data.registrationNumber,
    contact_name: parsed.data.contactName,
    contact_phone: parsed.data.contactPhone,
    provider_kind:parsed.data.kind,contact_email:parsed.data.contactEmail,declared_vehicles:parsed.data.declaredVehicles,operating_areas:parsed.data.areas,
  });
  if (error) return { message: "The provider could not be created. Check for duplicate or invalid information." };
  revalidatePath("/app/providers");
  return { message: "Provider created with draft verification.", success: true };
}
export async function registerVehicle(_s:ProviderActionState,f:FormData):Promise<ProviderActionState>{await requirePlatformRole(["afos_operations","afos_administrator"]);const p=z.object({providerId:z.uuid(),kind:z.enum(["truck","trailer"]),registration:z.string().trim().min(2),size:z.string().trim(),insurance:z.string(),roadworthiness:z.string()}).refine(x=>x.kind!=="trailer"||x.size.length>=2,{message:"Enter the trailer container size."}).safeParse({providerId:f.get("providerId"),kind:f.get("kind"),registration:f.get("registration"),size:f.get("size")??"",insurance:f.get("insurance")??"",roadworthiness:f.get("roadworthiness")??""});if(!p.success)return{message:p.error.issues[0]?.message??"Check vehicle details."};const db=await createServerSupabaseClient();const{error}=await db.rpc("register_provider_vehicle",{target_provider_id:p.data.providerId,vehicle_kind:p.data.kind,registration:p.data.registration,container_size:p.data.size,insurance_expiry:p.data.insurance||null,roadworthiness_expiry:p.data.roadworthiness||null});if(error)return{message:error.message.includes("unique")?"That registration number is already registered.":"Vehicle could not be registered."};revalidatePath("/app/providers");revalidatePath("/app/capacity");return{message:"Vehicle registered.",success:true};}
export async function setVehicleAvailability(_s:ProviderActionState,f:FormData):Promise<ProviderActionState>{await requirePlatformRole(["afos_operations","afos_administrator"]);const p=z.object({vehicleId:z.uuid(),kind:z.enum(["truck","trailer"]),status:z.enum(["active","inactive"]),availableAgain:z.string(),reason:z.string().trim()}).refine(x=>x.status!=="inactive"||(x.availableAgain&&x.reason.length>=3),{message:"Enter when it returns and why."}).safeParse({vehicleId:f.get("vehicleId"),kind:f.get("kind"),status:f.get("status"),availableAgain:f.get("availableAgain")??"",reason:f.get("reason")??""});if(!p.success)return{message:p.error.issues[0]?.message??"Check availability."};const db=await createServerSupabaseClient();const{error}=await db.rpc("set_vehicle_availability",{vehicle_kind:p.data.kind,vehicle_id:p.data.vehicleId,next_status:p.data.status,available_again:p.data.availableAgain||null,reason:p.data.reason});if(error)return{message:"Availability could not be updated."};revalidatePath("/app/providers");revalidatePath("/app/capacity");return{message:"Vehicle availability updated.",success:true};}

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
