import { client } from "@/lib/sanity"

export type HomeAnnouncement = {
  _id: string
  headline: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
  imageUrl: string | null
  imageAlt: string | null
  placement: "mobile" | "desktop" | "both"
  sortOrder: number
}

const fallbackAnnouncements: HomeAnnouncement[] = [
  {
    _id: "fallback-opening-soon",
    headline: "Opening Soon!",
    subtitle: "Follow along as we shape the new taproom at 15 Ryder St.!",
    ctaLabel: "Learn more",
    ctaHref: "/visit",
    imageUrl: "/home_announcment.jpg",
    imageAlt: "Concept rendering of the new taproom at 15 Ryder St.",
    placement: "mobile",
    sortOrder: 0,
  },
]

const desktopFallbackAnnouncements: HomeAnnouncement[] = fallbackAnnouncements.map((announcement) => ({
  ...announcement,
  placement: "desktop",
}))

export async function getHomeMobileAnnouncements() {
  try {
    const announcements = await client.fetch<HomeAnnouncement[]>(
      `*[
        _type == "homeAnnouncement" &&
        active == true &&
        (!defined(placement) || placement in ["mobile", "both"])
      ] | order(coalesce(sortOrder, 9999) asc, _createdAt asc) {
        _id,
        headline,
        subtitle,
        ctaLabel,
        ctaHref,
        "imageUrl": image.asset->url,
        "imageAlt": coalesce(image.alt, headline),
        placement,
        sortOrder
      }`
    )

    if (announcements.length === 0) {
      return fallbackAnnouncements
    }

    return announcements.map((announcement) => ({
      ...announcement,
      headline: announcement.headline || fallbackAnnouncements[0].headline,
      subtitle: announcement.subtitle || fallbackAnnouncements[0].subtitle,
      ctaLabel: announcement.ctaLabel || fallbackAnnouncements[0].ctaLabel,
      ctaHref: announcement.ctaHref || fallbackAnnouncements[0].ctaHref,
      imageUrl: announcement.imageUrl || fallbackAnnouncements[0].imageUrl,
      imageAlt: announcement.imageAlt || fallbackAnnouncements[0].imageAlt,
      placement: announcement.placement || "mobile",
      sortOrder: announcement.sortOrder ?? 0,
    }))
  } catch {
    return fallbackAnnouncements
  }
}

export async function getHomeDesktopAnnouncement() {
  try {
    const announcements = await client.fetch<HomeAnnouncement[]>(
      `*[
        _type == "homeAnnouncement" &&
        active == true &&
        (!defined(placement) || placement in ["desktop", "both"])
      ] | order(coalesce(sortOrder, 9999) asc, _createdAt asc) {
        _id,
        headline,
        subtitle,
        ctaLabel,
        ctaHref,
        "imageUrl": image.asset->url,
        "imageAlt": coalesce(image.alt, headline),
        placement,
        sortOrder
      }`
    )

    if (announcements.length === 0) {
      return desktopFallbackAnnouncements
    }

    return announcements.map((announcement) => ({
      ...announcement,
      headline: announcement.headline || fallbackAnnouncements[0].headline,
      subtitle: announcement.subtitle || fallbackAnnouncements[0].subtitle,
      ctaLabel: announcement.ctaLabel || fallbackAnnouncements[0].ctaLabel,
      ctaHref: announcement.ctaHref || fallbackAnnouncements[0].ctaHref,
      imageUrl: announcement.imageUrl || fallbackAnnouncements[0].imageUrl,
      imageAlt: announcement.imageAlt || fallbackAnnouncements[0].imageAlt,
      placement: announcement.placement || "desktop",
      sortOrder: announcement.sortOrder ?? 0,
    }))
  } catch {
    return desktopFallbackAnnouncements
  }
}
