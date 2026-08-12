import { NextResponse } from "next/server";

import { getSupabasePublicConfig } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

const requiredTables = [
  "organizations",
  "profiles",
  "organization_memberships",
  "provider_verifications",
  "trucks",
  "trailers",
  "drivers",
  "capacity_declarations",
  "transport_requests",
  "provider_offers",
  "allocations",
  "trips",
  "trip_status_events",
  "exceptions",
  "deliveries",
  "notifications",
  "audit_events",
  "route_tariffs",
  "provider_availability",
  "company_assignments",
];

export async function GET() {
  const config = getSupabasePublicConfig();

  if (!config) {
    return NextResponse.json(
      {
        application: "ok",
        database: "not_configured",
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(`${config.url}/auth/v1/health`, {
      headers: {
        apikey: config.publishableKey,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Supabase health check returned ${response.status}`);
    }

    const tableChecks = await Promise.all(
      requiredTables.map(async (table) => {
        const tableResponse = await fetch(
          `${config.url}/rest/v1/${table}?select=id&limit=0`,
          {
            headers: {
              apikey: config.publishableKey,
              Authorization: `Bearer ${config.publishableKey}`,
            },
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
          },
        );

        return tableResponse.ok ? null : table;
      }),
    );

    const missingTables = tableChecks.filter((table) => table !== null);

    if (missingTables.length > 0) {
      return NextResponse.json(
        {
          application: "ok",
          database: "connected",
          schema: "incomplete",
          missingTables,
        },
        { status: 503 },
      );
    }

    return NextResponse.json({
      application: "ok",
      database: "connected",
      schema: "ready",
    });
  } catch {
    return NextResponse.json(
      {
        application: "ok",
        database: "unavailable",
      },
      { status: 503 },
    );
  }
}
