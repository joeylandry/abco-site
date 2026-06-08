import {createElement} from 'react'
import {defineField, defineType, type ArrayOfPrimitivesInputProps, type ValidationContext} from 'sanity'
import {
  beerAttributeGroups,
  beerAvailabilityOptions,
  beerPackagingOptions,
  bodyAndFeelOptions,
  type BeerAttributeGroupKey,
  hopCharacterOptions,
  maltCharacterOptions,
  overallProfileOptions,
  yeastFermentationOptions,
} from '../shared/beerAttributes'
import {BeerAttributeChecklistInput} from '../components/beerAttributeChecklistInput'

function createBeerAttributeInput(field: (typeof beerAttributeGroups)[number]) {
  return function BeerAttributeInput(props: ArrayOfPrimitivesInputProps) {
    return createElement(BeerAttributeChecklistInput, {
      ...(props as ArrayOfPrimitivesInputProps<string>),
      groupKey: field.key as BeerAttributeGroupKey,
      groupTitle: field.title,
      defaultOptions: field.options,
    })
  }
}

const beerAttributeFields = beerAttributeGroups.map((field) =>
  defineField({
    name: field.key,
    title: field.title,
    type: 'array',
    of: [{type: 'string'}],
    description: field.description,
    components: {
      input: createBeerAttributeInput(field),
    },
    validation: (Rule) => Rule.custom(validateUniqueStrings),
  }),
)

const legacyBeerAttributeFields = [
  defineField({
    name: 'maltCharacter',
    title: 'Legacy Malt Character',
    type: 'array',
    of: [{type: 'string'}],
    hidden: true,
    deprecated: {
      reason: 'Use Attributes -> Malt Character instead.',
    },
    options: {
      list: maltCharacterOptions,
      layout: 'checkbox' as unknown as 'list',
    },
  }),
  defineField({
    name: 'hopCharacter',
    title: 'Legacy Hop Character',
    type: 'array',
    of: [{type: 'string'}],
    hidden: true,
    deprecated: {
      reason: 'Use Attributes -> Hop Character instead.',
    },
    options: {
      list: hopCharacterOptions,
      layout: 'checkbox' as unknown as 'list',
    },
  }),
  defineField({
    name: 'yeastAndFermentation',
    title: 'Legacy Yeast and Fermentation',
    type: 'array',
    of: [{type: 'string'}],
    hidden: true,
    deprecated: {
      reason: 'Use Attributes -> Yeast and Fermentation instead.',
    },
    options: {
      list: yeastFermentationOptions,
      layout: 'checkbox' as unknown as 'list',
    },
  }),
  defineField({
    name: 'bodyAndFeel',
    title: 'Legacy Body and Feel',
    type: 'array',
    of: [{type: 'string'}],
    hidden: true,
    deprecated: {
      reason: 'Use Attributes -> Body and Feel instead.',
    },
    options: {
      list: bodyAndFeelOptions,
      layout: 'checkbox' as unknown as 'list',
    },
  }),
  defineField({
    name: 'overallProfile',
    title: 'Legacy Overall Profile',
    type: 'array',
    of: [{type: 'string'}],
    hidden: true,
    deprecated: {
      reason: 'Use Attributes -> Overall Profile instead.',
    },
    options: {
      list: overallProfileOptions,
      layout: 'checkbox' as unknown as 'list',
    },
  }),
]

const validateUniqueStrings = (value: unknown) => {
  if (!Array.isArray(value)) {
    return true
  }

  const normalizedValues = value.filter((item): item is string => typeof item === 'string')

  return new Set(normalizedValues).size === normalizedValues.length || 'Selections must be unique.'
}

const validateUniqueReferences = (value: unknown) => {
  if (!Array.isArray(value)) {
    return true
  }

  const referenceIds = value
    .map((item) => (typeof item === 'object' && item !== null ? (item as {_ref?: string})._ref : undefined))
    .filter((ref): ref is string => Boolean(ref))

  return new Set(referenceIds).size === referenceIds.length || 'Related beers must be unique.'
}

function checkboxField(
  name: string,
  title: string,
  options: Array<{title: string; value: string}>,
  description?: string,
  required = false,
) {
  return defineField({
    name,
    title,
    type: 'array',
    of: [{type: 'string'}],
    description,
    options: {
      list: options,
      layout: 'checkbox' as unknown as 'list',
    },
    validation: (Rule) => {
      const baseRule = required ? Rule.required().min(1) : Rule
      return baseRule.custom(validateUniqueStrings)
    },
  })
}

