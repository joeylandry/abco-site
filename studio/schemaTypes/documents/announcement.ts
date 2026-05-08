import {defineField, defineType} from 'sanity'

export const announcement = defineType({
  name: 'announcement',
  title: 'Announcement',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
    {name: 'settings', title: 'Settings'},
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrderAsc',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
    {
      title: 'Headline',
      name: 'headlineAsc',
      by: [{field: 'headline', direction: 'asc'}],
    },
  ],
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Short supporting copy shown under the headline.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Label',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaHref',
      title: 'CTA URL',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'placement',
      title: 'Placement',
      type: 'string',
      group: 'settings',
      description: 'Choose whether the announcement shows on mobile, desktop, or both.',
      options: {
        list: [
          {title: 'Mobile', value: 'mobile'},
          {title: 'Desktop', value: 'desktop'},
          {title: 'Both', value: 'both'},
        ],
        layout: 'radio',
      },
      initialValue: 'mobile',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      group: 'settings',
      initialValue: 0,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      group: 'settings',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      headline: 'headline',
      placement: 'placement',
      active: 'active',
    },
    prepare({headline, placement, active}) {
      return {
        title: headline || 'Announcement',
        subtitle: `${placement || 'mobile'}${active === false ? ' • inactive' : ''}`,
      }
    },
  },
})
