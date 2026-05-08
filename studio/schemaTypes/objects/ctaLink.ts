import {defineField, defineType} from 'sanity'

export const ctaLink = defineType({
  name: 'ctaLink',
  title: 'CTA Link',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      label: 'label',
      href: 'href',
    },
    prepare({label, href}) {
      return {
        title: label || 'CTA Link',
        subtitle: href || 'No URL set',
      }
    },
  },
})
