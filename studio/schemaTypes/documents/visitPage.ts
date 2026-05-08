import {defineField, defineType} from 'sanity'

export const visitPage = defineType({
  name: 'visitPage',
  title: 'Visit Page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'kicker',
      title: 'Kicker',
      type: 'string',
      group: 'content',
      description: 'Small intro line above the main headline.',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bodyParagraphs',
      title: 'Body Paragraphs',
      type: 'array',
      group: 'content',
      description: 'Add the visit page body as separate paragraphs in reading order.',
      of: [{type: 'text', rows: 4}],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'addressBlock',
      title: 'Address Block',
      type: 'addressBlock',
      group: 'content',
      description: 'The main taproom address and contact location shown on the page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mapCtaLabel',
      title: 'Map CTA Label',
      type: 'string',
      group: 'content',
      description: 'Label for the button or link that opens the map.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mapCtaHref',
      title: 'Map CTA URL',
      type: 'string',
      group: 'content',
      description: 'Full URL for the map link.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'promoAnnouncementText',
      title: 'Promo / Announcement Text',
      type: 'richText',
      group: 'content',
      description: 'Optional highlighted announcement or visit reminder shown near the bottom of the page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'promoImage',
      title: 'Promo Image',
      type: 'image',
      group: 'media',
      description: 'Image shown alongside the visit announcement or promotional text.',
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
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      headline: 'headline',
      kicker: 'kicker',
    },
    prepare({headline, kicker}) {
      return {
        title: headline || 'Visit Page',
        subtitle: kicker || 'Visit content',
      }
    },
  },
})
