"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import type { KeyboardEvent, MouseEvent } from "react"
import Button from "@/components/ui/Button"
import EventTag from "@/components/events/EventTag"
import { DESKTOP_EVENT_SECTION_HEADING_CLASS } from "@/components/events/eventHeadingStyles"
import { getEventCardTheme } from "@/lib/eventCardTheme"
import type { EventItem } from "@/lib/eventTypes"

const CLEAR_EVENT_BUTTON_CLASS =
  "border border-black bg-transparent text-black shadow-none hover:bg-black/5 hover:text-black"

type HomeNextEventProps = {
  nextEvent: EventItem | null
}

function ForwardArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className ?? "h-4 w-4 fill-none stroke-current stroke-[1.8]"}
    >
      <path d="M5 12h13" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  )
}

export default function HomeNextEvent({ nextEvent }: HomeNextEventProps) {
  const router = useRouter()
  const nextEventTheme = nextEvent ? getEventCardTheme(0) : null

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

  if (!nextEvent) {
    return null
  }

  return (
    <section className="hidden bg-background py-12 md:block">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6">
          <h2 className={DESKTOP_EVENT_SECTION_HEADING_CLASS}>
            Next Event
          </h2>
        </div>
        <div className="mt-5 flex flex-col gap-5 md:flex-row md:flex-nowrap md:items-center md:gap-6">
          <article
            className="relative isolate min-w-0 flex-1 cursor-pointer overflow-hidden border border-black/15 bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
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
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/70 sm:text-base">
                  See the full event page for timing, location, and ticket details.
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

          <div className="flex shrink-0 items-center md:pl-1">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-black/80 transition hover:text-black"
          >
            <span>VIEW ALL Events</span>
            <ForwardArrowIcon />
          </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
