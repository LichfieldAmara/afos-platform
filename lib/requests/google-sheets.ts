import "server-only";

export type SheetRequest = {
  timestamp: string; requestNumber: string; customerName: string; phone: string;
  pickupLocation: string; deliveryLocation: string; equipment: string; size: string;
  quantity: number; requiredDate: string; additionalInformation: string;
};

export async function appendTransportRequest(request: SheetRequest) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
  if (!url || !secret) throw new Error("Google Sheets is not configured.");
  const response = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ secret, ...request }), cache: "no-store" });
  if (!response.ok) throw new Error("Google Sheets rejected the request.");
  const result = (await response.json()) as { ok?: boolean };
  if (!result.ok) throw new Error("Google Sheets did not save the request.");
}
