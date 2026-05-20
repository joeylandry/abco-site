import {defineField, defineType} from 'sanity'

export const navItem = defineType({
  name: 'navItem',
  title: 'Navigation Item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Controls the order this item appears on the site. Lower numbers appear first.',
      initialValue: 0,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      label: 'label',
      href: 'href',
      active: 'active',
    },
    prepare({label, href, active}) {
      return {
        title: label || 'Navigation Item',
        subtitle: `${href || 'No link set'}${active === false ? ' • inactive' : ''}`,
      }
    },
  },
})
