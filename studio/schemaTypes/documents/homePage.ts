import {defineField, defineType} from 'sanity'

const teaserTypeOptions = [
  {title: 'Featured', value: 'featured'},
  {title: 'New Release', value: 'newRelease'},
  {title: 'Best Seller', value: 'bestSeller'},
  {title: 'Seasonal / Limited', value: 'seasonalLimited'},
  {title: 'Manual Selection', value: 'manualSelection'},
]

const imageSetField = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [{type: 'imageWithAlt'}],
    description,
    validation: (Rule) => Rule.required().min(1),
  })

const sectionToggleFields = [
  defineField({
    name: 'enabled',
    title: 'Enabled',
    type: 'boolean',
    initialValue: true,
  }),
  defineField({
    name: 'sortOrder',
    title: 'Sort Order',
    type: 'number',
    initialValue: 0,
  }),
]

const heroBlock = defineType({
  name: 'heroBlock',
  title: 'Hero Block',
  type: 'object',
  fields: [
    ...sectionToggleFields,
    imageSetField('desktopImages', 'Desktop Images', 'Add desktop hero images in the order they should appear.'),
    imageSetField('mobileImages', 'Mobile Images', 'Add mobile hero images in display order.'),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'kicker',
      title: 'Kicker',
      type: 'string',
    }),
    defineField({
      name: 'supportingText',
      title: 'Supporting Text',
      type: 'text',
      rows: 3,
      description: 'Optional short paragraph beneath the hero headline.',
    }),
    defineField({
      name: 'primaryCtaLabel',
      title: 'Primary CTA Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryCtaHref',
      title: 'Primary CTA URL',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secondaryCtaLabel',
      title: 'Secondary CTA Label',
      type: 'string',
    }),
    defineField({
      name: 'secondaryCtaHref',
      title: 'Secondary CTA URL',
      type: 'string',
    }),
    defineField({
      name: 'overlayEnabled',
      title: 'Overlay Enabled',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'overlayIntensity',
      title: 'Overlay Intensity',
      type: 'number',
      description: 'Use a value between 0 and 100.',
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'overlayColor',
      title: 'Overlay Color',
      type: 'string',
      initialValue: '#000000',
      validation: (Rule) => Rule.custom((value) => {
        if (!value) {
          return true
        }

        return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value) || 'Enter a valid hex color.'
      }),
    }),
  ],
  preview: {
    select: {
      headline: 'headline',
      enabled: 'enabled',
    },
    prepare({headline, enabled}) {
      return {
        title: headline || 'Hero Block',
        subtitle: enabled === false ? 'Disabled' : 'Enabled',
      }
    },
  },
})

const announcementBlock = defineType({
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

const beerFinderPromoBlock = defineType({
  name: 'beerFinderPromoBlock',
  title: 'Beer Finder Promo Block',
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
      type: 'text',
      rows: 4,
      description: 'Use this copy for the promo summary shown above the call to action.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ctaHref',
      title: 'CTA URL',
      type: 'string',
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
        title: heading || 'Beer Finder Promo',
        subtitle: enabled === false ? 'Disabled' : 'Enabled',
      }
    },
  },
})

const nextEventSpotlightBlock = defineType({
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

const beerTeaserBlock = defineType({
  name: 'beerTeaserBlock',
  title: 'Beer Teaser Block',
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
      name: 'teaserType',
      title: 'Teaser Type',
      type: 'string',
      description: 'Choose how the beer teaser should source beers for this block.',
      options: {
        list: teaserTypeOptions,
        layout: 'radio',
      },
      initialValue: 'featured',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'manualBeerRefs',
      title: 'Manual Beer References',
      type: 'array',
      description: 'Only used when Teaser Type is Manual Selection. Pick the beers in display order.',
      of: [
        {
          type: 'reference',
          to: [{type: 'beer'}],
        },
      ],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {teaserType?: string}
          if (parent.teaserType !== 'manualSelection') {
            return true
          }

          return Array.isArray(value) && value.length > 0
            ? true
            : 'Add at least one beer when using Manual Selection.'
        }),
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      teaserType: 'teaserType',
      enabled: 'enabled',
    },
    prepare({heading, teaserType, enabled}) {
      return {
        title: heading || 'Beer Teaser',
        subtitle: `${teaserType || 'featured'}${enabled === false ? ' • disabled' : ''}`,
      }
    },
  },
})

const missionBlock = defineType({
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

const customCalloutBlock = defineType({
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

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'sections',
      title: 'Section Builder',
      type: 'array',
      group: 'content',
      description: 'Add page sections in the order they should appear on the home page.',
      of: [
        {type: 'heroBlock'},
        {type: 'announcementBlock'},
        {type: 'beerFinderPromoBlock'},
        {type: 'nextEventSpotlightBlock'},
        {type: 'beerTeaserBlock'},
        {type: 'missionBlock'},
        {type: 'customCalloutBlock'},
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Home Page',
      }
    },
  },
})
