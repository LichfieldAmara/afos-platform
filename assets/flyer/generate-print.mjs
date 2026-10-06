import sharp from "sharp";
import { fileURLToPath } from "node:url";

const width = 1240;
const height = 1748;
const here = (name) => fileURLToPath(new URL(name, import.meta.url));

const photo = await sharp(here("./trailer-photo.png"))
  .resize(width, 1110, { fit: "cover", position: "centre" })
  .toBuffer();

const qr = await sharp(here("../../public/afos-request-qr.png"))
  .resize(390, 390, { kernel: "nearest" })
  .toBuffer();

const frontArtwork = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="frontShade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0d251e" stop-opacity="0.96"/>
      <stop offset="0.72" stop-color="#0d251e" stop-opacity="0.42"/>
      <stop offset="1" stop-color="#0d251e" stop-opacity="0.12"/>
    </linearGradient>
  </defs>
  <rect width="1240" height="1110" fill="url(#frontShade)"/>
  <rect x="62" y="58" width="70" height="70" rx="15" fill="#ed5a2a"/>
  <text x="97" y="106" fill="#fff" font-family="Arial, sans-serif" font-size="39" font-weight="700" text-anchor="middle">A</text>
  <text x="157" y="91" fill="#fff" font-family="Arial, sans-serif" font-size="39" font-weight="700" letter-spacing="3">AFOS</text>
  <text x="158" y="123" fill="#fff" opacity="0.82" font-family="Arial, sans-serif" font-size="19">AFRICAN FLEET OPERATING SYSTEM</text>
  <text x="62" y="240" fill="#ff8056" font-family="Arial, sans-serif" font-size="23" font-weight="700" letter-spacing="5">CONTAINER TRANSPORT · SIERRA LEONE</text>
  <text x="58" y="376" fill="#fff" font-family="Arial, sans-serif" font-size="83" font-weight="700" letter-spacing="-4">Need transport for</text>
  <text x="58" y="465" fill="#fff" font-family="Arial, sans-serif" font-size="83" font-weight="700" letter-spacing="-4">your container?</text>
  <rect x="62" y="520" width="74" height="8" rx="4" fill="#ed5a2a"/>
  <text x="62" y="604" fill="#fff" font-family="Arial, sans-serif" font-size="39">Tell us where your container is, where it needs</text>
  <text x="62" y="656" fill="#fff" font-family="Arial, sans-serif" font-size="39">to go and when. AFOS will coordinate suitable</text>
  <text x="62" y="708" fill="#fff" font-family="Arial, sans-serif" font-size="39">transport and contact you.</text>
  <rect x="0" y="1065" width="1240" height="683" fill="#f8f5ef"/>
  <text x="62" y="1180" fill="#ed5a2a" font-family="Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="4">NO ACCOUNT REQUIRED</text>
  <text x="62" y="1260" fill="#183129" font-family="Arial, sans-serif" font-size="54" font-weight="700">Scan to request</text>
  <text x="62" y="1320" fill="#183129" font-family="Arial, sans-serif" font-size="54" font-weight="700">container transport</text>
  <text x="62" y="1402" fill="#596761" font-family="Arial, sans-serif" font-size="35">Or contact AFOS directly:</text>
  <text x="62" y="1472" fill="#183129" font-family="Arial, sans-serif" font-size="45" font-weight="700">+232 99 507223</text>
  <text x="62" y="1532" fill="#183129" font-family="Arial, sans-serif" font-size="35" font-weight="700">Jjusu98@gmail.com</text>
  <text x="62" y="1630" fill="#596761" font-family="Arial, sans-serif" font-size="28">afos-platform.vercel.app</text>
  <rect x="785" y="1214" width="422" height="422" rx="20" fill="#fff" stroke="#d1d9d2" stroke-width="4"/>
