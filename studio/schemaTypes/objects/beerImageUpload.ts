import {defineField, defineType} from 'sanity'

const beerImageTypeOptions = [
  {title: 'Main desktop image', value: 'mainDesktop'},
  {title: 'Desktop hover / main mobile image', value: 'desktopHoverMobile'},
  {title: 'Gallery image', value: 'gallery'},
]

export const beerImageUpload = defineType({
  name: 'beerImageUpload',
  title: 'Beer Image Upload',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imageType',
      title: 'Image Type',
      type: 'string',
      description: 'Choose the role this image plays on the site.',
      options: {
        list: beerImageTypeOptions,
        layout: 'radio' as any,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
