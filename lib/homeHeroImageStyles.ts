const HERO_IMAGE_CROP_MAP: Record<string, string> = {
  "Hero image happy mom.png": "object-[50%_35%]",
  "Hero image gals with spys.png": "object-[50%_35%]",
  "Hero image christina.png": "object-[50%_35%]",
  "Hero image izzy and dre.png": "object-[50%_35%]",
  "Hero image guys on the steps.png": "object-[50%_35%]",
  "Hero image tom.png": "object-[50%_35%]",
  "Hero image nashville.png": "object-[50%_35%]",
  "Hero image salad.png": "object-[50%_35%]",
};

export function getHomeHeroImageClass(src: string) {
  const fileName = decodeURI(src).split("/").pop() ?? src;

  return HERO_IMAGE_CROP_MAP[fileName] ?? "object-center";
}
