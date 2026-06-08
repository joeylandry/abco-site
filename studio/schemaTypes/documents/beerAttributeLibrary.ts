import {defineField, defineType} from 'sanity'
import {
  beerAttributeGroups,
  type BeerAttributeGroupKey,
} from '../shared/beerAttributes'

const beerAttributeLibraryFields = beerAttributeGroups.map((group) =>
  defineField({
    name: group.key,
    title: `${group.title} Custom Options`,
    type: 'array',
    of: [{type: 'string'}],
    description: `Reusable manual ${group.title.toLowerCase()} values added from beer edit screens.`,
    validation: (Rule) => Rule.custom(validateUniqueStrings),
  }),
)

function validateUniqueStrings(value: unknown) {
  if (!Array.isArray(value)) {
    return true
  }

  const normalizedValues = value.filter((item): item is string => typeof item === 'string')

  return new Set(normalizedValues).size === normalizedValues.length || 'Options must be unique.'
}

export const beerAttributeLibrary = defineType({
  name: 'beerAttributeLibrary',
  title: 'Beer Attribute Library',
  type: 'document',
  fields: beerAttributeLibraryFields,
  preview: {
    prepare() {
      return {
        title: 'Beer Attribute Library',
        subtitle: 'Reusable custom attribute options for beer checklists',
      }
    },
  },
})

export const emptyBeerAttributeLibrary = beerAttributeGroups.reduce(
  (acc, group) => {
    acc[group.key as BeerAttributeGroupKey] = []
    return acc
  },
  {} as Record<BeerAttributeGroupKey, string[]>,
)
