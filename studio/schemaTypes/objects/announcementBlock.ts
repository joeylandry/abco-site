import {defineField, defineType} from 'sanity'
import {sectionToggleFields} from './homePageSectionHelpers'

export const announcementBlock = defineType({
  name: 'announcementBlock',
  title: 'Announcement Block',
  type: 'object',
  fields: [
    ...sectionToggleFields,
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'announcements',
      title: 'Announcement References',
      type: 'array',
      description: 'Select one or more existing announcements to surface in this block.',
      of: [
        {
          type: 'reference',
          to: [{type: 'announcement'}],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      enabled: 'enabled',
    },
    prepare({heading, enabled}) {
      return {
        title: heading || 'Announcement Block',
        subtitle: enabled === false ? 'Disabled' : 'Enabled',
      }
    },
  },
})
