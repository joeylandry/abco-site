"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { KeyboardEvent, MouseEvent } from "react"
import Button from "@/components/ui/Button"
import EventCard from "@/components/events/EventCard"
import EventTag from "@/components/events/EventTag"
import { getEventCardTheme } from "@/lib/eventCardTheme"
import { scrollToTopInstantly } from "@/lib/scrollToTop"
import { pastEvents, upcomingEvents, type EventItem } from "@/app/events/mockEvents"

const SECONDARY_EVENT_BUTTON_CLASS =
  "bg-black px-4 py-2 text-xs text-white hover:bg-black/90 hover:opacity-100 sm:text-sm"

function CompactUpcomingEventCard({
  accentIndex = 0,
  weekday,
  month,
  day,
  title,
  href,
  inHouseEvent,
  ctaLabel = "Details",
}: Pick<EventItem, "weekday" | "month" | "day" | "title" | "href" | "inHouseEvent"> & {
  accentIndex?: number
  ctaLabel?: string
}) {
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
      className="relative cursor-pointer overflow-hidden border border-black/15 bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
      role="link"
      tabIndex={0}
      onClick={navigateToEvent}
      onKeyDown={handleCardKeyDown}
      aria-label={`View details for ${title}`}
    >
      <div className="flex min-h-[112px] flex-row">
        <div
          className="flex w-[116px] shrink-0 flex-col items-center justify-center border-r px-4 py-4 text-center sm:w-[132px]"
          style={{
            backgroundColor: theme.accentColor,
            borderColor: theme.railBorderColor,
            color: theme.accentTextColor,
          }}
        >
          <p
            className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-[11px]"
            style={{ color: theme.accentMutedTextColor }}
          >
            {weekday}
          </p>
          <p className="font-heading text-2xl leading-none uppercase tracking-wide sm:text-3xl">
            {month}
          </p>
          <p className="mt-1 font-heading text-4xl leading-none sm:text-5xl">
            {day}
          </p>
        </div>

        <div className="flex flex-1 items-center justify-between gap-4 bg-white px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <h3 className="font-heading text-xl leading-tight text-foreground sm:text-2xl">
              {title}
            </h3>
            {inHouseEvent ? <EventTag label="In-House Event" /> : null}
          </div>

          <div onClick={stopCardNavigation}>
            <Button href={href} className={`shrink-0 ${SECONDARY_EVENT_BUTTON_CLASS}`}>
              {ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function EventsPageContent() {
  const router = useRouter()
  const [showInHouseOnly, setShowInHouseOnly] = useState(false)
  const filteredUpcomingEvents = useMemo(
    () =>
      showInHouseOnly
        ? upcomingEvents.filter((event) => event.inHouseEvent)
        : upcomingEvents,
    [showInHouseOnly]
  )
  const filteredPastEvents = useMemo(
    () =>
      showInHouseOnly
        ? pastEvents.filter((event) => event.inHouseEvent)
        : pastEvents,
    [showInHouseOnly]
  )
  const nextEvent = filteredUpcomingEvents[0]
  const nextEventTheme = nextEvent ? getEventCardTheme(0) : null
  const featuredUpcoming = filteredUpcomingEvents.slice(1, 3)
  const remainingUpcoming = filteredUpcomingEvents.slice(3)
  const featuredUpcomingOffset = 1
  const remainingUpcomingOffset = featuredUpcomingOffset + featuredUpcoming.length
  const pastEventsOffset = remainingUpcomingOffset + remainingUpcoming.length

  const navigateToFeaturedEvent = () => {
    if (!nextEvent) return
    scrollToTopInstantly()
    router.push(nextEvent.href)
  }

  const handleFeaturedCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      navigateToFeaturedEvent()
    }
  }

  const stopFeaturedNavigation = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation()
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="mb-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-3xl text-foreground sm:text-4xl">
              Next Up
            </h2>
            <p className="mt-2 text-sm text-foreground/75 sm:text-base">
              The next event coming up.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/65">
                Filter by:
              </span>
              <button
                type="button"
                onClick={() => setShowInHouseOnly((active) => !active)}
                className={`transition ${showInHouseOnly ? "opacity-100" : "opacity-75 hover:opacity-100"}`}
                aria-pressed={showInHouseOnly}
              >
                <EventTag label="In-House Event" />
              </button>
            </div>

            <Button
              href="/book-an-event"
              variant="secondary"
              className="border-black text-black hover:bg-black hover:text-white"
            >
              Book an event
            </Button>
          </div>
        </div>

        {nextEvent ? (
          <article
            className="relative isolate mt-5 cursor-pointer overflow-hidden border border-black/15 bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
            role="link"
            tabIndex={0}
            onClick={navigateToFeaturedEvent}
            onKeyDown={handleFeaturedCardKeyDown}
            aria-label={`View details for ${nextEvent.title}`}
          >
            <div className="relative z-10 flex flex-col sm:flex-row">
              <div
                className="flex min-w-[170px] shrink-0 flex-row flex-wrap items-center justify-center gap-x-5 gap-y-2 px-6 py-5 text-center sm:flex-col sm:flex-nowrap sm:justify-center sm:gap-1.5 sm:border-r sm:px-9 sm:py-7"
                style={{
                  backgroundColor: nextEventTheme?.accentColor,
                  borderColor: nextEventTheme?.railBorderColor,
                  color: nextEventTheme?.accentTextColor,
                }}
              >
                {nextEvent.inHouseEvent ? (
                  <div className="flex basis-full justify-center sm:mb-2 sm:block">
                    <EventTag label="In-House Event" />
                  </div>
                ) : null}
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-xs"
                  style={{ color: nextEventTheme?.accentMutedTextColor }}
                >
                  {nextEvent.weekday}
                </p>
                <p className="font-heading text-3xl leading-none uppercase tracking-wide sm:text-5xl">
                  {nextEvent.month}
                </p>
                <p className="font-heading text-5xl leading-none sm:text-7xl">
                  {nextEvent.day}
                </p>
              </div>

              <div className="flex flex-1 flex-col bg-white px-6 py-6 sm:px-8 sm:py-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/65">
                  Featured Event
                </p>
                <h3 className="mt-2 font-heading text-3xl leading-tight text-foreground sm:text-4xl">
                  {nextEvent.title}
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/75 sm:text-base">
                  {nextEvent.shortDescription}
                </p>
                <div className="mt-6" onClick={stopFeaturedNavigation}>
                  <Button href={nextEvent.href} className="bg-black text-white hover:bg-black/90 hover:opacity-100">
                    Get details
                  </Button>
                </div>
              </div>
            </div>
          </article>
        ) : (
          <div className="mt-5 border border-black/15 bg-surface px-6 py-10 text-center text-sm text-foreground/70 shadow-sm">
            No upcoming events match this filter.
          </div>
        )}
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-heading text-3xl text-foreground sm:text-4xl">
              Upcoming Events
            </h2>
          <p className="mt-2 text-sm text-foreground/75 sm:text-base">
              What&apos;s coming up next.
          </p>
        </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {featuredUpcoming.map((event, index) => (
            <EventCard
              key={event.id}
              accentIndex={featuredUpcomingOffset + index}
              weekday={event.weekday}
              month={event.month}
              day={event.day}
              title={event.title}
              shortDescription={event.shortDescription}
              href={event.href}
              inHouseEvent={event.inHouseEvent}
              compactTag={false}
              buttonClassName="bg-black px-5 py-2.5 text-xs text-white hover:bg-black/90 hover:opacity-100 sm:text-sm"
            />
          ))}
        </div>

        <div className="mt-6 h-[304px] overflow-y-auto">
          <div className="space-y-4">
            {remainingUpcoming.map((event, index) => (
              <CompactUpcomingEventCard
                key={event.id}
                accentIndex={remainingUpcomingOffset + index}
                weekday={event.weekday}
                month={event.month}
                day={event.day}
                title={event.title}
                href={event.href}
                inHouseEvent={event.inHouseEvent}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 border-t border-black/10 pt-8 sm:pt-10">
        <div className="mb-5">
          <h2 className="font-heading text-3xl text-foreground sm:text-4xl">
            Past Events
          </h2>
          <p className="mt-2 text-sm text-foreground/75 sm:text-base">
            Recent highlights from the brewery.
          </p>
        </div>

        <div className="h-[304px] overflow-y-auto">
          <div className="space-y-4">
            {filteredPastEvents.map((event, index) => (
              <CompactUpcomingEventCard
                key={event.id}
                accentIndex={pastEventsOffset + index}
                weekday={event.weekday}
                month={event.month}
                day={event.day}
                title={event.title}
                href={event.href}
                inHouseEvent={event.inHouseEvent}
                ctaLabel="Recap"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
