import { NextResponse } from "next/server";

import { getSupabasePublicConfig } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

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

    return NextResponse.json({
      application: "ok",
      database: "connected",
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

