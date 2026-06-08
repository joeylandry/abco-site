import { cache } from "react"
import { client } from "@/lib/sanity"
import type { EventItem } from "@/lib/eventTypes"

type SanityPortableTextSpan = {
  _type?: string
  text?: string
}

type SanityPortableTextBlock = {
  _type?: string
  children?: SanityPortableTextSpan[]
}

type SanityEventLocation = {
  name?: string | null
  address?: string | null
}

type SanityEventDetailImage = {
  src?: string | null
  alt?: string | null
}

type SanityEventRecord = {
  _id: string
  slug?: string | null
  title?: string | null
  shortDescription?: string | null
  longDescription?: SanityPortableTextBlock[] | null
  eventType?: string | null
  startDateTime?: string | null
  endDateTime?: string | null
  timezone?: string | null
  location?: SanityEventLocation | null
  ageRestriction?: string | null
  ticketHref?: string | null
  taproomEvent?: boolean | null
  imageSrc?: string | null
  detailImages?: SanityEventDetailImage[] | null
}

type EventsSnapshot = {
  allEvents: EventItem[]
  upcomingEvents: EventItem[]
  pastEvents: EventItem[]
  nextEvent: EventItem | null
}

const eventProjection = `
  _id,
  "slug": slug.current,
  title,
  shortDescription,
  longDescription,
  eventType,
  startDateTime,
  endDateTime,
  timezone,
  "location": location->{
    name,
    address
  },
  ageRestriction,
  ticketHref,
  taproomEvent,
  "imageSrc": image.asset->url,
  "detailImages": detailImages[active == true]{
    "src": image.asset->url,
    alt
  }
`

function sanitizeText(value: string) {
  return value.replace(/\s+/g, " ").trim()
}

function portableTextToPlainText(blocks: SanityPortableTextBlock[] | null | undefined) {
  if (!blocks || blocks.length === 0) {
    return ""
  }

  return blocks
    .map((block) => {
      if (!block || block._type !== "block" || !Array.isArray(block.children)) {
        return ""
      }

      return block.children
        .map((child) => (typeof child.text === "string" ? child.text : ""))
        .join("")
    })
    .filter(Boolean)
    .join("\n\n")
    .trim()
}

function formatDateParts(date: Date, timeZone: string) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone,
  }).format(date)
  const month = new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone,
  }).format(date)
  const day = Number(
    new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      timeZone,
    }).format(date)
  )
  const longDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone,
  }).format(date)

  return { weekday, month, day, longDate }
}

function formatTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  }).format(date)
}

function formatEventTime(startDateTime: string, endDateTime: string, timeZone: string) {
  const start = new Date(startDateTime)
  const end = new Date(endDateTime)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return ""
  }

  const startParts = formatDateParts(start, timeZone)
  const endParts = formatDateParts(end, timeZone)
  const startTime = formatTime(start, timeZone)
  const endTime = formatTime(end, timeZone)

  if (startParts.longDate === endParts.longDate) {
    return `${startParts.longDate} · ${startTime}–${endTime}`
  }

  return `${startParts.longDate} · ${startTime} – ${endParts.longDate} · ${endTime}`
}

function getEventEndTime(event: Pick<EventItem, "calendarStart" | "calendarEnd">) {
  const value = event.calendarEnd ?? event.calendarStart

  if (!value) {
    return Number.NEGATIVE_INFINITY
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? Number.NEGATIVE_INFINITY : date.getTime()
}

function getEventStartTime(event: Pick<EventItem, "calendarStart" | "calendarEnd">) {
  const value = event.calendarStart ?? event.calendarEnd

  if (!value) {
    return Number.POSITIVE_INFINITY
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? Number.POSITIVE_INFINITY : date.getTime()
}

function formatLocation(location: SanityEventLocation | null | undefined) {
  const name = location?.name?.trim() ?? ""
  const address = location?.address?.trim() ?? ""

  if (name && address) {
    return `${name} · ${address}`
  }

  return sanitizeText(name || address)
}

function transformEvent(record: SanityEventRecord): EventItem | null {
  if (!record.slug || !record.title || !record.shortDescription || !record.eventType) {
    return null
  }

  if (!record.startDateTime || !record.endDateTime) {
    return null
  }

  const timeZone = record.timezone || "America/New_York"
  const startDate = new Date(record.startDateTime)
  const endDate = new Date(record.endDateTime)

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return null
  }

  const dateParts = formatDateParts(startDate, timeZone)
  const time = formatEventTime(record.startDateTime, record.endDateTime, timeZone)
  const detailImages = record.detailImages
    ?.map((image) => image?.src?.trim())
    .filter((image): image is string => Boolean(image))

  return {
    id: record.slug,
    weekday: dateParts.weekday,
    month: dateParts.month,
    day: dateParts.day,
    title: record.title,
    shortDescription: record.shortDescription,
    longDescription: portableTextToPlainText(record.longDescription),
    eventType: record.eventType,
    time,
    location: formatLocation(record.location),
    calendarStart: record.startDateTime,
    calendarEnd: record.endDateTime,
    status: endDate.getTime() <= Date.now() ? "past" : "upcoming",
    ageRestriction: record.ageRestriction === "All ages" ? "All ages" : "21+",
    href: `/events/${record.slug}`,
    ticketHref: record.ticketHref || undefined,
    imageSrc: record.imageSrc || undefined,
    detailImages: detailImages && detailImages.length > 0 ? detailImages : undefined,
    inHouseEvent: record.taproomEvent ?? undefined,
  }
}

const eventsQuery = `*[_type == "event" && defined(slug.current)] | order(startDateTime asc, _createdAt asc) {
  ${eventProjection}
}`

export const getAllEvents = cache(async () => {
  const records = await client.fetch<SanityEventRecord[]>(eventsQuery)
  return records.map(transformEvent).filter((event): event is EventItem => Boolean(event))
})

export const getEventsSnapshot = cache(async (): Promise<EventsSnapshot> => {
  const allEvents = await getAllEvents()
  const now = Date.now()

  const upcomingEvents = allEvents
    .filter((event) => getEventEndTime(event) > now)
    .sort((a, b) => getEventStartTime(a) - getEventStartTime(b))
    .map((event) => ({ ...event, status: "upcoming" as const }))

  const pastEvents = allEvents
    .filter((event) => getEventEndTime(event) <= now)
    .sort((a, b) => getEventEndTime(b) - getEventEndTime(a))
    .map((event) => ({ ...event, status: "past" as const }))

  return {
    allEvents: [...upcomingEvents, ...pastEvents],
    upcomingEvents,
    pastEvents,
    nextEvent: upcomingEvents[0] ?? null,
  }
})

export const getEventBySlug = cache(async (slug: string) => {
  const snapshot = await getEventsSnapshot()
  return snapshot.allEvents.find((event) => event.id === slug) ?? null
})

export const getRelatedUpcomingEvents = cache(async (currentId: string, count = 6) => {
  const snapshot = await getEventsSnapshot()
  return snapshot.upcomingEvents.filter((event) => event.id !== currentId).slice(0, count)
})

