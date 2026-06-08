export type EventItem = {
  id: string
  weekday: string
  month: string
  day: number
  title: string
  shortDescription: string
  longDescription: string
  eventType: string
  time: string
  location: string
  calendarStart?: string
  calendarEnd?: string
  status: "upcoming" | "past"
  ageRestriction: "21+" | "All ages"
  href: string
  ticketHref?: string
  imageSrc?: string
  detailImages?: string[]
  inHouseEvent?: boolean
}

export type EventLocation = {
  name: string
  address?: string
}

