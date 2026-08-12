const fs = require("node:fs");
const path = require("node:path");
const sharp = require("sharp");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(root, "tmp", "imagegen-kawaii");
const outputDir = path.join(root, "public", "pet-icons-v2");

const icons = [
  "amphibian",
  "bird",
  "cat",
  "chinchilla",
  "dog",
  "ferret",
  "fish",
  "frog",
  "guinea-pig",
  "hedgehog",
  "lizard",
  "mouse",
  "other-exotic",
  "rabbit",
  "reptile",
  "snake",
  "sugar-glider",
  "turtle",
  "wild-animal",
];

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });

  await Promise.all(
    icons.map(async (icon) => {
      const input = path.join(sourceDir, `${icon}-transparent.png`);
      const output = path.join(outputDir, `${icon}.webp`);

      await sharp(input)
        .resize(192, 192, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
          kernel: sharp.kernel.lanczos3,
        })
        .webp({ quality: 92, alphaQuality: 100, effort: 6 })
        .toFile(output);
    }),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
