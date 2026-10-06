# AFOS container transport flyer

`afos-container-transport-flyer.jpg` is a 2400 × 3000 pixel share/print flyer. Its QR code opens `https://afos-platform.vercel.app/` so visitors see the AFOS homepage first.

The trailer photograph in `trailer-photo.png` was AI-generated for AFOS. Generation prompt: realistic green heavy-duty tractor pulling a 40-foot container trailer near a West African coastal port, warm late-afternoon commercial photography, no logos or text, portrait framing with sky for typography.

The headline, phone number, and QR placement are composed deterministically in `generate.mjs` to keep them accurate. After changing the copy or QR asset, run `node assets/flyer/generate.mjs` from the project root.

`afos-contact-card-front.png` and `afos-contact-card-back.png` are the two sides of the print-specific 90 × 55 mm landscape contact card at 300 DPI (1063 × 650 pixels). The front retains the container-truck photograph and one short explanatory sentence. The back gives the QR code approximately 25 mm of physical width and presents `+232 99 507223` and `Jjusu98@gmail.com` without additional body copy.

Run `node assets/flyer/generate-contact-card.mjs` to regenerate both sides and the review preview. Run `build-contact-card-pdfs.py` with the bundled PDF Python runtime to produce the two-page individual-card PDF and the duplex A4 ten-up sheet with cutting guides.
