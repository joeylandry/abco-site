import {defineField, defineType} from 'sanity'
import {sectionToggleFields} from './homePageSectionHelpers'

export const missionBlock = defineType({
  name: 'missionBlock',
  title: 'Mission Block',
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
      type: 'richText',
      description: 'Use this section for the brewery mission statement or brand story.',
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
        title: heading || 'Mission Block',
        subtitle: enabled === false ? 'Disabled' : 'Enabled',
      }
    },
  },
})
