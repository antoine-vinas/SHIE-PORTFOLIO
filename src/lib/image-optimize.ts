import sharp from "sharp";

const MAX_WIDTH = 1920;
const QUALITY = 82;

export async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  let pipeline = image;

  if (metadata.width && metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, undefined, {
      withoutEnlargement: true,
      fit: "inside",
    });
  }

  return pipeline
    .webp({ quality: QUALITY, effort: 4 })
    .toBuffer();
}

export function generateStoragePath(filename: string): string {
  const timestamp = Date.now();
  const safeName = filename
    .replace(/[^a-zA-Z0-9.-]/g, "-")
    .toLowerCase()
    .replace(/\.[^.]+$/, "");
  return `${timestamp}-${safeName}.webp`;
}
