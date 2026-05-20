import { readdirSync } from "node:fs";
import { extname, join } from "node:path";

const HERO_IMAGES_DIR = join(process.cwd(), "public", "Tom Hero Images");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function isHeroImage(fileName: string) {
  const extension = extname(fileName).toLowerCase();
  return IMAGE_EXTENSIONS.has(extension);
}

export function getHomeHeroImages() {
  return readdirSync(HERO_IMAGES_DIR)
    .filter(isHeroImage)
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" }))
    .map((fileName) => encodeURI(`/Tom Hero Images/${fileName}`));
}
