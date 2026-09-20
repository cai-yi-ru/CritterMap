const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'assets', 'pet-stickers');
const destination = path.join(root, 'public', 'pet-icons-v3');

async function main() {
  fs.mkdirSync(destination, { recursive: true });
  for (const filename of fs.readdirSync(source).filter((file) => file.endsWith('.png'))) {
    const input = path.join(source, filename);
    const metadata = await sharp(input).metadata();
    if (!metadata.hasAlpha) throw new Error(`${filename}: missing transparent alpha channel`);
    // Preserve the generated artwork and alpha; only fit it into a padded UI asset.
    const resized = await sharp(input)
      .resize(176, 176, { fit: 'contain', background: '#00000000' })
      .extend({ top: 8, bottom: 8, left: 8, right: 8, background: '#00000000' })
      .webp({ quality: 92, alphaQuality: 100, effort: 6 })
      .toFile(path.join(destination, filename.replace('.png', '.webp')));
    console.log(`${filename}: 192 × 192, ${resized.size} bytes`);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
