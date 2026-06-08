import { defineField, defineType } from "sanity"

export const eventLocation = defineType({
  name: "eventLocation",
  title: "Event Location",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Location Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
      description: "Use the reusable venue or address string that should show on event pages.",
    }),
  ],
  preview: {
    select: {
      name: "name",
      address: "address",
    },
    prepare({ name, address }) {
      return {
        title: name || "Event Location",
        subtitle: address || "No address",
      }
    },
  },
})