const validateBeerImageUploads = (value: unknown, context: ValidationContext) => {
  const document = context.document as
    | {
        primaryImage?: unknown
        cardImage?: unknown
        image?: unknown
      }
    | undefined
  const hasLegacyImage = Boolean(document?.primaryImage || document?.cardImage || document?.image)

  if (!Array.isArray(value) || value.length === 0) {
    return hasLegacyImage ? true : 'Add a main desktop image before publishing.'
  }

  const counts = value.reduce(
    (acc, item) => {
      if (typeof item !== 'object' || item === null) {
        return acc
      }

      const imageType = (item as {imageType?: string}).imageType
      if (imageType === 'mainDesktop') {
        acc.mainDesktop += 1
      }
      if (imageType === 'desktopHoverMobile') {
        acc.desktopHoverMobile += 1
      }

      return acc
    },
    {mainDesktop: 0, desktopHoverMobile: 0},
  )

  if (counts.mainDesktop === 0) {
    return hasLegacyImage ? true : 'Add a main desktop image before publishing.'
  }

  if (counts.mainDesktop > 1) {
    return 'Only one image can be marked as the main desktop image.'
  }

  if (counts.desktopHoverMobile > 1) {
    return 'Only one image can be marked as the desktop hover / main mobile image.'
  }

  return true
}

