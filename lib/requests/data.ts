import "server-only";

import { requirePlatformRole } from "@/lib/auth/authorization";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type RequestSummary = {
  id: string; reference: string; customer: string; containerSize: string; quantity: number;
  pickup: string; destination: string; requiredAt: string; contactName: string; contactPhone: string;
  status: string; containerNumber: string | null;
};

export async function listTransportRequests(): Promise<RequestSummary[]> {
  await requirePlatformRole(["afos_operations", "afos_administrator"]);
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("transport_requests")
    .select("id, reference, container_size, quantity, pickup_location, destination_location, required_at, operational_contact_name, operational_contact_phone, status, container_number, organizations!inner(name)")
    .order("created_at", { ascending: false }).limit(100);
  if (error) {
    if (error.message.includes("movement_type") || error.message.includes("container_number")) return [];
    throw new Error("Transport requests could not be loaded.");
  }
  return (data ?? []).map((request) => {
    const organization = Array.isArray(request.organizations) ? request.organizations[0] : request.organizations;
    return { id: request.id, reference: request.reference, customer: organization?.name ?? "Unknown customer",
      containerSize: request.container_size, quantity: request.quantity, pickup: request.pickup_location,
      destination: request.destination_location, requiredAt: request.required_at,
      contactName: request.operational_contact_name, contactPhone: request.operational_contact_phone,
      status: request.status, containerNumber: request.container_number };
  });
}
