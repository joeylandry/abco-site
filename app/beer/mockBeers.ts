import type { Beer } from "@/components/beer/BeerCard"
import { beerCardColors } from "@/lib/beerPalette"
import {
  beerFilterGroups,
  createEmptyBeerFilterSelections,
  type BeerFilterSelections,
} from "@/studio/schemaTypes/shared/beerAttributes"

type BeerGallerySelection = {
  gallerySrcs: string[]
}

export function getBeerGalleryPhotoSrc(beer: Beer) {
  const detailImages = beer.detailImages ?? []
  const galleryImages = detailImages.filter((src) => src.startsWith("/beer/beer_gallery/"))

  if (galleryImages.length === 0) {
    return null
  }

  return galleryImages.find((src) => src.includes("_beer")) ?? galleryImages[0] ?? null
}

const beerGallerySelections: Record<string, BeerGallerySelection> = {
  "my-juicy-gf": {
    gallerySrcs: [
      "/beer/beer2_temp.png",
      "/beer/beer_gallery/my_juicy_gf_vertical_0547-875.jpg",
    ],
  },
  "foxy-librarian-2025": {
    gallerySrcs: [
      "/beer/beer_gallery/foxy_librarian_vertical_0707_beer.jpg",
      "/beer/beer_gallery/foxy_librarian_vertical_0701-878.jpg",
    ],
  },
  menotomator: {
    gallerySrcs: [
      "/beer/beer_gallery/menotomato_vertical_0676_beer.jpg",
      "/beer/beer_gallery/menotomato_vertical_0688.jpg",
    ],
  },
  "time-only-goes": {
    gallerySrcs: [
      "/beer/beer_gallery/time_only_goes_vertical_0154.jpg",
      "/beer/beer_gallery/time_only_goes_vertical_0346.jpg",
    ],
  },
  "bike-path": {
    gallerySrcs: [
      "/beer/beer_gallery/bike_path_horizontal_0590_beer.jpg",
      "/beer/beer_gallery/bike_path_vertical_0585.jpg",
    ],
  },
  jedermann: {
    gallerySrcs: [
      "/beer/beer_gallery/jedermann_vertical_0171.jpg",
      "/beer/beer_gallery/jedermann_vertical_0464-860.jpg",
    ],
  },
  "marleys-ghost": {
    gallerySrcs: [
      "/beer/beer_gallery/marleys_ghost_vertical_0670_beer.jpg",
      "/beer/beer_gallery/marleys_ghost_vertical_0337.jpg",
    ],
  },
  "money-comes-and-goes": {
    gallerySrcs: [
      "/beer/beer_gallery/money_comes_and_goes_vertical_0695_beer.jpg",
      "/beer/beer_gallery/money_comes_and_goes_vertical_0544.jpg",
    ],
  },
  "my-new-gf": {
    gallerySrcs: [
      "/beer/beer_gallery/my_new_gf_vertical_0134.jpg",
      "/beer/beer_gallery/my_new_gf_vertical_0397-849.jpg",
    ],
  },
  presita: {
    gallerySrcs: [
      "/beer/beer_gallery/presita_vertical_0641_beer.jpg",
      "/beer/beer_gallery/presita_vertical_0334.jpg",
    ],
  },
  "spy-p-a": {
    gallerySrcs: [
      "/beer/beer_gallery/spy_p_a_vertical_0555_beer.jpg",
      "/beer/beer_gallery/spy_p_a_vertical_0495-866.jpg",
    ],
  },
  "stave-450": {
    gallerySrcs: [
      "/beer/beer_gallery/stave_450_vertical_0720.jpg",
      "/beer/beer_gallery/stave_450_vertical_0721.jpg",
    ],
  },
  "trafford-ale": {
    gallerySrcs: [
      "/beer/beer_gallery/trafford_ale_vertical_0577_beer.jpg",
      "/beer/beer_gallery/trafford_ale_vertical_0322.jpg",
    ],
  },
  walter: {
    gallerySrcs: [
      "/beer/beer_gallery/walter_vertical_0623._beerjpg.jpg",
      "/beer/beer_gallery/walter_vertical_0471-861.jpg",
    ],
  },
}

