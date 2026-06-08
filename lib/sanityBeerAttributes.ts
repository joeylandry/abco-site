import {client} from "@/lib/sanity"
import {
  beerAttributeGroups,
  type BeerAttributeGroupKey,
  type BeerAttributeLibrary,
  normalizeBeerAttributeValue,
} from "@/studio/schemaTypes/shared/beerAttributes"

type SanityBeerAttributeLibraryDoc = Partial<Record<BeerAttributeGroupKey, string[] | null>>

const beerAttributeLibraryQuery = `*[
  _type == "beerAttributeLibrary" &&
  _id == "beerAttributeLibrary"
][0]{
  appearanceSelections,
  maltCharacter,
  hopCharacter,
  yeastAndFermentation,
  bodyAndFeel,
  overallProfile
}`

function normalizeCustomValueList(values: unknown) {
  if (!Array.isArray(values)) {
    return []
  }

  return values
    .map((value) => (typeof value === "string" ? normalizeBeerAttributeValue(value) : ""))
    .filter((value): value is string => value.length > 0)
    .filter((value, index, items) => items.indexOf(value) === index)
}

export async function getBeerAttributeLibrary(): Promise<BeerAttributeLibrary> {
  try {
    const doc = await client.fetch<SanityBeerAttributeLibraryDoc | null>(beerAttributeLibraryQuery)

    return beerAttributeGroups.reduce((acc, group) => {
      const values = normalizeCustomValueList(doc?.[group.key as BeerAttributeGroupKey])
      if (values.length > 0) {
        acc[group.key as BeerAttributeGroupKey] = values
      }

      return acc
    }, {} as BeerAttributeLibrary)
  } catch {
    return {}
  }
}
