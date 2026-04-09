import { defineType, defineField } from 'sanity'
import { homeAnnouncement } from './homeAnnouncement'

export const schemaTypes = [
  defineType({
    name: 'beer',
    title: 'Beer',
    type: 'document',
    fields: [
      defineField({
        name: 'title',
        title: 'Beer Name',
        type: 'string',
      }),
      defineField({
        name: 'abv',
        title: 'ABV (%)',
        type: 'number',
      }),
      defineField({
        name: 'description',
        title: 'Description',
        type: 'text',
      }),
    ],
  }),
  homeAnnouncement,
]
