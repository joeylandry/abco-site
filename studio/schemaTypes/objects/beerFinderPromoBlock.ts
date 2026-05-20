import {defineField, defineType} from 'sanity'
import {sectionToggleFields} from './homePageSectionHelpers'

export const beerFinderPromoBlock = defineType({
  name: 'beerFinderPromoBlock',
  title: 'Beer Finder Promo Block',
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
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 4,
      description: 'Use this copy for the promo summary shown above the call to action.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaHref',
      title: 'CTA URL',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      enabled: 'enabled',
    },
    prepare({heading, enabled}) {
      return {
        title: heading || 'Beer Finder Promo',
        subtitle: enabled === false ? 'Disabled' : 'Enabled',
      }
    },
  },
})
