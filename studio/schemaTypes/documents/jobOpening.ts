import {defineField, defineType} from 'sanity'

export const jobOpening = defineType({
  name: 'jobOpening',
  title: 'Job Opening',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'details', title: 'Details'},
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrderAsc',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
    {
      title: 'Title',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'teaser',
      title: 'Teaser',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Short summary used in the jobs listing or teaser card.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'modalHeadline',
      title: 'Modal Headline',
      type: 'string',
      group: 'content',
      description: 'Headline shown in the job details modal.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'modalBody',
      title: 'Modal Body',
      type: 'richText',
      group: 'content',
      description: 'Full job description shown in the modal.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'compensation',
      title: 'Compensation',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'schedule',
      title: 'Schedule',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'details',
      description: 'Open is visible publicly, Paused is hidden from normal emphasis, and Closed is archived.',
      options: {
        list: [
          {title: 'Open', value: 'open'},
          {title: 'Paused', value: 'paused'},
          {title: 'Closed', value: 'closed'},
        ],
        layout: 'radio',
      },
      initialValue: 'open',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bulletHighlights',
      title: 'Bullet Highlights',
      type: 'array',
      group: 'details',
      description: 'Add the most important responsibilities, perks, or requirements as separate bullets.',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      group: 'details',
      description: 'Controls the order this item appears on the site. Lower numbers appear first.',
      initialValue: 0,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      group: 'details',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      active: 'active',
    },
    prepare({title, status, active}) {
      return {
        title: title || 'Job Opening',
        subtitle: `${status || 'open'}${active === false ? ' • inactive' : ''}`,
      }
    },
  },
})
