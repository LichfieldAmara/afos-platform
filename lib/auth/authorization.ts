import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import type { Role } from "@/domain/permissions";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireUser } from "./session";

export type ActiveMembership = {
  organizationId: string;
  organizationName: string;
  organizationType: string;
  role: Role;
};

export const getActiveMemberships = cache(async (): Promise<ActiveMembership[]> => {
  const user = await requireUser();
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("organization_memberships")
    .select("role, organization_id, organizations!inner(name, organization_type)")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (error) throw new Error("Memberships could not be loaded.");

  return (data ?? []).map((membership) => {
    const organization = Array.isArray(membership.organizations)
      ? membership.organizations[0]
      : membership.organizations;
    return {
      organizationId: membership.organization_id,
      organizationName: organization?.name ?? "Unknown organization",
      organizationType: organization?.organization_type ?? "unknown",
      role: membership.role as Role,
    };
  });
});

export async function requirePlatformRole(allowedRoles: Role[]) {
  const memberships = await getActiveMemberships();
  const membership = memberships.find(
    (item) => item.organizationType === "afos" && allowedRoles.includes(item.role),
  );
  if (!membership) redirect("/app?error=forbidden");
  return membership;
}

