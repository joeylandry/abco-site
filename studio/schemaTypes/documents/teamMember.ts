import {defineField, defineType} from 'sanity'

const isHexColor = (value: unknown) =>
  typeof value === 'string' && /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value)

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
    {name: 'seo', title: 'SEO'},
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrderAsc',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
    {
      title: 'Name',
      name: 'nameAsc',
      by: [{field: 'name', direction: 'asc'}],
    },
  ],
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortTitle',
      title: 'Short Title',
      type: 'string',
      group: 'content',
      description: "Optional shorter version of the person's title for compact layouts.",
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'richText',
      group: 'content',
      description: 'Longer biography or background note for the team member page.',
    }),
    defineField({
      name: 'headshot',
      title: 'Headshot',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent / Theme Color',
      type: 'string',
      group: 'content',
      description: "Hex color used as a visual accent for this team member's cards.",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) {
            return true
          }

          return isHexColor(value) ? true : 'Enter a valid hex color, such as #123ABC.'
        }),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      group: 'content',
      initialValue: 0,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      group: 'content',
      initialValue: true,
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
      name: 'name',
      title: 'title',
      active: 'active',
    },
    prepare({name, title, active}) {
      return {
        title: name || 'Team Member',
        subtitle: `${title || 'No title'}${active === false ? ' • inactive' : ''}`,
      }
    },
  },
})
