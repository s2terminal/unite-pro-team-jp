// Convert public/favicon.svg to public/ogp.png with 1200x630 canvas
// using @resvg/resvg-js (pure JS/WASM, no native deps)
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, '..');
const srcSvgPath = path.join(root, 'public', 'favicon.svg');
const outPngPath = path.join(root, 'public', 'ogp.png');

const CANVAS_W = 1200;
const CANVAS_H = 630;
const ICON_H = 630; // render the square icon to 630x630

async function main() {
  const svg = await readFile(srcSvgPath, 'utf8');

  // Render the original square SVG to 630x630 PNG
  const iconRenderer = new Resvg(svg, {
    background: 'white',
    fitTo: { mode: 'height', value: ICON_H },
  });
  const iconPng = iconRenderer.render().asPng(); // Buffer

  // Embed the 630x630 PNG into a 1200x630 white canvas, centered horizontally
  const x = Math.round((CANVAS_W - ICON_H) / 2); // 285
  const y = 0;
  const dataUrl = `data:image/png;base64,${iconPng.toString('base64')}`;

  const outerSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_W}" height="${CANVAS_H}" viewBox="0 0 ${CANVAS_W} ${CANVAS_H}">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <image href="${dataUrl}" x="${x}" y="${y}" width="${ICON_H}" height="${ICON_H}" />
</svg>`;

  const finalRenderer = new Resvg(outerSvg, {
    background: 'white',
    // Render at provided width/height; no additional scaling
  });
  const finalPng = finalRenderer.render().asPng();
  await writeFile(outPngPath, finalPng);
  console.log(`✅ Generated ${path.relative(root, outPngPath)} (${finalPng.length} bytes)`);
}

main().catch((err) => {
  console.error('Failed to generate ogp.png:', err);
  process.exit(1);
});
