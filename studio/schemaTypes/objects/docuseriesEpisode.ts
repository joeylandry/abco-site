import {defineField, defineType} from 'sanity'

export const docuseriesEpisode = defineType({
  name: 'docuseriesEpisode',
  title: 'Docuseries Episode',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Short summary or notes about the episode.',
    }),
    defineField({
      name: 'embedUrl',
      title: 'Embed URL',
      type: 'string',
      description: 'Paste the embedded video URL if one is available.',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'string',
      description: 'Use this if the episode should link to a video file or external player.',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {embedUrl?: string; videoUrl?: string}
          return parent.embedUrl || parent.videoUrl ? true : 'Add an embed URL or a video URL.'
        }),
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
      title: 'title',
      active: 'active',
    },
    prepare({title, active}) {
      return {
        title: title || 'Docuseries Episode',
        subtitle: active === false ? 'Inactive' : 'Active',
      }
    },
  },
})
