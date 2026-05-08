import {defineField, defineType} from 'sanity'

export const hoursLine = defineType({
  name: 'hoursLine',
  title: 'Hours Line',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hours',
      title: 'Hours',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'closed',
      title: 'Closed',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'string',
    }),
  ],
})
