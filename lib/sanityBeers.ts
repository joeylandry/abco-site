import { client } from "@/lib/sanity"
import type { Beer } from "@/components/beer/BeerCard"
import { createEmptyBeerFilterSelections, type BeerFilterSelections } from "@/studio/schemaTypes/shared/beerAttributes"

type SanityImage = {
  url?: string | null
  alt?: string | null
}

type SanityBeerImage = SanityImage & {
  imageType?: string | null
}

type SanityBeerDoc = {
  _id: string
  title?: string | null
  name?: string | null
  slug?: string | null
  style?: string | null
  abv?: number | null
  ibu?: number | null
  shortDescription?: string | null
  longDescription?: string | null
  availability?: string[] | null
  packaging?: string[] | null
  featured?: boolean | null
  cardColor?: string | null
  tags?: string[] | null
  active?: boolean | null
  sortOrder?: number | null
  attributes?: {
    appearanceSelections?: string[] | null
    maltCharacter?: string[] | null
    hopCharacter?: string[] | null
    yeastAndFermentation?: string[] | null
    bodyAndFeel?: string[] | null
    overallProfile?: string[] | null
  } | null
  appearance?: string | null
  maltCharacter?: string[] | null
  hopCharacter?: string[] | null
  yeastAndFermentation?: string[] | null
  bodyAndFeel?: string[] | null
  overallProfile?: string[] | null
  beerImages?: SanityBeerImage[] | null
  primaryImage?: SanityImage | null
  cardImage?: SanityImage | null
  hoverImage?: SanityImage | null
  galleryImage?: SanityImage | null
  image?: SanityImage | null
  secondaryImage?: SanityImage | null
  galleryImages?: SanityImage[] | null
  detailImages?: SanityImage[] | null
  beerCanClipartUrl?: string | null
}

const beerQueryFields = `{
  _id,
  title,
  name,
  "slug": slug.current,
  style,
  abv,
  ibu,
  shortDescription,
  longDescription,
  availability,
  packaging,
  featured,
  cardColor,
  tags,
  active,
  sortOrder,
  attributes {
    appearanceSelections,
    maltCharacter,
    hopCharacter,
    yeastAndFermentation,
    bodyAndFeel,
    overallProfile
  },
  appearance,
  maltCharacter,
  hopCharacter,
  yeastAndFermentation,
  bodyAndFeel,
  overallProfile,
  "beerImages": beerImages[] {
    imageType,
    "url": image.asset->url,
    "alt": coalesce(image.alt, ^.title)
  },
  "primaryImage": primaryImage {
    "url": image.asset->url,
    alt
  },
  "cardImage": cardImage {
    "url": image.asset->url,
    alt
  },
  "hoverImage": hoverImage {
    "url": image.asset->url,
    alt
  },
  "galleryImage": galleryImage {
    "url": image.asset->url,
    alt
  },
  "image": image {
    "url": image.asset->url,
    alt
  },
  "secondaryImage": secondaryImage {
    "url": image.asset->url,
    alt
  },
  "galleryImages": galleryImages[] {
    "url": image.asset->url,
    alt
  },
  "detailImages": detailImages[] {
    "url": image.asset->url,
    alt
  },
  "beerCanClipartUrl": beerCanClipart.asset->url
}`

const allBeersQuery = `*[
  _type == "beer" &&
  active == true &&
  defined(slug.current)
] | order(coalesce(sortOrder, 9999) asc, _createdAt asc) ${beerQueryFields}`

const beerBySlugQuery = `*[
  _type == "beer" &&
  active == true &&
  slug.current == $slug
][0] ${beerQueryFields}`

function normalizeStringList(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed ? [trimmed] : []
  }

  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item): item is string => item.length > 0)
}

function pickFirstString(...values: Array<string | null | undefined>) {
  for (const value of values) {
    if (typeof value === "string") {
      const trimmed = value.trim()
      if (trimmed) {
        return trimmed
      }
    }
  }

  return null
}

function normalizeAvailability(values: unknown): Beer["availability"] {
  const availabilityValues = normalizeStringList(values)

  if (availabilityValues.includes("yearRound")) {
    return "yearRound"
  }

  if (availabilityValues.includes("seasonal")) {
    return "seasonal"
  }

  return "rotating"
}

