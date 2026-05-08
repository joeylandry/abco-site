import {defineField, defineType} from 'sanity'

export const jobsPage = defineType({
  name: 'jobsPage',
  title: 'Jobs Page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'introCopy',
      title: 'Intro Copy',
      type: 'richText',
      group: 'content',
      description: 'Intro copy shown above the available roles.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'generalPageContent',
      title: 'General Page Content',
      type: 'richText',
      group: 'content',
      description: 'General copy for the jobs page, such as hiring process details or a careers note.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Jobs Page',
      }
    },
  },
})
