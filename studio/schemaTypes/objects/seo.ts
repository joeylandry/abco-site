import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Title shown in browser tabs and search results.',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Short search-engine summary of the page.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'string',
      description: 'Preferred absolute URL for this page, if one should be declared.',
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      type: 'boolean',
      description: 'Turn this on to ask search engines not to index the page.',
      initialValue: false,
    }),
    defineField({
      name: 'shareImage',
      title: 'Share Image',
      type: 'imageWithAlt',
      description: 'Image used when the page is shared to social platforms.',
    }),
  ],
})
