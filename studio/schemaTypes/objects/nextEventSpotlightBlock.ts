import {defineField, defineType} from 'sanity'
import {sectionToggleFields} from './homePageSectionHelpers'

export const nextEventSpotlightBlock = defineType({
  name: 'nextEventSpotlightBlock',
  title: 'Next Event Spotlight Block',
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
      name: 'event',
      title: 'Event Reference',
      type: 'reference',
      to: [{type: 'event'}],
      description: 'Pick the event that should be highlighted in this section.',
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
        title: heading || 'Next Event Spotlight',
        subtitle: enabled === false ? 'Disabled' : 'Enabled',
      }
    },
  },
})
