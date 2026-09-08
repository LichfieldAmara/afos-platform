const SHEET_NAME = 'Transport Requests';
const HEADERS = ['Timestamp', 'Request number', 'Name / company', 'Phone / WhatsApp', 'Pickup location', 'Delivery location', 'Equipment', 'Size', 'Quantity', 'Required date', 'Additional information'];

function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents);
    const expectedSecret = PropertiesService.getScriptProperties().getProperty('AFOS_WEBHOOK_SECRET');
    if (!expectedSecret || data.secret !== expectedSecret) return json({ ok: false, error: 'Unauthorized' });
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    const existing = sheet.getLastRow() > 1 ? sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues().flat() : [];
    if (existing.includes(data.requestNumber)) return json({ ok: true, duplicate: true });
    sheet.appendRow([new Date(data.timestamp), safe(data.requestNumber), safe(data.customerName), safe(data.phone), safe(data.pickupLocation), safe(data.deliveryLocation), safe(data.equipment), safe(data.size), Number(data.quantity), safe(data.requiredDate), safe(data.additionalInformation)]);
    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, error: String(error) });
  }
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function safe(value) {
  const text = String(value || '');
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
