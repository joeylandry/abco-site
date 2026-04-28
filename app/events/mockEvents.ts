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

function buildEventDetailImages(primarySrc = "/event_temp_bg.png") {
  return [primarySrc]
}

export const upcomingEvents: EventItem[] = [
  {
    id: "april-10-arlington-jazz-festival",
    weekday: "Fri",
    month: "Apr",
    day: 10,
    title: "Arlington Jazz Festival",
    shortDescription:
      "A night of live jazz at Mill Cafe as part of the Arlington Jazz Festival.",
    longDescription:
      "Join the Arlington Jazz Festival at Mill Cafe for an evening of live music in the heart of Arlington.",
    eventType: "Festival",
    time: "Friday, April 10, 2026 · 4:30–10:00 PM",
    location: "Mill Cafe · 14 Mill Street, Arlington, MA 02476",
    status: "upcoming",
    ageRestriction: "All ages",
    href: "/events/april-10-arlington-jazz-festival",
    imageSrc: "/events/jazz_fest.jpg",
    detailImages: buildEventDetailImages("/events/jazz_fest.jpg"),
    inHouseEvent: true,
    calendarStart: "2026-04-10T16:30:00-04:00",
    calendarEnd: "2026-04-10T22:00:00-04:00",
  },
  {
    id: "april-11-melrose-beer-bites",
    weekday: "Sat",
    month: "Apr",
    day: 11,
    title: "Melrose Beer + Bites",
    shortDescription:
      "Sample craft brews, wine, mocktails, and bites from local restaurants at Memorial Hall.",
    longDescription:
      "Sample a variety of craft brews from area breweries, plus wine, mocktails, and \"bites\" from local restaurants and food retailers.",
    eventType: "Tasting festival",
    time: "Saturday, April 11, 2026 · 6:00–9:30 PM",
    location: "Memorial Hall · 590 Main Street, Melrose, MA 02176",
    status: "upcoming",
    ageRestriction: "21+",
    href: "/events/april-11-melrose-beer-bites",
    ticketHref: "https://www.melrosebeerandbites.com",
    imageSrc: "/events/melrose_bb.jpg",
    detailImages: buildEventDetailImages("/events/melrose_bb.jpg"),
    inHouseEvent: false,
    calendarStart: "2026-04-11T18:00:00-04:00",
    calendarEnd: "2026-04-11T21:30:00-04:00",
  },
  {
    id: "april-11-studio-aca",
    weekday: "Sat",
    month: "Apr",
    day: 11,
    title: "Studio ACA",
    shortDescription:
      "Disco Extravaganza spring gala supporting Arlington Center for the Arts at Arlington Town Hall.",
    longDescription:
      "Disco Extravaganza! We are proud to sponsor the Arlington Center for the Arts spring gala: Studio ACA. This disco extravaganza is happening Saturday, April 11, 2026, 7–10 PM at Arlington Town Hall. 70's attire optional!\n\nThis annual fundraising event will have you boogying all night with a live DJ set, hip threads, far out dance moves, plus outta sight food and drinks! The evening will also include the presentation of ACA’s McClennen Community Arts Award to the Arlington Housing Authority.\n\nProceeds from the event will support ACA's work to produce high quality, engaging community programs for Arlington and beyond.",
    eventType: "Fundraiser gala",
    time: "Saturday, April 11, 2026 · 7:00–10:00 PM",
    location: "Arlington Town Hall · 730 Massachusetts Avenue, Arlington, MA 02476",
    status: "upcoming",
    ageRestriction: "All ages",
    href: "/events/april-11-studio-aca",
    ticketHref: "https://www.acarts.org/studioaca",
    imageSrc: "/events/studio.jpg",
    detailImages: buildEventDetailImages("/events/studio.jpg"),
    inHouseEvent: false,
    calendarStart: "2026-04-11T19:00:00-04:00",
    calendarEnd: "2026-04-11T22:00:00-04:00",
  },
  {
    id: "april-17-mill-cafe-after-hours",
    weekday: "Fri",
    month: "Apr",
    day: 17,
    title: "Mill Cafe After Hours",
    shortDescription:
      "Family-friendly After Hours event at The Mill Cafe with local beers, new menu items, and live tunes.",
    longDescription:
      "The Mill Café will be serving up some new menu items for this After Hours event, and we will be there with a selection of your favorite local beers. Bring a friend, grab a beer, and relax with some live tunes! These are family friendly events—bring everyone.\n\nMusic lineup:\n5:30–7:30 PM — Wicked Pickers\n8:00–10:00 PM — TBA",
    eventType: "Pop-up",
    time: "Friday, April 17, 2026 · 4:30–10:00 PM",
    location: "The Mill Cafe · 14 Mill Street, Arlington, MA 02476",
    status: "upcoming",
    ageRestriction: "All ages",
    href: "/events/april-17-mill-cafe-after-hours",
    detailImages: buildEventDetailImages(),
    inHouseEvent: false,
    calendarStart: "2026-04-17T16:30:00-04:00",
    calendarEnd: "2026-04-17T22:00:00-04:00",
  },
  {
    id: "april-18-menotomy-beer-hall",
    weekday: "Sat",
    month: "Apr",
    day: 18,
    title: "Menotomy Beer Hall",
    shortDescription:
      "Indoor, family-friendly beer hall with food, craft beverages, kids activities, live music, and games.",
    longDescription:
      "Celebrate the actual first day of the American Revolution with food and craft beverages. This indoor, family friendly beer hall includes arts and crafts for children, live music, and games. Food and drinks provided by local businesses.\n\nCollaborative event hosted by the Arlington Historical Society, Town of Arlington, and Arlington Commission for Arts and Culture.",
    eventType: "Pop-up",
    time: "Saturday, April 18, 2026 · 12:00–6:00 PM",
    location: "Menotomy Beer Hall · Arlington, MA",
    status: "upcoming",
    ageRestriction: "All ages",
    href: "/events/april-18-menotomy-beer-hall",
    detailImages: buildEventDetailImages(),
    inHouseEvent: false,
    calendarStart: "2026-04-18T12:00:00-04:00",
    calendarEnd: "2026-04-18T18:00:00-04:00",
  },
  {
    id: "april-18-ma-craft-brewers-festival",
    weekday: "Sat",
    month: "Apr",
    day: 18,
    title: "MA Craft Brewer's Festival",
    shortDescription:
      "A one-day spring festival from the Mass Brewers Guild with seasonal craft beer, German-inspired offerings, and live music.",
    longDescription:
      "Spring is coming—and with it, a brand-new celebration from the Mass Brewers Guild. Inspired by Germany’s Frühlingsfest, this one-day festival brings the spirit of Munich and Stuttgart to Boston with fresh, seasonal craft beer, German-inspired offerings, live music, and a relaxed, welcoming atmosphere.\n\nJoin 40+ Massachusetts craft brewers and beer lovers from across the state for a day of discovery, flavor, and fun under the BCA Cyclorama’s dome skylight.",
    eventType: "Festival",
    time: "Saturday, April 18, 2026 · 1:00–8:00 PM",
    location: "Cyclorama · 539 Tremont Street, Boston, MA 02116",
    status: "upcoming",
    ageRestriction: "21+",
    href: "/events/april-18-ma-craft-brewers-festival",
    ticketHref:
      "https://events.beerfests.com/e/massachusetts-craft-brewers-festival",
    imageSrc: "/events/brew_fest.jpeg",
    detailImages: buildEventDetailImages("/events/brew_fest.jpeg"),
    inHouseEvent: false,
    calendarStart: "2026-04-18T13:00:00-04:00",
    calendarEnd: "2026-04-18T20:00:00-04:00",
  },
  {
    id: "may-15-copley-square-farmers-market",
    weekday: "Fri",
    month: "May",
    day: 15,
    title: "Copley Square Farmers' Market",
    shortDescription:
      "Catch ABCo at Copley Square Farmers' Market with favorites, rotating specials, and seasonal releases.",
    longDescription:
      "Find us at the Copley Square Farmers Market every Friday from 11:00 AM to 6:00 PM. We'll have ABCo favorites like Spy-P-A and Bike Path Pale Ale on hand, along with rotating specials and seasonal releases. Pick up a few cans or bottles to take home, and stop by for a sample while you're at it. See you there!",
    eventType: "Market pop-up",
    time: "Friday, May 15, 2026 · 11:00 AM–6:00 PM",
    location: "Copley Square Park · 560 Boylston Street, Boston, MA 02116",
    status: "upcoming",
    ageRestriction: "All ages",
    href: "/events/may-15-copley-square-farmers-market",
    detailImages: buildEventDetailImages(),
    inHouseEvent: false,
    calendarStart: "2026-05-15T11:00:00-04:00",
    calendarEnd: "2026-05-15T18:00:00-04:00",
  },
]

