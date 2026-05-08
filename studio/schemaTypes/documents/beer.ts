import {defineField, defineType} from 'sanity'

const availabilityOptions = [
  {title: 'Year-round', value: 'yearRound'},
  {title: 'Seasonal', value: 'seasonal'},
  {title: 'Rotating / Limited', value: 'rotating'},
]

const packagingOptions = [
  {title: 'Draft', value: 'draft'},
  {title: 'Cans', value: 'cans'},
  {title: 'Bottles', value: 'bottles'},
  {title: 'Crowlers', value: 'crowlers'},
]

const appearanceOptions = [
  {title: 'Hazy', value: 'hazy'},
  {title: 'Clear', value: 'clear'},
  {title: 'Dark', value: 'dark'},
  {title: 'Golden', value: 'golden'},
  {title: 'Amber', value: 'amber'},
  {title: 'Ruby', value: 'ruby'},
]

const maltCharacterOptions = [
  {title: 'Malty', value: 'malty'},
  {title: 'Rich', value: 'rich'},
  {title: 'Roasty', value: 'roasty'},
  {title: 'Toasty', value: 'toasty'},
  {title: 'Caramel', value: 'caramel'},
  {title: 'Chocolate', value: 'chocolate'},
  {title: 'Coffee', value: 'coffee'},
  {title: 'Biscuity', value: 'biscuity'},
  {title: 'Bready', value: 'bready'},
  {title: 'Smoky', value: 'smoky'},
  {title: 'Vanilla', value: 'vanilla'},
  {title: 'Barrel-Aged', value: 'barrelAged'},
]

const hopCharacterOptions = [
  {title: 'Piney', value: 'piney'},
  {title: 'Resinous', value: 'resinous'},
  {title: 'Floral', value: 'floral'},
  {title: 'Earthy', value: 'earthy'},
  {title: 'Herbal', value: 'herbal'},
  {title: 'Tropical', value: 'tropical'},
  {title: 'Citrusy', value: 'citrusy'},
  {title: 'Stone Fruit', value: 'stoneFruit'},
  {title: 'Berry', value: 'berry'},
]

const yeastFermentationOptions = [
  {title: 'Crisp', value: 'crisp'},
  {title: 'Clean', value: 'clean'},
  {title: 'Funky', value: 'funky'},
  {title: 'Spicy', value: 'spicy'},
  {title: 'Fruity', value: 'fruity'},
  {title: 'Belgian', value: 'belgian'},
  {title: 'Sour', value: 'sour'},
  {title: 'Tart', value: 'tart'},
  {title: 'Juicy', value: 'juicy'},
  {title: 'Clove', value: 'clove'},
  {title: 'Banana', value: 'banana'},
]

const bodyAndFeelOptions = [
  {title: 'Light-bodied', value: 'lightBodied'},
  {title: 'Medium-Bodied', value: 'mediumBodied'},
  {title: 'Full-bodied', value: 'fullBodied'},
  {title: 'Smooth', value: 'smooth'},
  {title: 'Creamy', value: 'creamy'},
  {title: 'Dry', value: 'dry'},
  {title: 'Effervescent', value: 'effervescent'},
]

const overallProfileOptions = [
  {title: 'Balanced', value: 'balanced'},
  {title: 'Complex', value: 'complex'},
  {title: 'Refreshing', value: 'refreshing'},
  {title: 'Bold', value: 'bold'},
  {title: 'Easy-drinking', value: 'easyDrinking'},
]

const attributeFieldGroups = [
  {
    name: 'appearance',
    title: 'Appearance',
    description: 'Select every visual trait that applies.',
    options: appearanceOptions,
  },
  {
    name: 'maltCharacter',
    title: 'Malt Character',
    description: 'Use checkboxes to capture every malt note that fits.',
    options: maltCharacterOptions,
  },
  {
    name: 'hopCharacter',
    title: 'Hop Character',
    description: 'Select all hop notes that show up in the beer.',
    options: hopCharacterOptions,
  },
  {
    name: 'yeastAndFermentation',
    title: 'Yeast and Fermentation',
    description: 'Choose every fermentation character that applies.',
    options: yeastFermentationOptions,
  },
  {
    name: 'bodyAndFeel',
    title: 'Body and Feel',
    description: 'Pick all body and mouthfeel traits that describe the beer.',
    options: bodyAndFeelOptions,
  },
  {
    name: 'overallProfile',
    title: 'Overall Profile',
    description: "Use these checkboxes for the beer's broad personality.",
    options: overallProfileOptions,
  },
] as const

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
      layout: 'checkbox' as any,
    },
    validation: (Rule) => {
      const baseRule = required ? Rule.required().min(1) : Rule
      return baseRule.custom(validateUniqueStrings)
    },
  })
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
    checkboxField(
      'availability',
      'Availability',
      availabilityOptions,
      'Select every availability window that applies. This is a checkbox list, not a single choice.',
      true,
    ),
    checkboxField(
      'packaging',
      'Packaging',
      packagingOptions,
      'Select every package format this beer is sold in. Multiple checkboxes can be selected.',
      true,
    ),
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
      initialValue: 0,
      validation: (Rule) => Rule.required().integer(),
    }),

    ...attributeFieldGroups.map((field) =>
      checkboxField(
        field.name,
        field.title,
        field.options as Array<{title: string; value: string}>,
        field.description,
      ),
    ),

    defineField({
      name: 'cardColor',
      title: 'Card Color',
      type: 'string',
      group: 'photos',
      description: 'Use a 6-digit hex color, for example #1f2937.',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (typeof value !== 'string') {
            return 'Card color is required.'
          }

          return /^#([0-9a-fA-F]{6})$/.test(value)
            ? true
            : 'Use a 6-digit hex color like #1f2937.'
        }),
    }),
    defineField({
      name: 'primaryImage',
      title: 'Primary / Card Image',
      type: 'imageWithAlt',
      group: 'photos',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secondaryImage',
      title: 'Secondary Hover / Mobile Image',
      type: 'imageWithAlt',
      group: 'photos',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery / Detail Images',
      type: 'array',
      group: 'photos',
      of: [{type: 'galleryImage'}],
      description: 'Add up to 10 images. Reorder them to control the gallery sequence in the detail view.',
      validation: (Rule) => Rule.max(10),
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
      primaryImage: 'primaryImage.image',
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
      primaryImage,
    }) {
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
        media: primaryImage,
      }
    },
  },
})