function getBeerFilterSelections(doc: SanityBeerDoc): BeerFilterSelections {
  const attributes = doc.attributes ?? {}

  return {
    ...createEmptyBeerFilterSelections(),
    availability: normalizeStringList(doc.availability),
    packaging: normalizeStringList(doc.packaging),
    appearanceSelections: normalizeStringList(attributes.appearanceSelections ?? doc.appearance),
    maltCharacter: normalizeStringList(attributes.maltCharacter ?? doc.maltCharacter),
    hopCharacter: normalizeStringList(attributes.hopCharacter ?? doc.hopCharacter),
    yeastAndFermentation: normalizeStringList(attributes.yeastAndFermentation ?? doc.yeastAndFermentation),
    bodyAndFeel: normalizeStringList(attributes.bodyAndFeel ?? doc.bodyAndFeel),
    overallProfile: normalizeStringList(attributes.overallProfile ?? doc.overallProfile),
  }
}

function normalizeBeer(doc: SanityBeerDoc): Beer {
  const title = pickFirstString(doc.title, doc.name) ?? "Untitled Beer"
  const beerImages = doc.beerImages ?? []
  const galleryImages = [
    ...(doc.galleryImages ?? []),
    ...(doc.detailImages ?? []),
    ...beerImages.filter((image) => image.imageType === "gallery"),
  ].map((image) => image.url).filter((url): url is string => Boolean(url?.trim()))

  const primaryImage = pickFirstString(
    beerImages.find((image) => image.imageType === "mainDesktop")?.url,
    doc.primaryImage?.url,
    doc.cardImage?.url,
    doc.image?.url,
    doc.beerCanClipartUrl,
    galleryImages[0],
  )

  const secondaryImage = pickFirstString(
    beerImages.find((image) => image.imageType === "desktopHoverMobile")?.url,
    doc.hoverImage?.url,
    doc.secondaryImage?.url,
    galleryImages.find((url) => url !== primaryImage),
    galleryImages[1],
    primaryImage,
  )

  const detailImages = Array.from(
    new Set([
      primaryImage,
      secondaryImage,
      ...beerImages.filter((image) => image.imageType === "gallery").map((image) => image.url),
      ...galleryImages,
    ].filter((url): url is string => Boolean(url && url.trim()))),
  )

  const primaryAlt =
    pickFirstString(
      beerImages.find((image) => image.imageType === "mainDesktop")?.alt,
      doc.primaryImage?.alt,
      doc.cardImage?.alt,
      doc.image?.alt,
      doc.hoverImage?.alt,
      doc.secondaryImage?.alt,
      title,
    ) ?? title

  return {
    id: doc.slug ?? doc._id,
    name: title,
    style: pickFirstString(doc.style) ?? "Beer",
    abv: typeof doc.abv === "number" ? doc.abv : 0,
    ibu: typeof doc.ibu === "number" ? doc.ibu : undefined,
    shortDescription: pickFirstString(doc.shortDescription, doc.longDescription) ?? "",
    longDescription: pickFirstString(doc.longDescription, doc.shortDescription) ?? undefined,
    availability: normalizeAvailability(doc.availability),
    featured: doc.featured ?? undefined,
    image: {
      primarySrc: primaryImage ?? "/beer/beer2_temp.png",
      secondarySrc: secondaryImage ?? primaryImage ?? "/beer/beer2_temp.png",
      alt: primaryAlt,
    },
    detailImages: detailImages.length > 0 ? detailImages : undefined,
    tags: normalizeStringList(doc.tags),
    packaging: normalizeStringList(doc.packaging) as Beer["packaging"],
    filterSelections: getBeerFilterSelections(doc),
    cardColor: pickFirstString(doc.cardColor) ?? "#FFFFFF",
  }
}

export async function getSanityBeers() {
  try {
    const beers = await client.fetch<SanityBeerDoc[]>(allBeersQuery)
    return beers.map(normalizeBeer)
  } catch {
    return []
  }
}

export async function getSanityBeerBySlug(slug: string) {
  try {
    const beer = await client.fetch<SanityBeerDoc | null>(beerBySlugQuery, { slug })
    return beer ? normalizeBeer(beer) : undefined
  } catch {
    return undefined
  }
}
