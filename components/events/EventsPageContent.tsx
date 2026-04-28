"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import type { KeyboardEvent, MouseEvent } from "react"
import Button from "@/components/ui/Button"
import EventCard from "@/components/events/EventCard"
import EventPreviewCard from "@/components/events/EventPreviewCard"
import EventTag from "@/components/events/EventTag"
import DesktopUpcomingEventsSection from "@/components/events/DesktopUpcomingEventsSection"
import { DESKTOP_EVENT_SECTION_HEADING_CLASS } from "@/components/events/eventHeadingStyles"
import { getEventCardTheme } from "@/lib/eventCardTheme"
import { pastEvents, upcomingEvents } from "@/app/events/mockEvents"

const CLEAR_EVENT_BUTTON_CLASS =
  "border border-black bg-transparent text-black shadow-none hover:bg-black/5 hover:text-black"

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
  const featuredUpcomingOffset = 1
  const pastEventsOffset = featuredUpcomingOffset + featuredUpcoming.length

  const navigateToFeaturedEvent = () => {
    if (!nextEvent) return
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
    <div className="mx-auto max-w-7xl px-6 py-8 sm:py-10">
      <section className="mb-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className={DESKTOP_EVENT_SECTION_HEADING_CLASS}>Next Event</h2>
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
                <EventTag label="TAP ROOM EVENT" />
              </button>
            </div>
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
                {nextEvent.inHouseEvent ? (
                  <div className="w-fit">
                    <EventTag label="TAP ROOM EVENT" />
                  </div>
                ) : null}
                <h3 className="mt-2 font-heading text-3xl leading-tight text-foreground sm:text-4xl">
                  {nextEvent.title}
                </h3>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/75 sm:text-base">
                  {nextEvent.shortDescription}
                </p>
                <div className="mt-6" onClick={stopFeaturedNavigation}>
                  <Button
                    href={nextEvent.href}
                    variant="secondary"
                    className={`px-5 py-2.5 text-xs sm:text-sm ${CLEAR_EVENT_BUTTON_CLASS}`}
                  >
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
            <h2 className={DESKTOP_EVENT_SECTION_HEADING_CLASS}>Upcoming Events</h2>
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
              ctaLabel="Get details"
              buttonClassName={`px-5 py-2.5 text-xs sm:text-sm ${CLEAR_EVENT_BUTTON_CLASS}`}
            />
          ))}
        </div>

        <DesktopUpcomingEventsSection
          className="mt-5"
          events={filteredUpcomingEvents}
        />
      </section>

      <section className="mt-12 border-t border-black/10 pt-8 sm:pt-10">
        <div className="mb-5">
          <h2 className="font-heading text-3xl text-foreground sm:text-4xl">
            Past Events
          </h2>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {filteredPastEvents.map((event, index) => (
            <div key={event.id} className="min-w-[280px] max-w-[280px] flex-none">
              <EventPreviewCard
                event={event}
                accentIndex={pastEventsOffset + index}
                showDescription={false}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
