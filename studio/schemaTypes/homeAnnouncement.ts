import { defineField, defineType } from "sanity"

export const homeAnnouncement = defineType({
  name: "homeAnnouncement",
  title: "Home Announcement",
  type: "document",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: "ctaLabel",
      title: "Button Label",
      type: "string",
      initialValue: "Learn more",
      validation: (Rule) => Rule.required().max(24),
    }),
    defineField({
      name: "ctaHref",
      title: "Button Link",
      type: "string",
      initialValue: "/visit",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Background Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "placement",
      title: "Placement",
      type: "string",
      options: {
        list: [
          { title: "Mobile", value: "mobile" },
          { title: "Desktop", value: "desktop" },
          { title: "Both", value: "both" },
        ],
        layout: "radio",
      },
      initialValue: "mobile",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      description: "Controls the order this item appears on the site. Lower numbers appear first.",
      initialValue: 0,
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
  ],
})