</svg>`);

const backArtwork = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="1240" height="1748" fill="#f8f5ef"/>
  <rect width="1240" height="300" fill="#102720"/>
  <rect x="62" y="82" width="86" height="86" rx="18" fill="#ed5a2a"/>
  <text x="105" y="140" fill="#fff" font-family="Arial, sans-serif" font-size="48" font-weight="700" text-anchor="middle">A</text>
  <text x="180" y="119" fill="#fff" font-family="Arial, sans-serif" font-size="50" font-weight="700" letter-spacing="4">AFOS</text>
  <text x="182" y="163" fill="#fff" opacity="0.78" font-family="Arial, sans-serif" font-size="26">AFRICAN FLEET OPERATING SYSTEM</text>
  <text x="62" y="414" fill="#ed5a2a" font-family="Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="4">CONTAINER TRANSPORT, COORDINATED SIMPLY</text>
  <text x="58" y="535" fill="#183129" font-family="Arial, sans-serif" font-size="69" font-weight="700" letter-spacing="-3">One request.</text>
  <text x="58" y="612" fill="#183129" font-family="Arial, sans-serif" font-size="69" font-weight="700" letter-spacing="-3">AFOS coordinates the transport.</text>
  <text x="62" y="710" fill="#596761" font-family="Arial, sans-serif" font-size="39">Tell us how many trucks or trailers you need,</text>
  <text x="62" y="764" fill="#596761" font-family="Arial, sans-serif" font-size="39">where they should collect from, where they should</text>
  <text x="62" y="818" fill="#596761" font-family="Arial, sans-serif" font-size="39">deliver, and when they are required.</text>
  <line x1="62" y1="900" x2="1178" y2="900" stroke="#ced5cf" stroke-width="3"/>
  <text x="62" y="990" fill="#ed5a2a" font-family="Arial, sans-serif" font-size="27" font-weight="700">01</text>
  <text x="145" y="990" fill="#183129" font-family="Arial, sans-serif" font-size="41" font-weight="700">Send your request</text>
  <text x="62" y="1082" fill="#ed5a2a" font-family="Arial, sans-serif" font-size="27" font-weight="700">02</text>
  <text x="145" y="1082" fill="#183129" font-family="Arial, sans-serif" font-size="41" font-weight="700">AFOS reviews the details</text>
  <text x="62" y="1174" fill="#ed5a2a" font-family="Arial, sans-serif" font-size="27" font-weight="700">03</text>
  <text x="145" y="1174" fill="#183129" font-family="Arial, sans-serif" font-size="41" font-weight="700">We contact you</text>
  <rect x="0" y="1320" width="1240" height="428" fill="#102720"/>
  <text x="62" y="1410" fill="#ff8056" font-family="Arial, sans-serif" font-size="23" font-weight="700" letter-spacing="4">CONTACT AFOS</text>
  <text x="62" y="1502" fill="#fff" font-family="Arial, sans-serif" font-size="52" font-weight="700">Call or WhatsApp</text>
  <text x="62" y="1570" fill="#fff" font-family="Arial, sans-serif" font-size="45">+232 99 507223</text>
  <text x="62" y="1655" fill="#fff" font-family="Arial, sans-serif" font-size="39">Jjusu98@gmail.com</text>
</svg>`);

await sharp({ create: { width, height, channels: 4, background: "#f8f5ef" } })
  .composite([
    { input: photo, left: 0, top: 0 },
    { input: frontArtwork, left: 0, top: 0 },
    { input: qr, left: 801, top: 1230 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(here("./afos-a6-print-front.png"));

await sharp(Buffer.from(backArtwork))
  .png({ compressionLevel: 9 })
  .toFile(here("./afos-a6-print-back.png"));

const previewBackground = await sharp({ create: { width: 1360, height: 1000, channels: 4, background: "#dedbd4" } }).png().toBuffer();
const frontPreview = await sharp(here("./afos-a6-print-front.png")).resize({ height: 900 }).toBuffer();
const backPreview = await sharp(here("./afos-a6-print-back.png")).resize({ height: 900 }).toBuffer();

await sharp(previewBackground)
  .composite([
    { input: frontPreview, left: 42, top: 50 },
    { input: backPreview, left: 700, top: 50 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(here("./afos-a6-print-preview.png"));