function buildBeerMedia(beerId: string, primarySrc: string, alt: string) {
  const gallery = beerGallerySelections[beerId]
  const hoverSrc = gallery?.gallerySrcs.find((src) => src.includes("_beer")) ?? gallery?.gallerySrcs[0]
  const extraSrc = gallery?.gallerySrcs.find((src) => src !== hoverSrc) ?? hoverSrc

  return {
    cardColor: beerCardColors[beerId] ?? "#FFFFFF",
    image: {
      primarySrc,
      secondarySrc: hoverSrc ?? "/beer/beer2_temp.png",
      alt,
    },
    detailImages: hoverSrc && extraSrc ? [primarySrc, hoverSrc, extraSrc] : [primarySrc, "/beer/beer2_temp.png", primarySrc],
  }
}

const beerFilterSelectionsById: Record<string, BeerFilterSelections> = {
  "my-juicy-gf": {
    availability: ["yearRound"],
    packaging: ["draft", "cans"],
    appearanceSelections: ["hazy"],
    hopCharacter: ["citrusy", "tropical"],
    yeastAndFermentation: ["clean", "fruity", "juicy"],
    bodyAndFeel: ["smooth", "creamy"],
    overallProfile: ["refreshing", "easyDrinking"],
  },
  "foxy-librarian-2025": {
    availability: ["rotating"],
    packaging: ["bottles"],
    appearanceSelections: ["clear", "golden"],
    maltCharacter: ["rich", "toasty", "vanilla"],
    hopCharacter: ["floral", "stoneFruit"],
    yeastAndFermentation: ["belgian", "spicy", "fruity"],
    bodyAndFeel: ["fullBodied", "dry"],
    overallProfile: ["bold", "complex"],
  },
  menotomator: {
    availability: ["seasonal"],
    packaging: ["draft", "cans"],
    appearanceSelections: ["dark", "amber"],
    maltCharacter: ["malty", "rich", "roasty", "toasty", "caramel", "chocolate"],
    bodyAndFeel: ["fullBodied", "smooth", "creamy"],
    overallProfile: ["balanced", "complex"],
  },
  "time-only-goes": {
    availability: ["rotating"],
    packaging: ["draft", "cans"],
    appearanceSelections: ["clear", "golden"],
    hopCharacter: ["piney", "resinous", "citrusy"],
    yeastAndFermentation: ["crisp", "clean"],
    bodyAndFeel: ["lightBodied", "dry", "effervescent"],
    overallProfile: ["bold", "refreshing"],
  },
  "bike-path": {
    availability: ["rotating"],
    packaging: ["draft"],
    appearanceSelections: ["golden", "clear"],
    hopCharacter: ["citrusy", "floral", "herbal"],
    yeastAndFermentation: ["crisp", "clean"],
    bodyAndFeel: ["lightBodied", "dry"],
    overallProfile: ["refreshing", "easyDrinking"],
  },
  jedermann: {
    availability: ["rotating"],
    packaging: ["draft"],
    appearanceSelections: ["golden", "amber"],
    maltCharacter: ["bready", "caramel", "biscuity"],
    bodyAndFeel: ["mediumBodied", "smooth"],
    overallProfile: ["balanced", "complex"],
  },
  "marleys-ghost": {
    availability: ["rotating"],
    packaging: ["draft"],
    appearanceSelections: ["dark", "ruby"],
    maltCharacter: ["roasty", "chocolate", "smoky"],
    yeastAndFermentation: ["funky", "spicy", "fruity", "sour", "tart"],
    bodyAndFeel: ["fullBodied", "dry"],
    overallProfile: ["bold", "complex"],
  },
  "money-comes-and-goes": {
    availability: ["rotating"],
    packaging: ["draft"],
    appearanceSelections: ["golden", "clear"],
    hopCharacter: ["tropical", "citrusy", "berry"],
    bodyAndFeel: ["mediumBodied", "smooth"],
    overallProfile: ["bold", "refreshing"],
  },
  "my-new-gf": {
    availability: ["rotating"],
    packaging: ["draft"],
    appearanceSelections: ["hazy"],
    hopCharacter: ["tropical", "citrusy", "berry"],
    yeastAndFermentation: ["juicy", "fruity"],
    bodyAndFeel: ["smooth", "creamy"],
    overallProfile: ["refreshing", "easyDrinking"],
  },
  presita: {
    availability: ["rotating"],
    packaging: ["draft"],
    appearanceSelections: ["amber", "clear"],
    maltCharacter: ["toasty", "caramel", "bready"],
    hopCharacter: ["floral", "earthy", "herbal"],
    bodyAndFeel: ["mediumBodied", "smooth"],
    overallProfile: ["balanced", "complex"],
  },
  "spy-p-a": {
    availability: ["rotating"],
    packaging: ["draft"],
    appearanceSelections: ["clear", "golden"],
    hopCharacter: ["piney", "resinous", "citrusy"],
    yeastAndFermentation: ["crisp", "clean"],
    bodyAndFeel: ["dry", "lightBodied"],
    overallProfile: ["bold", "refreshing"],
  },
  "stave-450": {
    availability: ["rotating"],
    packaging: ["draft"],
    appearanceSelections: ["dark", "amber"],
    maltCharacter: ["barrelAged", "roasty", "chocolate", "coffee", "smoky"],
    bodyAndFeel: ["fullBodied", "smooth"],
    overallProfile: ["complex", "bold"],
  },
  "trafford-ale": {
    availability: ["rotating"],
    packaging: ["draft"],
    appearanceSelections: ["golden", "clear"],
    maltCharacter: ["bready", "biscuity", "caramel"],
    hopCharacter: ["floral", "earthy", "herbal"],
    bodyAndFeel: ["mediumBodied", "smooth"],
    overallProfile: ["balanced", "easyDrinking"],
  },
  walter: {
    availability: ["rotating"],
    packaging: ["draft"],
    appearanceSelections: ["golden", "clear"],
    maltCharacter: ["malty", "bready"],
    bodyAndFeel: ["smooth", "mediumBodied"],
    overallProfile: ["balanced", "easyDrinking"],
  },
}

