import sharp from "sharp";
import { fileURLToPath } from "node:url";

const width = 1063;
const height = 650;
const here = (name) => fileURLToPath(new URL(name, import.meta.url));

const photo = await sharp(here("./trailer-photo.png"))
  .resize(width, height, { fit: "cover", position: "centre" })
  .toBuffer();

const qr = await sharp(here("../../public/afos-request-qr.png"))
  .resize(300, 300, { kernel: "nearest" })
  .toBuffer();

const frontArtwork = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0b241c" stop-opacity="0.98"/>
      <stop offset="0.68" stop-color="#0b241c" stop-opacity="0.64"/>
      <stop offset="1" stop-color="#0b241c" stop-opacity="0.18"/>
    </linearGradient>
  </defs>
  <rect width="1063" height="650" fill="url(#shade)"/>
  <rect x="42" y="36" width="58" height="58" rx="12" fill="#ed5a2a"/>
  <text x="71" y="77" fill="#fff" font-family="Arial, sans-serif" font-size="34" font-weight="700" text-anchor="middle">A</text>
  <text x="122" y="61" fill="#fff" font-family="Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="3">AFOS</text>
  <text x="123" y="90" fill="#fff" opacity="0.84" font-family="Arial, sans-serif" font-size="22">AFRICAN FLEET OPERATING SYSTEM</text>
  <text x="42" y="180" fill="#ff8056" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="4">CONTAINER TRANSPORT</text>
  <text x="39" y="287" fill="#fff" font-family="Arial, sans-serif" font-size="70" font-weight="700" letter-spacing="-3">Need transport for</text>
  <text x="39" y="363" fill="#fff" font-family="Arial, sans-serif" font-size="70" font-weight="700" letter-spacing="-3">your container?</text>
  <rect x="42" y="406" width="62" height="7" rx="4" fill="#ed5a2a"/>
  <text x="42" y="476" fill="#fff" font-family="Arial, sans-serif" font-size="34">Tell us where it is, where it needs to go</text>
  <text x="42" y="520" fill="#fff" font-family="Arial, sans-serif" font-size="34">and when.</text>
  <text x="42" y="600" fill="#fff" opacity="0.82" font-family="Arial, sans-serif" font-size="25">FREETOWN · SIERRA LEONE</text>
</svg>`);

const backArtwork = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="1063" height="650" fill="#f8f5ef"/>
  <rect x="42" y="35" width="58" height="58" rx="12" fill="#ed5a2a"/>
  <text x="71" y="76" fill="#fff" font-family="Arial, sans-serif" font-size="34" font-weight="700" text-anchor="middle">A</text>
  <text x="122" y="60" fill="#183129" font-family="Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="3">AFOS</text>
  <text x="123" y="89" fill="#596761" font-family="Arial, sans-serif" font-size="22">AFRICAN FLEET OPERATING SYSTEM</text>
  <rect x="41" y="145" width="332" height="332" rx="18" fill="#fff" stroke="#d1d9d2" stroke-width="4"/>
  <text x="423" y="200" fill="#ed5a2a" font-family="Arial, sans-serif" font-size="21" font-weight="700" letter-spacing="4">NO ACCOUNT REQUIRED</text>
  <text x="423" y="272" fill="#183129" font-family="Arial, sans-serif" font-size="48" font-weight="700">Scan to request</text>
  <text x="423" y="326" fill="#183129" font-family="Arial, sans-serif" font-size="48" font-weight="700">container transport</text>
  <text x="423" y="407" fill="#596761" font-family="Arial, sans-serif" font-size="27">CALL OR WHATSAPP</text>
  <text x="423" y="454" fill="#183129" font-family="Arial, sans-serif" font-size="38" font-weight="700">+232 99 507223</text>
  <text x="423" y="522" fill="#596761" font-family="Arial, sans-serif" font-size="27">EMAIL</text>
  <text x="423" y="566" fill="#183129" font-family="Arial, sans-serif" font-size="33" font-weight="700">Jjusu98@gmail.com</text>
  <text x="42" y="612" fill="#596761" font-family="Arial, sans-serif" font-size="23">afos-platform.vercel.app</text>
</svg>`);

await sharp({ create: { width, height, channels: 4, background: "#102720" } })
  .composite([{ input: photo, left: 0, top: 0 }, { input: frontArtwork, left: 0, top: 0 }])
  .png({ compressionLevel: 9 })
  .toFile(here("./afos-contact-card-front.png"));

await sharp(Buffer.from(backArtwork))
  .composite([{ input: qr, left: 57, top: 161 }])
  .png({ compressionLevel: 9 })
  .toFile(here("./afos-contact-card-back.png"));

const frontPreview = await sharp(here("./afos-contact-card-front.png")).resize({ width: 900 }).toBuffer();
const backPreview = await sharp(here("./afos-contact-card-back.png")).resize({ width: 900 }).toBuffer();

await sharp({ create: { width: 980, height: 1220, channels: 4, background: "#dedbd4" } })
  .composite([{ input: frontPreview, left: 40, top: 40 }, { input: backPreview, left: 40, top: 670 }])
  .png({ compressionLevel: 9 })
  .toFile(here("./afos-contact-card-preview.png"));
