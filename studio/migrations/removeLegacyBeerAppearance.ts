import {getCliClient} from 'sanity/cli'

type BeerDocument = {
  _id: string
  appearance?: string | string[] | null
  attributes?: {
    appearance?: string | string[] | null
    appearanceSelections?: string[] | null
  } | null
}

function normalizeValues(value: BeerDocument['appearance']) {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    return trimmed ? [trimmed] : []
  }

  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item): item is string => item.length > 0)
}

async function main() {
  const client = getCliClient()
  const beers = await client.fetch<BeerDocument[]>(`*[_type == "beer" && (defined(appearance) || defined(attributes.appearance))]{
    _id,
    appearance,
    attributes
  }`)

  let updatedCount = 0

  for (const beer of beers) {
    const legacyValues = [
      ...normalizeValues(beer.appearance),
      ...normalizeValues(beer.attributes?.appearance),
    ]
    const existingSelections = (beer.attributes?.appearanceSelections ?? []).filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    )
    const nextSelections = Array.from(new Set([...existingSelections, ...legacyValues]))

    const patch = client
      .patch(beer._id)
      .unset(['appearance', 'attributes.appearance'])
      .setIfMissing({attributes: {}})

    if (nextSelections.length > 0) {
      patch.set({'attributes.appearanceSelections': nextSelections})
    }

    await patch.commit({autoGenerateArrayKeys: true})
    updatedCount += 1
  }

  console.log(`Updated ${updatedCount} beer document(s).`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
