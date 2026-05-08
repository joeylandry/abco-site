import {defineField, defineType} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'docuseries', title: 'Docuseries'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'missionHeading',
      title: 'Mission Heading',
      type: 'string',
      group: 'content',
      description: 'The heading for the mission statement section on the About page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'missionBody',
      title: 'Mission Body',
      type: 'richText',
      group: 'content',
      description: 'Main mission copy shown beneath the mission heading.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'teamHeading',
      title: 'Team Heading',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'teamIntroCopy',
      title: 'Team Intro Copy',
      type: 'richText',
      group: 'content',
      description: 'Short intro that appears above the team member cards.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'docuseriesHeading',
      title: 'Docuseries Heading',
      type: 'string',
      group: 'docuseries',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'docuseriesIntroCopy',
      title: 'Docuseries Intro Copy',
      type: 'richText',
      group: 'docuseries',
      description: 'Intro copy for the docuseries section.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'docuseriesMonthlyNote',
      title: 'Docuseries Monthly Note',
      type: 'string',
      group: 'docuseries',
      description: 'Optional note about the monthly release cadence or featured episode.',
    }),
    defineField({
      name: 'docuseriesEpisodes',
      title: 'Docuseries Episodes',
      type: 'array',
      group: 'docuseries',
      description: 'Add each docuseries episode in display order.',
      of: [{type: 'docuseriesEpisode'}],
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
        title: 'About Page',
      }
    },
  },
})
