import "server-only";

export type TrackingEmailInput = {
  email: string;
  customerName: string;
  reference: string;
  token: string;
};

export type EmailDelivery = "sent" | "not_configured" | "failed";

export function getPublicSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  return vercel ? `https://${vercel}` : "http://localhost:3000";
}

export function trackingUrl(reference: string, token: string) {
  const query = new URLSearchParams({ reference, token });
  return `${getPublicSiteUrl()}/track?${query}`;
}

export async function sendTrackingEmail(input: TrackingEmailInput): Promise<EmailDelivery> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.AFOS_EMAIL_FROM?.trim();
  if (!apiKey || !from) return "not_configured";
  const url = trackingUrl(input.reference, input.token);
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [input.email],
        subject: `Your AFOS request ${input.reference}`,
        html: `<div style="font-family:Arial,sans-serif;color:#152b24;line-height:1.6"><h1 style="font-size:28px">Your transport request was received</h1><p>Hello ${escapeHtml(input.customerName)},</p><p>Keep these private details to check your request:</p><p><strong>Reference:</strong> ${escapeHtml(input.reference)}<br><strong>Tracking code:</strong> ${escapeHtml(input.token)}</p><p><a href="${escapeHtml(url)}" style="background:#e85b2a;color:white;padding:12px 18px;text-decoration:none">Track this request</a></p><p>If the button does not work, visit the AFOS tracking page and enter the reference and tracking code above.</p></div>`,
      }),
      cache: "no-store",
    });
    return response.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}
