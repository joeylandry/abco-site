import type { EventItem } from "@/app/events/mockEvents"

function escapeCalendarText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;")
}

function formatUtcIcsDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")
}

export function buildEventCalendarFilename(event: Pick<EventItem, "id" | "title">) {
  const slug = event.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return `${slug || event.id}.ics`
}

export function buildEventCalendarIcs(event: EventItem) {
  if (!event.calendarStart || !event.calendarEnd) {
    return null
  }

  const start = formatUtcIcsDateTime(event.calendarStart)
  const end = formatUtcIcsDateTime(event.calendarEnd)

  if (!start || !end) {
    return null
  }

  const now = formatUtcIcsDateTime(new Date().toISOString())

  if (!now) {
    return null
  }

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ABCo//Events Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.id}@drinkarlingtonbeer.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeCalendarText(event.title)}`,
    `DESCRIPTION:${escapeCalendarText(event.shortDescription)}`,
    `LOCATION:${escapeCalendarText(event.location)}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
}
