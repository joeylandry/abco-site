import {defineField, defineType} from 'sanity'
import {sectionToggleFields, teaserTypeOptions} from './homePageSectionHelpers'

export const beerTeaserBlock = defineType({
  name: 'beerTeaserBlock',
  title: 'Beer Teaser Block',
  type: 'object',
  fields: [
    ...sectionToggleFields,
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'teaserType',
      title: 'Teaser Type',
      type: 'string',
      description: 'Choose how the beer teaser should source beers for this block.',
      options: {
        list: teaserTypeOptions,
        layout: 'radio',
      },
      initialValue: 'featured',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'manualBeerRefs',
      title: 'Manual Beer References',
      type: 'array',
      description: 'Only used when Teaser Type is Manual Selection. Pick the beers in display order.',
      of: [
        {
          type: 'reference',
          to: [{type: 'beer'}],
        },
      ],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {teaserType?: string}
          if (parent.teaserType !== 'manualSelection') {
            return true
          }

          return Array.isArray(value) && value.length > 0
            ? true
            : 'Add at least one beer when using Manual Selection.'
        }),
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      teaserType: 'teaserType',
      enabled: 'enabled',
    },
    prepare({heading, teaserType, enabled}) {
      return {
        title: heading || 'Beer Teaser',
        subtitle: `${teaserType || 'featured'}${enabled === false ? ' • disabled' : ''}`,
      }
    },
  },
})
