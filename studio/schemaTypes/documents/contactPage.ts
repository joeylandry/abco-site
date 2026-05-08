import {defineField, defineType} from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'newsletter', title: 'Newsletter'},
    {name: 'futureHome', title: 'Future Home'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'content',
      description: 'Main headline shown at the top of the Contact page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'introCopy',
      title: 'Intro Copy',
      type: 'richText',
      group: 'content',
      description: 'Opening copy that introduces the contact page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'communityCopy',
      title: 'Community Copy',
      type: 'richText',
      group: 'content',
      description: 'Copy for community members, fans, and general inquiries.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'wholesaleCopy',
      title: 'Wholesale Copy',
      type: 'richText',
      group: 'content',
      description: 'Copy for wholesale, retail, or distribution inquiries.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'newsletterModalTitle',
      title: 'Newsletter Modal Title',
      type: 'string',
      group: 'newsletter',
      description: 'Title shown in the newsletter signup modal.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'newsletterModalBody',
      title: 'Newsletter Modal Body',
      type: 'richText',
      group: 'newsletter',
      description: 'Body copy shown inside the newsletter signup modal.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'newsletterCtaLabels',
      title: 'Newsletter CTA Labels',
      type: 'array',
      group: 'newsletter',
      description: 'Add the button labels or text snippets used to prompt newsletter signups.',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'futureHomeAddress',
      title: 'Future Home Address',
      type: 'addressBlock',
      group: 'futureHome',
      description: 'Address block for the future home / second location section.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'futureHomeCtaLabel',
      title: 'Future Home CTA Label',
      type: 'string',
      group: 'futureHome',
      description: 'Label for the future home call to action.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'futureHomeCtaHref',
      title: 'Future Home CTA URL',
      type: 'string',
      group: 'futureHome',
      description: 'Full URL for the future home call to action.',
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
    select: {
      headline: 'headline',
    },
    prepare({headline}) {
      return {
        title: headline || 'Contact Page',
      }
    },
  },
})
