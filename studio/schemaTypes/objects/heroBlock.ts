import {defineField, defineType} from 'sanity'
import {imageSetField, sectionToggleFields} from './homePageSectionHelpers'

export const heroBlock = defineType({
  name: 'heroBlock',
  title: 'Hero Block',
  type: 'object',
  fields: [
    ...sectionToggleFields,
    imageSetField('desktopImages', 'Desktop Images', 'Add desktop hero images in the order they should appear.'),
    imageSetField('mobileImages', 'Mobile Images', 'Add mobile hero images in display order.'),
    defineField({
      name: 'primaryCtaLabel',
      title: 'Primary Hero CTA Label',
      type: 'string',
      description: 'Button text for the main homepage hero call to action. Leave blank if no primary CTA is needed.',
    }),
    defineField({
      name: 'primaryCtaHref',
      title: 'Primary Hero CTA URL',
      type: 'string',
      description: 'Destination for the main homepage hero call to action. Leave blank if the hero has no primary CTA.',
    }),
    defineField({
      name: 'secondaryCtaLabel',
      title: 'Secondary Hero CTA Label',
      type: 'string',
      description: 'Optional secondary button text for the homepage hero.',
    }),
    defineField({
      name: 'secondaryCtaHref',
      title: 'Secondary Hero CTA URL',
      type: 'string',
      description: 'Optional destination for the secondary homepage hero button.',
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
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) {
            return true
          }

          return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value) || 'Enter a valid hex color.'
        }),
    }),
  ],
  preview: {
    select: {
      enabled: 'enabled',
    },
    prepare({enabled}) {
      return {
        title: 'Hero Block',
        subtitle: enabled === false ? 'Disabled' : 'Enabled',
      }
    },
  },
})
