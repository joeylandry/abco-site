"use client"

import Button from "@/components/ui/Button"
import EventTag from "@/components/events/EventTag"
import { getEventCardTheme } from "@/lib/eventCardTheme"
import { scrollToTopInstantly } from "@/lib/scrollToTop"
import { useRouter } from "next/navigation"
import type { KeyboardEvent, MouseEvent } from "react"

export type EventCardProps = {
  accentIndex?: number
  weekday?: string
  month: string
  day: string | number
  title: string
  shortDescription: string
  href: string
  ctaLabel?: string
  imageSrc?: string
  buttonClassName?: string
  inHouseEvent?: boolean
  compactTag?: boolean
}

export default function EventCard({
  accentIndex = 0,
  weekday,
  month,
  day,
  title,
  shortDescription,
  href,
  ctaLabel = "Click for more info",
  buttonClassName,
  inHouseEvent,
  compactTag = false,
}: EventCardProps) {
  const router = useRouter()
  const theme = getEventCardTheme(accentIndex)

  const navigateToEvent = () => {
    scrollToTopInstantly()
    router.push(href)
  }

  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      navigateToEvent()
    }
  }

  const stopCardNavigation = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
  }

  return (
    <article
      className="relative isolate h-full cursor-pointer overflow-hidden border border-black/15 bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
      role="link"
      tabIndex={0}
      onClick={navigateToEvent}
      onKeyDown={handleCardKeyDown}
      aria-label={`View details for ${title}`}
    >
      <div className="relative z-10 flex h-full flex-col sm:flex-row sm:items-stretch">
        <div
          className="flex min-w-[170px] shrink-0 self-stretch flex-row flex-wrap items-center justify-center gap-x-5 gap-y-2 px-6 py-5 text-center sm:flex-col sm:flex-nowrap sm:justify-center sm:gap-1.5 sm:border-r sm:px-9 sm:py-7"
          style={{
            backgroundColor: theme.accentColor,
            borderColor: theme.railBorderColor,
            color: theme.accentTextColor,
          }}
        >
          {inHouseEvent ? (
            <div className={`flex basis-full justify-center ${compactTag ? "" : "sm:mb-2 sm:block"}`}>
              <EventTag iconOnly={compactTag} label="In-House Event" />
            </div>
          ) : null}
          {weekday ? (
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-xs"
              style={{ color: theme.accentMutedTextColor }}
            >
              {weekday}
            </p>
          ) : null}
          <p className="font-heading text-3xl leading-none uppercase tracking-wide sm:text-5xl">
            {month}
          </p>
          <p className="font-heading text-5xl leading-none sm:text-7xl">{day}</p>
        </div>

        <div className="flex flex-1 flex-col items-center gap-4 bg-white px-6 py-6 text-center sm:px-7 sm:py-7">
          <h3 className="font-heading text-2xl leading-tight text-foreground sm:text-3xl">
            {title}
          </h3>

          <p className="max-w-2xl text-sm leading-relaxed text-foreground/75 sm:text-base">
            {shortDescription}
          </p>

          <div className="mt-auto pt-2" onClick={stopCardNavigation}>
            <Button
              href={href}
              className={
                buttonClassName ??
                "bg-black px-5 py-2.5 text-xs text-white hover:bg-black/90 hover:opacity-100 sm:text-sm"
              }
            >
              {ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
