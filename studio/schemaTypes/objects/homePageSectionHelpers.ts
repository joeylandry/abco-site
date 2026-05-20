import {defineField} from 'sanity'

export const teaserTypeOptions = [
  {title: 'Featured', value: 'featured'},
  {title: 'New Release', value: 'newRelease'},
  {title: 'Best Seller', value: 'bestSeller'},
  {title: 'Seasonal / Limited', value: 'seasonalLimited'},
  {title: 'Manual Selection', value: 'manualSelection'},
]

export const sectionToggleFields = [
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
    description: 'Controls the order this item appears on the site. Lower numbers appear first.',
    initialValue: 0,
  }),
]

export const imageSetField = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [{type: 'imageWithAlt'}],
    description,
    validation: (Rule) => Rule.required().min(1),
  })
