"use client"

import { useRouter } from "next/navigation"
import type { KeyboardEvent, MouseEvent } from "react"
import EventTag from "@/components/events/EventTag"
import Button from "@/components/ui/Button"
import { getEventCardTheme } from "@/lib/eventCardTheme"
import { scrollToTopInstantly } from "@/lib/scrollToTop"
import { upcomingEvents } from "@/app/events/mockEvents"

const nextEvent = upcomingEvents[0]
export default function HomeNextEvent() {
  const router = useRouter()
  const theme = nextEvent ? getEventCardTheme(0) : null

  if (!nextEvent) {
    return null
  }

  const navigateToEvent = () => {
    scrollToTopInstantly()
    router.push(nextEvent.href)
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
    <section className="hidden border-t border-black/10 bg-background py-12 md:block">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
            Upcoming Event
          </p>
          <h2 className="mt-2 font-heading text-3xl leading-tight">
            What&apos;s Happening Next
          </h2>
        </div>

        <article
          className="relative isolate cursor-pointer overflow-hidden border border-black/15 bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
          role="link"
          tabIndex={0}
          onClick={navigateToEvent}
          onKeyDown={handleCardKeyDown}
          aria-label={`View details for ${nextEvent.title}`}
        >

          <div className="relative z-10 flex flex-col sm:flex-row">
            <div
              className="flex min-w-[170px] shrink-0 flex-row flex-wrap items-center justify-center gap-x-5 gap-y-2 px-6 py-5 text-center sm:flex-col sm:flex-nowrap sm:justify-center sm:gap-1.5 sm:border-r sm:px-9 sm:py-7"
              style={{
                backgroundColor: theme?.accentColor,
                borderColor: theme?.railBorderColor,
                color: theme?.accentTextColor,
              }}
            >
              {nextEvent.inHouseEvent ? (
                <div className="flex basis-full justify-center sm:mb-2 sm:block">
                  <EventTag label="In-House Event" />
                </div>
              ) : null}
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-xs"
                style={{ color: theme?.accentMutedTextColor }}
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

            <div className="flex flex-1 flex-col items-center bg-white px-6 py-6 text-center sm:px-8 sm:py-8">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/65">
                Next Up
              </p>
              <h3 className="mt-2 font-heading text-3xl leading-tight text-foreground sm:text-4xl">
                {nextEvent.title}
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/75 sm:text-base">
                {nextEvent.shortDescription}
              </p>
              <div className="mt-6" onClick={stopCardNavigation}>
                <Button href={nextEvent.href} className="bg-black text-white hover:bg-black/90 hover:opacity-100">
                  View event
                </Button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
