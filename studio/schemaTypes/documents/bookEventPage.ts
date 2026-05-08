import {defineField, defineType} from 'sanity'

export const bookEventPage = defineType({
  name: 'bookEventPage',
  title: 'Book an Event Page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'content',
      description: 'Main headline for the Book an Event page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'introCopy',
      title: 'Intro Copy',
      type: 'richText',
      group: 'content',
      description: 'Opening copy that explains the event booking offering.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'serviceBullets',
      title: 'Service Bullets / Inclusions',
      type: 'array',
      group: 'content',
      description: 'List the services, perks, or inclusions that should appear as bullets.',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'explanatoryParagraphs',
      title: 'Explanatory Paragraphs',
      type: 'richText',
      group: 'content',
      description: 'Optional longer copy explaining how bookings work.',
    }),
    defineField({
      name: 'ctaLinks',
      title: 'CTA Links',
      type: 'array',
      group: 'content',
      description: 'Add the booking-related links that should appear as buttons or text links.',
      of: [{type: 'ctaLink'}],
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
      headline: 'headline',
    },
    prepare({headline}) {
      return {
        title: headline || 'Book an Event Page',
      }
    },
  },
})
