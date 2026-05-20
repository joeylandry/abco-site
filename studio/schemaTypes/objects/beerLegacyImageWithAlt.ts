import {defineField, defineType} from 'sanity'

export const beerLegacyImageWithAlt = defineType({
  name: 'beerLegacyImageWithAlt',
  title: 'Beer Legacy Image with Alt Text',
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
  ],
})
