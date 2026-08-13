import "server-only";

import { requirePlatformRole } from "@/lib/auth/authorization";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type RequestSummary = {
  id: string; reference: string; customer: string; containerSize: string; quantity: number;
  pickup: string; destination: string; requiredAt: string; contactName: string; contactPhone: string;
  status: string; containerNumber: string | null; contactEmail: string | null;
};

export async function listTransportRequests(): Promise<RequestSummary[]> {
  await requirePlatformRole(["afos_operations", "afos_administrator"]);
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("transport_requests")
    .select("id, reference, container_size, quantity, pickup_location, destination_location, required_at, operational_contact_name, operational_contact_phone, contact_email, status, container_number, organizations!inner(name)")
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
      status: request.status, containerNumber: request.container_number, contactEmail: request.contact_email };
  });
}

export type RequestWorkspace = RequestSummary & {
  notes:string|null;cargoCategory:string|null;estimatedWeightKg:number|null;estimatedPrice:number|null;priceStatus:string;createdAt:string;
  compatibleAvailability:Array<{id:string;providerId:string;providerName:string;quantity:number;availableFrom:string;availableUntil:string;operatingArea:string|null}>;
  assignment:{id:string;providerName:string;status:string;assignedAt:string}|null;
  activity:Array<{id:number;action:string;reason:string|null;occurredAt:string}>;
};

export async function getRequestWorkspace(id:string):Promise<RequestWorkspace|null>{await requirePlatformRole(["afos_operations","afos_administrator"]);const db=await createServerSupabaseClient();const{data:request,error}=await db.from("transport_requests").select("id,reference,container_size,quantity,pickup_location,destination_location,required_at,operational_contact_name,operational_contact_phone,contact_email,status,container_number,notes,cargo_category,estimated_weight_kg,estimated_price,price_status,created_at,organizations!inner(name)").eq("id",id).maybeSingle();if(error)throw new Error("Request could not be loaded.");if(!request)return null;const [availabilityResult,assignmentResult,activityResult]=await Promise.all([db.from("provider_availability").select("id,provider_id,container_size,quantity,available_from,available_until,operating_area,status,organizations!inner(name)").eq("status","available").eq("container_size",request.container_size).gte("quantity",request.quantity).lte("available_from",request.required_at.slice(0,10)).gte("available_until",request.required_at.slice(0,10)).order("available_from"),db.from("company_assignments").select("id,status,assigned_at,organizations!inner(name)").eq("request_id",id).neq("status","cancelled").maybeSingle(),db.from("audit_events").select("id,action,reason,occurred_at").eq("entity_type","transport_request").eq("entity_id",id).order("occurred_at",{ascending:false}).limit(30)]);if(availabilityResult.error||assignmentResult.error||activityResult.error)throw new Error("Request workspace could not be loaded.");const one=<T>(value:T|T[])=>Array.isArray(value)?value[0]:value;const organization=one(request.organizations);const assignment=assignmentResult.data;const assignedOrganization=assignment?one(assignment.organizations):null;return{id:request.id,reference:request.reference,customer:organization?.name??"Unknown customer",containerSize:request.container_size,quantity:request.quantity,pickup:request.pickup_location,destination:request.destination_location,requiredAt:request.required_at,contactName:request.operational_contact_name,contactPhone:request.operational_contact_phone,contactEmail:request.contact_email,status:request.status,containerNumber:request.container_number,notes:request.notes,cargoCategory:request.cargo_category,estimatedWeightKg:request.estimated_weight_kg,estimatedPrice:request.estimated_price,priceStatus:request.price_status,createdAt:request.created_at,compatibleAvailability:(availabilityResult.data??[]).map(item=>{const provider=one(item.organizations);return{id:item.id,providerId:item.provider_id,providerName:provider?.name??"Unknown company",quantity:item.quantity,availableFrom:item.available_from,availableUntil:item.available_until,operatingArea:item.operating_area}}),assignment:assignment?{id:assignment.id,providerName:assignedOrganization?.name??"Unknown company",status:assignment.status,assignedAt:assignment.assigned_at}:null,activity:(activityResult.data??[]).map(item=>({id:item.id,action:item.action,reason:item.reason,occurredAt:item.occurred_at}))};}
