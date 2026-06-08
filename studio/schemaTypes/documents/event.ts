import {defineField, defineType} from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'details', title: 'Details'},
    {name: 'media', title: 'Media'},
    {name: 'seo', title: 'SEO'},
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrderAsc',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
    {
      title: 'Start Date',
      name: 'startDateDesc',
      by: [{field: 'startDateTime', direction: 'desc'}],
    },
  ],
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Short summary used in cards and listings.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'richText',
      group: 'content',
    }),
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      group: 'details',
      description: 'Internal label for the kind of event, such as live music or private rental.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDateTime',
      title: 'Start Date / Time',
      type: 'datetime',
      group: 'details',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDateTime',
      title: 'End Date / Time',
      type: 'datetime',
      group: 'details',
      validation: (Rule) =>
        Rule.required().custom((value, context) => {
          const parent = context.parent as {startDateTime?: string}

          if (!value || !parent.startDateTime) {
            return true
          }

          return new Date(value).getTime() >= new Date(parent.startDateTime).getTime()
            ? true
            : 'End date and time must be after the start date and time.'
        }),
    }),
    defineField({
      name: 'timezone',
      title: 'Timezone',
      type: 'string',
      group: 'details',
      initialValue: 'America/New_York',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'reference',
      group: 'details',
      to: [{type: 'eventLocation'}],
      description: 'Pick a reusable location or create a new one for this event.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ageRestriction',
      title: 'Age Restriction',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'ticketHref',
      title: 'Ticket URL',
      type: 'string',
      group: 'details',
      description: 'Link to tickets or an external RSVP page, if applicable.',
    }),
    defineField({
      name: 'image',
      title: 'Flyer Image',
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
    }),
    defineField({
      name: 'detailImages',
      title: 'Ordered Detail Images',
      type: 'array',
      group: 'media',
      description: 'Add any extra event images in the exact order they should appear.',
      of: [{type: 'galleryImage'}],
    }),
    defineField({
      name: 'taproomEvent',
      title: 'Taproom Event',
      type: 'boolean',
      group: 'details',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Featured / Spotlight',
      type: 'boolean',
      group: 'details',
      initialValue: false,
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
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'details',
      description:
        'Editorial status for the CMS. The site still classifies events automatically by date and time.',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Archived', value: 'archived'},
        ],
        layout: 'radio',
      },
      initialValue: 'active',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      status: 'status',
      featured: 'featured',
      startDateTime: 'startDateTime',
      locationName: 'location->name',
    },
    prepare({title, status, featured, startDateTime, locationName}) {
      const pieces = [status || 'active']

      if (featured) {
        pieces.push('featured')
      }

      if (startDateTime) {
        pieces.push(new Date(startDateTime).toLocaleDateString())
      }

      return {
        title: title || 'Event',
        subtitle: [locationName || 'No location', pieces.join(' • ')].filter(Boolean).join(' • '),
      }
    },
  },
})