export function getBeerFilterSelections(beerId: string) {
  return beerFilterSelectionsById[beerId] ?? createEmptyBeerFilterSelections()
}

export function beerMatchesFilterSelections(beer: Beer, selections: BeerFilterSelections) {
  return beerFilterGroups.every(({ key }) => {
    const selectedValues = selections[key] ?? []
    if (selectedValues.length === 0) {
      return true
    }

    const beerValues = beer.filterSelections?.[key] ?? getBeerFilterSelections(beer.id)[key] ?? []
    return selectedValues.some((value) => beerValues.includes(value))
  })
}

export const mockBeers: Beer[] = [
  {
    id: "my-juicy-gf",
    name: "My Juicy GF",
    style: "New England IPA",
    abv: 6.6,
    ibu: 38,
    shortDescription:
      "Gluten-free take on a classic hazy IPA, soft, juicy, and bursting with citrus.",
    longDescription:
      "My Juicy GF is our gluten-free take on a classic New England IPA. Brewed to stay lush and fruit-forward, it opens with bright citrus, soft haze, and a rounded body that keeps the finish smooth. The hop profile leans into tangerine, grapefruit, and tropical aromatics without tipping into harsh bitterness, making it an easy-drinking pour with real hop character.",
    availability: "yearRound",
    featured: true,
    ...buildBeerMedia("my-juicy-gf", "/beer/my_juicy_gf.png", "My Juicy GF beer can and glass"),
    tags: ["citrus", "hazy", "juicy", "smooth"],
    packaging: ["draft", "cans"],
  },
  {
    id: "foxy-librarian-2025",
    name: "2025 Foxy Librarian",
    style: "Belgian Strong Ale",
    abv: 10.7,
    ibu: 95,
    shortDescription:
      "Bold and intriguing, with layered intensity and a dry finish.",
    longDescription:
      "2025 Foxy Librarian is built to be assertive. It pours with a dense, expressive character that moves from ripe fruit and spice into a firm, drying finish. There is weight here, but it stays composed, letting the strength show through structure instead of sweetness. It is the kind of beer that slows the room down and earns its own moment.",
    availability: "rotating",
    featured: true,
    ...buildBeerMedia("foxy-librarian-2025", "/beer/foxy_librarian.png", "Foxy Librarian beer bottle and glass"),
    tags: ["bold", "dry", "resin", "citrus"],
    packaging: ["bottles"],
  },
  {
    id: "menotomator",
    name: "Menotomator",
    style: "Double Bock",
    abv: 8.3,
    ibu: 25,
    shortDescription:
      "A rich dark lager with a surprisingly clean, light finish built for cold weather.",
    longDescription:
      "Menotomator carries the depth you want from a double bock but keeps the finish cleaner than expected. The malt profile lands with bread crust, cocoa, and a touch of dark fruit before pulling back into a crisp lager structure. It feels substantial in the glass, but it never drags, which makes it stronger and more versatile than it first appears.",
    availability: "seasonal",
    ...buildBeerMedia("menotomator", "/beer/menotomator.png", "Menotomator beer can and glass"),
    tags: ["malty", "smooth", "roasty", "juicy"],
    packaging: ["draft", "cans"],
  },
  {
    id: "time-only-goes",
    name: "Time Only Goes",
    style: "Double IPA",
    abv: 8.6,
    ibu: 58,
    shortDescription:
      "West-coast style, with pine, resin, and citrus rind balanced by firm bitterness.",
    longDescription:
      "Time Only Goes takes a more pointed approach to hop character. Pine, resin, and citrus peel drive the aroma and the first sip, while the bitterness stays firm enough to keep the beer sharp all the way through. Even with the higher ABV, it stays focused and dry, built more for structure and snap than for softness.",
    availability: "rotating",
    ...buildBeerMedia("time-only-goes", "/beer/time_only_goes.png", "Time Only Goes beer can and glass"),
    tags: ["citrus", "resin", "dry", "hazy"],
    packaging: ["draft", "cans"],
  },
  {
    id: "bike-path",
    name: "Bike Path",
    style: "Special Release",
    abv: 0,
    shortDescription:
      "A limited-release beer now added to the catalog from the latest label set.",
    longDescription:
      "Bike Path is currently shown with its updated artwork while the final release details are still being filled in. For now it lives in the rotating set, ready for a proper style note, ABV, and tasting description once those production details are finalized.",
    availability: "rotating",
    ...buildBeerMedia("bike-path", "/beer/bike_path.png", "Bike Path beer artwork"),
    tags: ["crisp", "fresh", "limited"],
    packaging: ["draft"],
  },
  {
    id: "jedermann",
    name: "Jedermann",
    style: "Special Release",
    abv: 0,
    shortDescription:
      "A limited-release beer now added to the catalog from the latest label set.",
    longDescription:
      "Jedermann is in the catalog so the label system and product pages stay in sync with the artwork set. The detailed beer specs still need to be finalized, but the page structure is ready for them now, including gallery, metadata, and related beer recommendations.",
    availability: "rotating",
    ...buildBeerMedia("jedermann", "/beer/jedermann.png", "Jedermann beer artwork"),
    tags: ["malty", "balanced", "limited"],
    packaging: ["draft"],
  },
  {
    id: "marleys-ghost",
    name: "Marley's Ghost",
    style: "Special Release",
    abv: 0,
    shortDescription:
      "A limited-release beer now added to the catalog from the latest label set.",
    longDescription:
      "Marley's Ghost is included as part of the expanded beer lineup so the detail page system covers the full artwork folder. The visual presentation is in place, and the content model is ready for final tasting notes and release data when you have them.",
    availability: "rotating",
    ...buildBeerMedia("marleys-ghost", "/beer/marleys_ghost.png", "Marley's Ghost beer artwork"),
    tags: ["dark", "bold", "limited"],
    packaging: ["draft"],
  },
  {
    id: "money-comes-and-goes",
    name: "Money Comes and Goes",
    style: "Special Release",
    abv: 0,
    shortDescription:
      "A limited-release beer now added to the catalog from the latest label set.",
    longDescription:
      "Money Comes and Goes is set up as a full beer entry so it can participate in the new detail page design and the related-beers scroller. The current copy is intentionally neutral until you have the final style, ABV, and release notes ready to drop in.",
    availability: "rotating",
    ...buildBeerMedia("money-comes-and-goes", "/beer/money_comes_and_goes.png", "Money Comes and Goes beer artwork"),
    tags: ["hoppy", "bold", "limited"],
    packaging: ["draft"],
  },
  {
    id: "my-new-gf",
    name: "My New GF",
    style: "Special Release",
    abv: 0,
    shortDescription:
      "A limited-release beer now added to the catalog from the latest label set.",
    longDescription:
      "My New GF has been added so the beer grid and the new product detail view stay aligned with the artwork you already have. The page is structurally complete, and the long-form copy can be replaced with the final description once you settle the release details.",
    availability: "rotating",
    ...buildBeerMedia("my-new-gf", "/beer/my_new_gf.png", "My New GF beer artwork"),
    tags: ["juicy", "soft", "limited"],
    packaging: ["draft"],
  },
  {
    id: "presita",
    name: "Presita",
    style: "Special Release",
    abv: 0,
    shortDescription:
      "A limited-release beer now added to the catalog from the latest label set.",
    longDescription:
      "Presita is now represented with the same product-page treatment as the rest of the catalog. That gives you a consistent route, full-bleed image treatment, and recommendation section now, while leaving room to swap in finished production notes later.",
    availability: "rotating",
    ...buildBeerMedia("presita", "/beer/presita.png", "Presita beer artwork"),
    tags: ["fruity", "bright", "limited"],
    packaging: ["draft"],
  },
  {
    id: "spy-p-a",
    name: "Spy-P-A",
    style: "Special Release",
    abv: 0,
    shortDescription:
      "A limited-release beer now added to the catalog from the latest label set.",
    longDescription:
      "Spy-P-A is configured as a full beer entry with the same image-forward layout as the rest of the line. Once the final tasting notes are in hand, the placeholder long description can be replaced without changing the page structure or route.",
    availability: "rotating",
    ...buildBeerMedia("spy-p-a", "/beer/spy_p_a.png", "Spy-P-A beer artwork"),
    tags: ["hoppy", "dry", "limited"],
    packaging: ["draft"],
  },
  {
    id: "stave-450",
    name: "Stave 450",
    style: "Special Release",
    abv: 0,
    shortDescription:
      "A limited-release beer now added to the catalog from the latest label set.",
    longDescription:
      "Stave 450 now has a proper beer detail route and visual system, even though the beer specs are still provisional. That gives you a stable design target for photography, copy, and release data instead of waiting on the data model later.",
    availability: "rotating",
    ...buildBeerMedia("stave-450", "/beer/stave_450.png", "Stave 450 beer artwork"),
    tags: ["oak", "complex", "limited"],
    packaging: ["draft"],
  },
  {
    id: "trafford-ale",
    name: "Trafford Ale",
    style: "Special Release",
    abv: 0,
    shortDescription:
      "A limited-release beer now added to the catalog from the latest label set.",
    longDescription:
      "Trafford Ale is present as a full product page so the beer archive can scale cleanly with the label assets you already have. The design now supports gallery images, supporting metadata, and related-beer browsing in a way that feels consistent with the rest of the site.",
    availability: "rotating",
    ...buildBeerMedia("trafford-ale", "/beer/trafford_ale.png", "Trafford Ale beer artwork"),
    tags: ["classic", "balanced", "limited"],
    packaging: ["draft"],
  },
  {
    id: "walter",
    name: "Walter",
    style: "Special Release",
    abv: 0,
    shortDescription:
      "A limited-release beer now added to the catalog from the latest label set.",
    longDescription:
      "Walter has been added to the detail-page system so it behaves like the rest of the catalog instead of sitting as an orphaned asset in the image folder. The framework is in place now for real production notes, availability, and packaging updates later.",
    availability: "rotating",
    ...buildBeerMedia("walter", "/beer/walter.png", "Walter beer artwork"),
    tags: ["smooth", "malty", "limited"],
    packaging: ["draft"],
  },
]

export function getBeerById(id: string) {
  return mockBeers.find((beer) => beer.id === id)
}

export function getRelatedBeers(currentId: string, count = 6) {
  return mockBeers.filter((beer) => beer.id !== currentId).slice(0, count)
}
