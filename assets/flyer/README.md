# AFOS container transport flyer

`afos-container-transport-flyer.jpg` is a 2400 × 3000 pixel share/print flyer. Its QR code opens `https://afos-platform.vercel.app/` so visitors see the AFOS homepage first.

The trailer photograph in `trailer-photo.png` was AI-generated for AFOS. Generation prompt: realistic green heavy-duty tractor pulling a 40-foot container trailer near a West African coastal port, warm late-afternoon commercial photography, no logos or text, portrait framing with sky for typography.

The headline, phone number, and QR placement are composed deterministically in `generate.mjs` to keep them accurate. After changing the copy or QR asset, run `node assets/flyer/generate.mjs` from the project root.

`afos-a6-print-front.png` and `afos-a6-print-back.png` are the two sides of the print-specific A6 portrait card at 300 DPI (1240 × 1748 pixels). Four cards fit on one A4 sheet. The QR code is approximately 33 mm wide at final size, and contact information uses `+232 99 507223` and `Jjusu98@gmail.com`. Run `node assets/flyer/generate-print.mjs` to regenerate both sides and the side-by-side review preview.
