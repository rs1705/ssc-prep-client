/**
 * Builds the app icons from one drawing (a circle): an open book with an arrow climbing above it,
 * in white on the brand gradient (indigo to blue). Same drawing as components/custom/brand-mark.tsx.
 * Run: node scripts/make-icons.mjs  (writes app/icon.svg and the PNGs in public/)
 */
import { writeFileSync } from "node:fs";
import sharp from "sharp";

/** The white strokes on a 512 canvas, optionally shrunk toward the centre (maskable). */
function mark(scale = 1) {
  const off = (512 * (1 - scale)) / 2;
  return `<g transform="translate(${off} ${off}) scale(${scale})" fill="none" stroke="#ffffff" stroke-width="30" stroke-linecap="round" stroke-linejoin="round">
<path d="M256 392 C220 370 174 366 140 373 V258 C174 251 220 255 256 278 Z"/>
<path d="M256 392 C292 370 338 366 372 373 V258 C338 251 292 255 256 278 Z"/>
<path d="M164 206 L226 148 L276 186 L356 110"/>
<path d="M306 108 H358 V160"/>
</g>`;
}

/** `round`: the circular icon (browser tab, app icons). Otherwise a full square, for
 *  icons the phone crops into its own shape (maskable, iPhone). */
const GRADIENT = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#3b82f6"/></linearGradient></defs>`;
const svg = (round, scale = 1) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${GRADIENT}${
    round ? `<circle cx="256" cy="256" r="256" fill="url(#g)"/>` : `<rect width="512" height="512" fill="url(#g)"/>`
  }${mark(scale)}</svg>`;

const icon = svg(true);
writeFileSync("app/icon.svg", icon + "\n");
const png = (src, size, out) => sharp(Buffer.from(src)).resize(size, size).png().toFile(out);
await png(icon, 192, "public/icon-192.png");
await png(icon, 512, "public/icon-512.png");
// Maskable: full-bleed background, drawing kept inside the central safe zone.
await png(svg(false, 0.78), 512, "public/icon-maskable-512.png");
// iOS rounds the corners itself and doesn't allow transparency.
await png(svg(false), 180, "public/apple-touch-icon.png");
console.log("icons written");
