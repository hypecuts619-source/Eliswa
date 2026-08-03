/**
 * Regenerates the brand assets in public/ from the pristine masters in brand/.
 *
 * The masters are transparent PNGs exported from the identity artwork. This
 * script trims the transparent margin, scales each mark down to the largest
 * size the site actually renders it at (2x for retina), and emits the favicon
 * / web-app icon set from the EW monogram.
 *
 *   node scripts/build-brand-assets.cjs
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const BRAND = path.join(ROOT, 'brand');
const PUBLIC = path.join(ROOT, 'public');

/** Tight-crop to the alpha bounding box, with a little breathing room. */
async function trimToAlpha(file, padRatio = 0.02) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * channels + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) throw new Error(`${file} is fully transparent`);

  const pad = Math.round(Math.max(maxX - minX, maxY - minY) * padRatio);
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);

  return sharp(file).extract({
    left,
    top,
    width: Math.min(width - left, maxX - minX + 1 + pad * 2),
    height: Math.min(height - top, maxY - minY + 1 + pad * 2),
  });
}

/** Pad a mark out to a centred square so favicons keep their proportions. */
function squarePad(pipeline, size) {
  return pipeline
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true });
}

async function main() {
  const png = { compressionLevel: 9, quality: 90, effort: 10 };

  // --- EW monogram: navbar mark (rendered up to 80px tall -> 240px master) ---
  const monogram = await trimToAlpha(path.join(BRAND, 'eliswa_logo.png'));
  await monogram
    .clone()
    .resize({ height: 240, withoutEnlargement: true })
    .png(png)
    .toFile(path.join(PUBLIC, 'eliswa_logo.png'));

  // --- Eliswa India wordmark: footer mark (rendered up to 192px tall) ---
  const wordmark = await trimToAlpha(path.join(BRAND, 'eliswa_india.png'));
  await wordmark
    .clone()
    .resize({ height: 384, withoutEnlargement: true })
    .png(png)
    .toFile(path.join(PUBLIC, 'eliswa_india.png'));

  // --- Favicons & web-app icons, all from the monogram ---
  const icons = [
    ['favicon-32.png', 32],
    ['favicon-96.png', 96],
    ['apple-touch-icon.png', 180],
    ['icon-192.png', 192],
    ['icon-512.png', 512],
  ];
  for (const [name, size] of icons) {
    // Apple touch icons are composited on an opaque tile, so give them the
    // brand cream rather than letting iOS fall back to black.
    const opaque = name === 'apple-touch-icon.png';
    let pipeline = squarePad(monogram.clone(), Math.round(size * 0.88));
    pipeline = sharp(await pipeline.toBuffer()).resize(size, size, {
      fit: 'contain',
      background: opaque ? { r: 250, g: 246, b: 235, alpha: 1 } : { r: 0, g: 0, b: 0, alpha: 0 },
    });
    if (opaque) pipeline = pipeline.flatten({ background: '#FAF6EB' });
    await pipeline.png({ compressionLevel: 9 }).toFile(path.join(PUBLIC, name));
  }

  // --- Open Graph card: wordmark centred on brand cream ---
  await sharp({
    create: { width: 1200, height: 630, channels: 4, background: '#FAF6EB' },
  })
    .composite([
      { input: await wordmark.clone().resize({ width: 760 }).png().toBuffer(), gravity: 'centre' },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(PUBLIC, 'og-image.png'));

  for (const f of fs.readdirSync(PUBLIC).filter((f) => /\.(png|webp)$/.test(f))) {
    const { size } = fs.statSync(path.join(PUBLIC, f));
    console.log(`${f.padEnd(24)} ${(size / 1024).toFixed(1)} KB`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
