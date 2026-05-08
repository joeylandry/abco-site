import {defineField, defineType} from 'sanity'

export const addressBlock = defineType({
  name: 'addressBlock',
  title: 'Address Block',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Location Name',
      type: 'string',
      description: 'Short name for the address, such as taproom or brewery.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'line1',
      title: 'Address Line 1',
      type: 'string',
      description: 'Street address line used for maps and mail.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'line2',
      title: 'Address Line 2',
      type: 'string',
      description: 'Apartment, suite, or other second line details if needed.',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'state',
      title: 'State / Region',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'postalCode',
      title: 'Postal Code',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      initialValue: 'United States',
    }),
  ],
})
