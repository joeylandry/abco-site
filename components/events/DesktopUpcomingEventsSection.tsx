"use client"

import { useEffect, useRef, useState } from "react"
import type { EventItem } from "@/lib/eventTypes"
import { DesktopCalendarGridCard } from "@/components/events/desktop/DesktopEventWidgets"
import { DESKTOP_EVENT_SECTION_HEADING_CLASS } from "@/components/events/eventHeadingStyles"

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className ?? "h-4 w-4 fill-none stroke-current stroke-[1.8]"}
    >
      <path d="M12 5v13" />
      <path d="M6 13l6 6 6-6" />
    </svg>
  )
}

function ToggleButton({
  label,
  isOpen,
  onClick,
}: {
  label: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls="more-events"
      className="inline-flex items-center gap-2 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-black/80 transition hover:text-black"
    >
      <span>{label}</span>
      <ArrowIcon
        className={`h-4 w-4 fill-none stroke-current stroke-[1.8] transition-transform duration-200 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  )
}

type DesktopUpcomingEventsSectionProps = {
  events: EventItem[]
  className?: string
  triggerLabel?: string
}

export default function DesktopUpcomingEventsSection({
  events,
  className,
  triggerLabel = "VIEW ALL EVENTS",
}: DesktopUpcomingEventsSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const closeTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  const openSection = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    setIsRendered(true)

    window.requestAnimationFrame(() => {
      setIsOpen(true)
    })
  }

  const closeSection = () => {
    setIsOpen(false)

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
    }

    closeTimerRef.current = window.setTimeout(() => {
      setIsRendered(false)
      closeTimerRef.current = null
    }, 280)
  }

  const toggleSection = () => {
    if (isOpen) {
      closeSection()
      return
    }

    openSection()
  }

  const buttonLabel = isOpen ? "HIDE ALL EVENTS" : triggerLabel

  return (
    <div className={className}>
      <div className="flex justify-center">
        <ToggleButton label={buttonLabel} isOpen={isOpen} onClick={toggleSection} />
      </div>

      {isRendered ? (
        <div
          className="overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out"
          style={{
            maxHeight: isOpen ? "2400px" : "0px",
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateY(0)" : "translateY(-8px)",
          }}
        >
          <section id="more-events" className="mt-6">
            <div className="mb-4 border-b border-black/10 pb-4">
              <h2 className={DESKTOP_EVENT_SECTION_HEADING_CLASS}>
                All Upcoming Events
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {events.map((event, index) => (
                <DesktopCalendarGridCard
                  key={event.id}
                  event={event}
                  accentIndex={index}
                />
              ))}
            </div>

            <div className="mt-5 flex justify-center">
              <ToggleButton
                label={isOpen ? "HIDE ALL EVENTS" : "VIEW ALL EVENTS"}
                isOpen={isOpen}
                onClick={toggleSection}
              />
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}
