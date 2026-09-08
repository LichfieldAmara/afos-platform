# AFOS Google Sheet connection

The website sends each validated request to a private Google Sheet through a Google Apps Script web app. The sheet owner controls access; customers never see it.

The script creates a `Transport Requests` tab and these columns automatically: Timestamp, Request number, Name/company, Phone/WhatsApp, Pickup, Delivery, Equipment, Size, Quantity, Required date, and Additional information.

Setup is completed in the owner's Google account. Copy `Code.gs` into **Extensions → Apps Script**, set the `AFOS_WEBHOOK_SECRET` script property, deploy as a web app, and add its URL and the same secret to Vercel as `GOOGLE_SHEETS_WEBHOOK_URL` and `GOOGLE_SHEETS_WEBHOOK_SECRET`.
