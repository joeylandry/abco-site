import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {name: 'branding', title: 'Branding', default: true},
    {name: 'footer', title: 'Footer'},
    {name: 'navigation', title: 'Navigation'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      group: 'branding',
      description: 'The name used in the site header, footer, and shared metadata.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO Metadata',
      type: 'seo',
      group: 'seo',
      description: 'Fallback metadata for pages that do not define their own SEO fields.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'footerAddress',
      title: 'Footer Address',
      type: 'addressBlock',
      group: 'footer',
      description: 'The mailing or taproom address shown in the site footer.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'footerMapUrl',
      title: 'Footer Map URL',
      type: 'string',
      group: 'footer',
      description: 'Paste the full map link used by the footer address block.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'footerPhone',
      title: 'Footer Phone',
      type: 'string',
      group: 'footer',
      description: 'The primary phone number shown in the footer contact area.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'footerHoursLines',
      title: 'Footer Hours Lines',
      type: 'array',
      group: 'footer',
      description: 'Enter the footer hours as separate lines in the order they should appear.',
      of: [{type: 'hoursLine'}],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      group: 'footer',
      description: 'Add the social links that should appear in the footer.',
      of: [{type: 'socialLink'}],
    }),
    defineField({
      name: 'footerBottomBarCopy',
      title: 'Footer Bottom Bar Copy',
      type: 'string',
      group: 'footer',
      description: 'Short text that appears in the very bottom footer bar.',
    }),
    defineField({
      name: 'sharedCtas',
      title: 'Shared CTA Labels / URLs',
      type: 'array',
      group: 'branding',
      description: 'Reusable call-to-action labels and URLs used across the site.',
      of: [{type: 'ctaLink'}],
    }),
    defineField({
      name: 'navItems',
      title: 'Navigation Items',
      type: 'array',
      group: 'navigation',
      description: 'Top-level navigation links shown in the header and mobile menu.',
      of: [{type: 'navItem'}],
    }),
  ],
  preview: {
    select: {
      brandName: 'brandName',
    },
    prepare({brandName}) {
      return {
        title: brandName || 'Site Settings',
      }
    },
  },
})