export const beer = defineType({
  name: 'beer',
  title: 'Beer',
  type: 'document',
  groups: [
    {name: 'core', title: 'Core', default: true},
    {name: 'taste', title: 'Taste'},
    {name: 'photos', title: 'Photos'},
    {name: 'marketing', title: 'Marketing'},
    {name: 'seo', title: 'SEO'},
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
      title: 'Beer Name',
      type: 'string',
      group: 'core',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Legacy Beer Name',
      type: 'string',
      group: 'core',
      hidden: true,
      deprecated: {
        reason: 'Legacy field preserved for existing beer documents. Use Beer Name instead.',
      },
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'core',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      group: 'core',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'abv',
      title: 'ABV (%)',
      type: 'number',
      group: 'core',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'ibu',
      title: 'IBU',
      type: 'number',
      group: 'core',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      group: 'core',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'longDescription',
      title: 'Long Description',
      type: 'text',
      rows: 6,
      group: 'core',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Legacy Description',
      type: 'text',
      rows: 4,
      group: 'core',
      hidden: true,
      deprecated: {
        reason: 'Legacy field preserved for existing beer documents. Use Short Description and Long Description instead.',
      },
    }),
    checkboxField(
      'availability',
      'Availability',
      beerAvailabilityOptions,
      'Select every availability window that applies. This is a checkbox list, not a single choice.',
      true,
    ),
    checkboxField(
      'packaging',
      'Packaging',
      beerPackagingOptions,
      'Select every package format this beer is sold in. Multiple checkboxes can be selected.',
      true,
    ),
    defineField({
      name: 'attributes',
      title: 'Attributes',
      type: 'object',
      group: 'taste',
      description:
        'Grouped beer attribute checkboxes that describe appearance, flavor, and body. Existing saved values stay intact.',
      fields: [...beerAttributeFields],
    }),
    ...legacyBeerAttributeFields,
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      group: 'core',
      initialValue: true,
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      group: 'core',
      description: 'Controls the order this item appears on the site. Lower numbers appear first.',
      initialValue: 0,
    }),

    defineField({
      name: 'cardColor',
      title: 'Card Color',
      type: 'string',
      group: 'photos',
      description: 'Use a 6-digit hex color, for example #1f2937.',
      initialValue: '#FFFFFF',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (value == null || value === '') {
            return true
          }

          if (typeof value !== 'string') {
            return 'Use a 6-digit hex color like #1f2937.'
          }

          return /^#([0-9a-fA-F]{6})$/.test(value)
            ? true
            : 'Use a 6-digit hex color like #1f2937.'
        }),
    }),
    defineField({
      name: 'primaryImage',
      title: 'Primary / Card Image',
      type: 'beerLegacyImageWithAlt',
      group: 'photos',
      hidden: true,
      deprecated: {
        reason: 'Use Beer Can Clipart and Beer Images instead.',
      },
    }),
    defineField({
      name: 'cardImage',
      title: 'Main Beer Card Image / Can Image',
      type: 'beerLegacyImageWithAlt',
      group: 'photos',
      hidden: true,
      deprecated: {
        reason: 'Use Beer Can Clipart and Beer Images instead.',
      },
    }),
    defineField({
      name: 'hoverImage',
      title: 'Hover Image / Main Mobile Image',
      type: 'beerLegacyImageWithAlt',
      group: 'photos',
      hidden: true,
      deprecated: {
        reason: 'Use Beer Images instead.',
      },
    }),
    defineField({
      name: 'galleryImage',
      title: 'Gallery Image',
      type: 'beerLegacyImageWithAlt',
      group: 'photos',
      hidden: true,
      deprecated: {
        reason: 'Use Beer Images instead.',
      },
    }),
    defineField({
      name: 'beerCanClipart',
      title: 'Beer Can Clipart',
      type: 'image',
      group: 'photos',
      description: 'Optional single beer can clipart image.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'beerImages',
      title: 'Beer Images',
      type: 'array',
      group: 'photos',
      description:
        'Upload up to 10 images. Mark one as the main desktop image, one as the desktop hover / main mobile image, and use gallery images for the rest.',
      of: [{type: 'beerImageUpload'}],
      validation: (Rule) => Rule.max(10).custom(validateBeerImageUploads),
    }),
    defineField({
      name: 'galleryImages',
      title: 'Legacy Gallery / Detail Images',
      type: 'array',
      group: 'photos',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
            defineField({
              name: 'active',
              title: 'Active',
              type: 'boolean',
              initialValue: true,
            }),
          ],
        },
      ],
      hidden: true,
      deprecated: {
        reason: 'Use Beer Images instead.',
      },
    }),
    defineField({
      name: 'image',
      title: 'Legacy Primary Image',
      type: 'beerLegacyImageWithAlt',
      group: 'photos',
      hidden: true,
      deprecated: {
        reason: 'Legacy field preserved for existing beer documents. Use Primary / Card Image instead.',
      },
    }),
    defineField({
      name: 'secondaryImage',
      title: 'Secondary Hover / Mobile Image',
      type: 'beerLegacyImageWithAlt',
      group: 'photos',
      hidden: true,
      deprecated: {
        reason: 'Use Beer Images instead.',
      },
    }),
    defineField({
      name: 'detailImages',
      title: 'Legacy Detail Images',
      type: 'array',
      group: 'photos',
      of: [{type: 'beerLegacyImageWithAlt'}],
      hidden: true,
      deprecated: {
        reason: 'Legacy field preserved for existing beer documents. Use Gallery / Detail Images instead.',
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'marketing',
      initialValue: false,
    }),
    defineField({
      name: 'newRelease',
      title: 'New Release',
      type: 'boolean',
      group: 'marketing',
      initialValue: false,
    }),
    defineField({
      name: 'bestSeller',
      title: 'Best Seller',
      type: 'boolean',
      group: 'marketing',
      initialValue: false,
    }),
    defineField({
      name: 'limitedRelease',
      title: 'Limited Release',
      type: 'boolean',
      group: 'marketing',
      initialValue: false,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'marketing',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      validation: (Rule) => Rule.custom(validateUniqueStrings),
    }),
    defineField({
      name: 'relatedBeers',
      title: 'Manual Related Beers',
      type: 'array',
      group: 'marketing',
      of: [{type: 'reference', to: [{type: 'beer'}]}],
      validation: (Rule) => Rule.custom(validateUniqueReferences),
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
      style: 'style',
      abv: 'abv',
      active: 'active',
      featured: 'featured',
      newRelease: 'newRelease',
      bestSeller: 'bestSeller',
      limitedRelease: 'limitedRelease',
      slug: 'slug.current',
      beerCanClipart: 'beerCanClipart',
      beerImages: 'beerImages',
      cardImage: 'cardImage',
      primaryImage: 'primaryImage',
    },
    prepare({
      title,
      style,
      abv,
      active,
      featured,
      newRelease,
      bestSeller,
      limitedRelease,
      slug,
      beerCanClipart,
      beerImages,
      cardImage,
      primaryImage,
    }) {
      const selectedPreviewImage = Array.isArray(beerImages)
        ? beerImages.find((item) => item?.imageType === 'mainDesktop')?.image ??
          beerImages.find((item) => item?.imageType === 'desktopHoverMobile')?.image ??
          beerImages.find((item) => item?.imageType === 'gallery')?.image
        : null

      const flags = [
        featured ? 'Featured' : null,
        newRelease ? 'New Release' : null,
        bestSeller ? 'Best Seller' : null,
        limitedRelease ? 'Limited Release' : null,
        active === false ? 'Inactive' : null,
      ].filter((value): value is string => value !== null)

      return {
        title: title ?? 'Untitled beer',
        subtitle: [
          style,
          typeof abv === 'number' ? `${abv}% ABV` : null,
          slug ? `/${slug}` : null,
          flags.length ? flags.join(' · ') : null,
        ]
          .filter((value): value is string => value !== null && value !== '')
          .join(' · '),
        media: selectedPreviewImage ?? beerCanClipart ?? cardImage ?? primaryImage,
      }
    },
  },
})
