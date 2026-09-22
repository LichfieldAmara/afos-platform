import sharp from "sharp";
import { fileURLToPath } from "node:url";

const width = 2400;
const height = 3000;
const photo = await sharp(fileURLToPath(new URL("./trailer-photo.png", import.meta.url)))
  .extract({ left: 0, top: 302, width: 1122, height: 1100 })
  .resize(width, 2350, { fit: "cover" })
  .toBuffer();
const qr = await sharp(fileURLToPath(new URL("../../public/afos-request-qr.png", import.meta.url)))
  .resize(550, 550, { kernel: "nearest" })
  .toBuffer();

const design = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#102720" stop-opacity="0.90"/>
      <stop offset="0.58" stop-color="#102720" stop-opacity="0.40"/>
      <stop offset="1" stop-color="#102720" stop-opacity="0.02"/>
    </linearGradient>
    <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#102720" stop-opacity="0.38"/>
      <stop offset="1" stop-color="#102720" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="2400" height="2350" fill="url(#shade)"/>
  <rect width="2400" height="750" fill="url(#top)"/>
  <rect x="125" y="115" width="88" height="88" rx="18" fill="#ed5a2a"/>
  <text x="169" y="174" fill="#fff" font-family="Helvetica Neue, Arial, sans-serif" font-size="52" font-weight="700" text-anchor="middle">A</text>
  <text x="246" y="163" fill="#fff" font-family="Helvetica Neue, Arial, sans-serif" font-size="57" font-weight="700" letter-spacing="4">AFOS</text>
  <text x="250" y="204" fill="#fff" opacity="0.78" font-family="Helvetica Neue, Arial, sans-serif" font-size="31" letter-spacing="1">CONTAINER TRANSPORT</text>
  <text x="130" y="395" fill="#ff865c" font-family="Helvetica Neue, Arial, sans-serif" font-size="35" font-weight="700" letter-spacing="9">TRANSPORT MADE SIMPLE</text>
  <text x="120" y="605" fill="#fff" font-family="Helvetica Neue, Arial, sans-serif" font-size="150" font-weight="600" letter-spacing="-7">Need a truck</text>
  <text x="120" y="775" fill="#fff" font-family="Helvetica Neue, Arial, sans-serif" font-size="150" font-weight="600" letter-spacing="-7">or trailer for</text>
  <text x="120" y="945" fill="#fff" font-family="Helvetica Neue, Arial, sans-serif" font-size="150" font-weight="600" letter-spacing="-7">your container?</text>
  <rect x="125" y="1030" width="100" height="10" rx="5" fill="#ed5a2a"/>
  <text x="125" y="1124" fill="#fff" font-family="Helvetica Neue, Arial, sans-serif" font-size="48">Tell AFOS where and when.</text>
  <text x="125" y="1196" fill="#fff" font-family="Helvetica Neue, Arial, sans-serif" font-size="48">We’ll help arrange the transport.</text>
  <rect x="0" y="2230" width="2400" height="770" fill="#f8f5ef"/>
  <rect x="125" y="2345" width="20" height="210" rx="10" fill="#ed5a2a"/>
  <text x="190" y="2415" fill="#1b3029" font-family="Helvetica Neue, Arial, sans-serif" font-size="76" font-weight="700" letter-spacing="-2">SCAN TO REQUEST</text>
  <text x="190" y="2510" fill="#1b3029" font-family="Helvetica Neue, Arial, sans-serif" font-size="76" font-weight="700" letter-spacing="-2">CONTAINER TRANSPORT</text>
  <text x="190" y="2600" fill="#58655e" font-family="Helvetica Neue, Arial, sans-serif" font-size="42">No account needed. We’ll contact you.</text>
  <line x1="125" y1="2750" x2="1570" y2="2750" stroke="#ccd2ca" stroke-width="3"/>
  <text x="125" y="2843" fill="#58655e" font-family="Helvetica Neue, Arial, sans-serif" font-size="39" letter-spacing="3">FOR ENQUIRIES</text>
  <text x="560" y="2846" fill="#1b3029" font-family="Helvetica Neue, Arial, sans-serif" font-size="62" font-weight="700">+23299507223</text>
  <text x="125" y="2932" fill="#58655e" font-family="Helvetica Neue, Arial, sans-serif" font-size="35">afos-platform.vercel.app</text>
  <rect x="1650" y="2315" width="630" height="630" rx="25" fill="#fff" stroke="#d5ddd5" stroke-width="5"/>
</svg>`);

await sharp({
  create: { width, height, channels: 4, background: "#f8f5ef" },
})
  .composite([
    { input: photo, left: 0, top: 0 },
    { input: design, left: 0, top: 0 },
    { input: qr, left: 1690, top: 2355 },
  ])
  .jpeg({ quality: 95, mozjpeg: true, chromaSubsampling: "4:4:4" })
  .toFile(fileURLToPath(new URL("./afos-container-transport-flyer.jpg", import.meta.url)));
