import {defineField, defineType} from 'sanity'
import {announcementBlock} from '../objects/announcementBlock'
import {beerFinderPromoBlock} from '../objects/beerFinderPromoBlock'
import {beerTeaserBlock} from '../objects/beerTeaserBlock'
import {customCalloutBlock} from '../objects/customCalloutBlock'
import {heroBlock} from '../objects/heroBlock'
import {missionBlock} from '../objects/missionBlock'
import {nextEventSpotlightBlock} from '../objects/nextEventSpotlightBlock'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'sections',
      title: 'Section Builder',
      type: 'array',
      group: 'content',
      description: 'Add page sections in the order they should appear on the home page.',
      of: [
        {type: 'heroBlock'},
        {type: 'announcementBlock'},
        {type: 'beerFinderPromoBlock'},
        {type: 'nextEventSpotlightBlock'},
        {type: 'beerTeaserBlock'},
        {type: 'missionBlock'},
        {type: 'customCalloutBlock'},
      ],
      validation: (Rule) => Rule.required().min(1),
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
        title: 'Home Page',
      }
    },
  },
})