export const pastEvents: EventItem[] = [
  {
    id: "feb-22-winter-fest",
    weekday: "Sat",
    month: "Feb",
    day: 22,
    title: "Winter Tap Takeover",
    shortDescription:
      "A packed house, rotating guest taps, and limited-run barrel pours all day.",
    longDescription:
      "Winter Tap Takeover brought together guest pours, barrel selections, and a room that stayed active all day without losing the local feel. The format worked because it felt broad enough to explore but still centered on the taproom rather than a festival-style experience.",
    eventType: "Tap takeover",
    time: "Saturday, February 22 at 2:00 PM",
    location: "ABCo Taproom, Arlington, MA",
    status: "past",
    ageRestriction: "21+",
    href: "/events/feb-22-winter-fest",
    detailImages: buildEventDetailImages(),
  },
  {
    id: "feb-14-choc-stout",
    weekday: "Fri",
    month: "Feb",
    day: 14,
    title: "Chocolate Stout Pairing Night",
    shortDescription:
      "Dessert pairings with four house stouts and a guided tasting with the brew team.",
    longDescription:
      "Chocolate Stout Pairing Night combined guided tasting notes with a tighter dessert menu so the room felt focused without becoming formal. It landed as one of the more intimate winter events and gave the brew team a clearer platform to walk people through the darker side of the lineup.",
    eventType: "Guided tasting",
    time: "Friday, February 14 at 7:00 PM",
    location: "ABCo Taproom, Arlington, MA",
    status: "past",
    ageRestriction: "21+",
    href: "/events/feb-14-choc-stout",
    detailImages: buildEventDetailImages(),
  },
  {
    id: "jan-31-lager-lab",
    weekday: "Fri",
    month: "Jan",
    day: 31,
    title: "Lager Lab Showcase",
    shortDescription:
      "A deep dive into crisp styles with tasting flights and brewmaster Q&A.",
    longDescription:
      "Lager Lab Showcase gave people a closer look at the technical side of crisp beer without turning into a lecture. Flights, guided comparisons, and a direct Q&A with the brew team made it one of the stronger format-driven events from the winter schedule.",
    eventType: "Beer education",
    time: "Friday, January 31 at 6:30 PM",
    location: "ABCo Taproom, Arlington, MA",
    status: "past",
    ageRestriction: "21+",
    href: "/events/jan-31-lager-lab",
    detailImages: buildEventDetailImages(),
  },
  {
    id: "jan-18-charity-night",
    weekday: "Sat",
    month: "Jan",
    day: 18,
    title: "Community Charity Night",
    shortDescription:
      "We teamed up with local groups and raised funds during a full taproom event.",
    longDescription:
      "Community Charity Night kept the taproom atmosphere intact while focusing attention on local partners and direct fundraising. It worked because the event felt connected to the usual crowd rather than operating as a separate kind of venue night.",
    eventType: "Community fundraiser",
    time: "Saturday, January 18 at 5:00 PM",
    location: "ABCo Taproom, Arlington, MA",
    status: "past",
    ageRestriction: "All ages",
    href: "/events/jan-18-charity-night",
    detailImages: buildEventDetailImages(),
  },
]

export const mockEvents = [...upcomingEvents, ...pastEvents]

export function getEventById(id: string) {
  return mockEvents.find((event) => event.id === id)
}

export function getRelatedUpcomingEvents(currentId: string, count = 6) {
  return upcomingEvents.filter((event) => event.id !== currentId).slice(0, count)
}
