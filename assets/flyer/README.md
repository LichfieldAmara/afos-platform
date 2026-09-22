# AFOS container transport flyer

`afos-container-transport-flyer.jpg` is a 2400 × 3000 pixel share/print flyer. Its QR code opens `https://afos-platform.vercel.app/` so visitors see the AFOS homepage first.

The trailer photograph in `trailer-photo.png` was AI-generated for AFOS. Generation prompt: realistic green heavy-duty tractor pulling a 40-foot container trailer near a West African coastal port, warm late-afternoon commercial photography, no logos or text, portrait framing with sky for typography.

The headline, phone number, and QR placement are composed deterministically in `generate.mjs` to keep them accurate. After changing the copy or QR asset, run `node assets/flyer/generate.mjs` from the project root.
