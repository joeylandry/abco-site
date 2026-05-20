export type BeerAttributeOption = {
  title: string
  value: string
}

export type BeerFilterGroupKey =
  | "availability"
  | "packaging"
  | "appearanceSelections"
  | "maltCharacter"
  | "hopCharacter"
  | "yeastAndFermentation"
  | "bodyAndFeel"
  | "overallProfile"

export type BeerFilterSelections = Partial<Record<BeerFilterGroupKey, string[]>>

export type BeerFilterGroup = {
  key: BeerFilterGroupKey
  title: string
  description: string
  options: readonly BeerAttributeOption[]
}

export const beerAvailabilityOptions: BeerAttributeOption[] = [
  { title: "Year-round", value: "yearRound" },
  { title: "Seasonal", value: "seasonal" },
  { title: "Rotating / Limited", value: "rotating" },
] 

export const beerPackagingOptions: BeerAttributeOption[] = [
  { title: "Draft", value: "draft" },
  { title: "Cans", value: "cans" },
  { title: "Bottles", value: "bottles" },
  { title: "Crowlers", value: "crowlers" },
]

export const appearanceOptions: BeerAttributeOption[] = [
  { title: "Hazy", value: "hazy" },
  { title: "Clear", value: "clear" },
  { title: "Dark", value: "dark" },
  { title: "Golden", value: "golden" },
  { title: "Amber", value: "amber" },
  { title: "Ruby", value: "ruby" },
]

export const maltCharacterOptions: BeerAttributeOption[] = [
  { title: "Malty", value: "malty" },
  { title: "Rich", value: "rich" },
  { title: "Roasty", value: "roasty" },
  { title: "Toasty", value: "toasty" },
  { title: "Caramel", value: "caramel" },
  { title: "Chocolate", value: "chocolate" },
  { title: "Coffee", value: "coffee" },
  { title: "Biscuity", value: "biscuity" },
  { title: "Bready", value: "bready" },
  { title: "Smoky", value: "smoky" },
  { title: "Vanilla", value: "vanilla" },
  { title: "Barrel-Aged", value: "barrelAged" },
]

export const hopCharacterOptions: BeerAttributeOption[] = [
  { title: "Piney", value: "piney" },
  { title: "Resinous", value: "resinous" },
  { title: "Floral", value: "floral" },
  { title: "Earthy", value: "earthy" },
  { title: "Herbal", value: "herbal" },
  { title: "Tropical", value: "tropical" },
  { title: "Citrusy", value: "citrusy" },
  { title: "Stone Fruit", value: "stoneFruit" },
  { title: "Berry", value: "berry" },
]

export const yeastFermentationOptions: BeerAttributeOption[] = [
  { title: "Crisp", value: "crisp" },
  { title: "Clean", value: "clean" },
  { title: "Funky", value: "funky" },
  { title: "Spicy", value: "spicy" },
  { title: "Fruity", value: "fruity" },
  { title: "Belgian", value: "belgian" },
  { title: "Sour", value: "sour" },
  { title: "Tart", value: "tart" },
  { title: "Juicy", value: "juicy" },
  { title: "Clove", value: "clove" },
  { title: "Banana", value: "banana" },
]

export const bodyAndFeelOptions: BeerAttributeOption[] = [
  { title: "Light-bodied", value: "lightBodied" },
  { title: "Medium-Bodied", value: "mediumBodied" },
  { title: "Full-bodied", value: "fullBodied" },
  { title: "Smooth", value: "smooth" },
  { title: "Creamy", value: "creamy" },
  { title: "Dry", value: "dry" },
  { title: "Effervescent", value: "effervescent" },
]

export const overallProfileOptions: BeerAttributeOption[] = [
  { title: "Balanced", value: "balanced" },
  { title: "Complex", value: "complex" },
  { title: "Refreshing", value: "refreshing" },
  { title: "Bold", value: "bold" },
  { title: "Easy-drinking", value: "easyDrinking" },
]

export const beerAttributeGroups: BeerFilterGroup[] = [
  {
    key: "appearanceSelections",
    title: "Appearance",
    description: "Select every appearance trait that applies.",
    options: appearanceOptions,
  },
  {
    key: "maltCharacter",
    title: "Malt Character",
    description: "Use checkboxes to capture every malt note that fits.",
    options: maltCharacterOptions,
  },
  {
    key: "hopCharacter",
    title: "Hop Character",
    description: "Select all hop notes that show up in the beer.",
    options: hopCharacterOptions,
  },
  {
    key: "yeastAndFermentation",
    title: "Yeast and Fermentation",
    description: "Choose every fermentation character that applies.",
    options: yeastFermentationOptions,
  },
  {
    key: "bodyAndFeel",
    title: "Body and Feel",
    description: "Pick all body and mouthfeel traits that describe the beer.",
    options: bodyAndFeelOptions,
  },
  {
    key: "overallProfile",
    title: "Overall Profile",
    description: "Use these checkboxes for the beer's broad personality.",
    options: overallProfileOptions,
  },
] 

export const beerFilterGroups: BeerFilterGroup[] = [
  {
    key: "availability",
    title: "Availability",
    description: "Select every availability window that applies.",
    options: beerAvailabilityOptions,
  },
  {
    key: "packaging",
    title: "Packaging",
    description: "Select every package format this beer is sold in.",
    options: beerPackagingOptions,
  },
  ...beerAttributeGroups,
]

export function createEmptyBeerFilterSelections(): BeerFilterSelections {
  return {
    availability: [],
    packaging: [],
    appearanceSelections: [],
    maltCharacter: [],
    hopCharacter: [],
    yeastAndFermentation: [],
    bodyAndFeel: [],
    overallProfile: [],
  }
}

export function toggleBeerFilterSelection(
  selections: BeerFilterSelections,
  key: BeerFilterGroupKey,
  value: string,
): BeerFilterSelections {
  const currentValues = selections[key] ?? []
  const nextValues = currentValues.includes(value)
    ? currentValues.filter((item) => item !== value)
    : [...currentValues, value]

  return {
    ...selections,
    [key]: nextValues,
  }
}

export function countBeerFilterSelections(selections: BeerFilterSelections) {
  return Object.values(selections).reduce((count, values) => count + (values?.length ?? 0), 0)
}
