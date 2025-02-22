import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';

const sizes = [16, 32, 64, 96, 128];
const inputSvgPath = './src/public/wxt.svg';
const outputDir = './src/public/icon/';

async function generateIcons() {
  await fs.ensureDir(outputDir); // 出力ディレクトリを作成

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `${size}.png`);
    await sharp(inputSvgPath)
      .resize(size, size)
      .toFile(outputPath);
    console.log(`Generated: ${outputPath}`);
  }
}

await generateIcons()