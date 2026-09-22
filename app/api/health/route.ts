import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// The active pilot writes to Google Sheets, not the dormant Supabase schema.
// This checks configuration only; a successful customer submission is the
// end-to-end verification of the private Sheet connection.
export function GET() {
  const configured = Boolean(
    process.env.GOOGLE_SHEETS_WEBHOOK_URL &&
      process.env.GOOGLE_SHEETS_WEBHOOK_SECRET,
  );

  return NextResponse.json(
    {
      application: "ok",
      requestInbox: configured ? "configured" : "not_configured",
    },
    {
      status: configured ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
