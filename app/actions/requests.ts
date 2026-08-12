"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requirePlatformRole } from "@/lib/auth/authorization";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type RequestActionState = { message: string; success?: boolean; reference?: string };

const requestSchema = z.object({
  customerName: z.string().trim().min(2, "Enter the customer or company name."),
  movementType: z.enum(["import", "export", "empty_return", "other"]),
  containerSize: z.enum(["20ft", "40ft"]),
  quantity: z.coerce.number().int().min(1, "Enter at least one container.").max(100, "Enter 100 containers or fewer."),
  containerNumber: z.string().trim().max(30),
  cargoCategory: z.string().trim().max(100),
  estimatedWeightKg: z.union([z.literal(""), z.coerce.number().positive("Weight must be greater than zero.").max(100000)]),
  pickupLocation: z.string().trim().min(2, "Enter the pickup place."),
  destinationLocation: z.string().trim().min(2, "Enter the delivery place."),
  requiredAt: z.string().min(1, "Choose when the container should be picked up."),
  contactName: z.string().trim().min(2, "Enter the person we should call."),
  contactPhone: z.string().trim().min(5, "Enter a working phone number.").max(40),
  notes: z.string().trim().max(500),
}).refine((value) => !Number.isNaN(new Date(value.requiredAt).getTime()), {
  message: "Choose a valid pickup date and time.", path: ["requiredAt"],
});

export async function createTransportRequest(
  _state: RequestActionState,
  formData: FormData,
): Promise<RequestActionState> {
  await requirePlatformRole(["afos_operations", "afos_administrator"]);
  const parsed = requestSchema.safeParse({
    customerName: formData.get("customerName"), movementType: formData.get("movementType"),
    containerSize: formData.get("containerSize"), quantity: formData.get("quantity"),
    containerNumber: formData.get("containerNumber") ?? "", cargoCategory: formData.get("cargoCategory") ?? "",
    estimatedWeightKg: formData.get("estimatedWeightKg") ?? "", pickupLocation: formData.get("pickupLocation"),
    destinationLocation: formData.get("destinationLocation"), requiredAt: formData.get("requiredAt"),
    contactName: formData.get("contactName"), contactPhone: formData.get("contactPhone"), notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) return { message: parsed.error.issues[0]?.message ?? "Check the request details." };

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("create_transport_request_for_customer", {
    customer_name: parsed.data.customerName, movement_type: parsed.data.movementType,
    container_size: parsed.data.containerSize, container_quantity: parsed.data.quantity,
    container_number: parsed.data.containerNumber, cargo_category: parsed.data.cargoCategory,
    estimated_weight_kg: parsed.data.estimatedWeightKg === "" ? null : parsed.data.estimatedWeightKg,
    pickup_location: parsed.data.pickupLocation, destination_location: parsed.data.destinationLocation,
    required_at: new Date(parsed.data.requiredAt).toISOString(), contact_name: parsed.data.contactName,
    contact_phone: parsed.data.contactPhone, notes: parsed.data.notes,
  });
  if (error) return { message: "The request could not be saved. Please try again or check that the database update is installed." };

  revalidatePath("/app/requests"); revalidatePath("/app");
  return { message: "Request submitted. It is ready for capacity matching.", success: true, reference: String(data) };
}
