import {defineField, defineType} from 'sanity'
import {sectionToggleFields} from './homePageSectionHelpers'

export const customCalloutBlock = defineType({
  name: 'customCalloutBlock',
  title: 'Custom Callout Block',
  type: 'object',
  fields: [
    ...sectionToggleFields,
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    }),
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Label',
      type: 'string',
    }),
    defineField({
      name: 'ctaHref',
      title: 'CTA URL',
      type: 'string',
    }),
    defineField({
      name: 'tone',
      title: 'Tone',
      type: 'string',
      options: {
        list: [
          {title: 'Neutral', value: 'neutral'},
          {title: 'Accent', value: 'accent'},
          {title: 'Inverse', value: 'inverse'},
        ],
        layout: 'radio',
      },
      initialValue: 'neutral',
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      enabled: 'enabled',
    },
    prepare({heading, enabled}) {
      return {
        title: heading || 'Custom Callout',
        subtitle: enabled === false ? 'Disabled' : 'Enabled',
      }
    },
  },
})
