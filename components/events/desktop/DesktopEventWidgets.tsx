"use client"

import { useRouter } from "next/navigation"
import type { EventItem } from "@/lib/eventTypes"
import Button from "@/components/ui/Button"
import { getEventCardTheme } from "@/lib/eventCardTheme"
import type { KeyboardEvent, MouseEvent } from "react"

const EVENT_CARD_BACKDROP =
  "radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 34%), radial-gradient(circle at bottom right, rgba(255,255,255,0.08), transparent 32%), linear-gradient(135deg, rgba(255,255,255,0.12), transparent 30%, rgba(0,0,0,0.06))"

function DesktopEventDateStack({
  weekday,
  month,
  day,
  mutedTextColor,
}: {
  weekday: string
  month: string
  day: string | number
  mutedTextColor: string
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <p
        className="font-semibold uppercase tracking-[0.22em] leading-none text-[0.56rem] sm:text-[0.62rem]"
        style={{ color: mutedTextColor }}
      >
        {weekday}
      </p>
      <p className="mt-1 font-heading uppercase leading-none tracking-[0.14em] text-[1.15rem] sm:text-[1.35rem]">
        {month}
      </p>
      <p className="mt-1 font-heading leading-none text-[2.15rem] sm:text-[2.45rem]">
        {day}
      </p>
    </div>
  )
}

export function DesktopCalendarGridCard({
  event,
  accentIndex,
  onNavigate,
  description,
  expandDescription = false,
  compact = false,
}: {
  event: EventItem
  accentIndex: number
  onNavigate?: () => void
  description?: string
  expandDescription?: boolean
  compact?: boolean
}) {
  const router = useRouter()
  const theme = getEventCardTheme(accentIndex)

  const navigateToEvent = () => {
    onNavigate?.()
    router.push(event.href)
  }

  const handleCardKeyDown = (keyboardEvent: KeyboardEvent<HTMLElement>) => {
    if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
      keyboardEvent.preventDefault()
      navigateToEvent()
    }
  }

  const stopCardNavigation = (mouseEvent: MouseEvent<HTMLElement>) => {
    mouseEvent.stopPropagation()
  }

  return (
    <article
      className={`group relative block w-full cursor-pointer overflow-hidden border shadow-[0_18px_40px_rgba(0,0,0,0.14)] transition-transform duration-200 hover:-translate-y-1 ${
        compact ? "aspect-[4/4.2]" : "aspect-[4/5]"
      }`}
      role="link"
      tabIndex={0}
      onClick={navigateToEvent}
      onKeyDown={handleCardKeyDown}
      aria-label={`View details for ${event.title}`}
      style={{
        backgroundColor: theme.accentColor,
        borderColor: theme.railBorderColor,
        color: theme.accentTextColor,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{ backgroundImage: EVENT_CARD_BACKDROP }}
      />

      <div className={`relative flex h-full flex-col ${compact ? "p-2.5 sm:p-3" : "p-3.5 sm:p-4"}`}>
        <div className="shrink-0 flex items-start justify-start gap-3">
          <DesktopEventDateStack
            weekday={event.weekday}
            month={event.month}
            day={event.day}
            mutedTextColor={theme.accentMutedTextColor}
          />
        </div>

        <div className={`${compact ? "mt-3" : "mt-4"} flex min-h-0 flex-1 flex-col`}>
          <h3
            className={`w-full font-heading text-balance ${
              compact
                ? "text-[clamp(0.94rem,2.9vw,1.18rem)] leading-[1.02]"
                : "text-[clamp(1.02rem,3.1vw,1.32rem)] leading-[1.04]"
            }`}
          >
            {event.title}
          </h3>

          {description ? (
            <div
              className={`mt-2 flex min-h-0 ${
                compact ? "" : "flex-1"
              } ${expandDescription ? "items-center" : "items-start"}`}
            >
              <p
                className={
                  expandDescription
                    ? "mx-auto w-full max-w-[17rem] overflow-hidden text-center text-[0.88rem] leading-[1.62] text-balance"
                    : compact
                      ? "w-full overflow-hidden text-center text-[0.66rem] leading-[1.28] text-balance [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
                      : "w-full overflow-hidden text-center text-[0.7rem] leading-[1.38] text-balance [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]"
                }
                style={{ color: theme.accentMutedTextColor }}
              >
                {description}
              </p>
            </div>
          ) : null}
        </div>

        <div className={`${compact ? "pt-2" : "mt-auto pt-4"}`}>
          <Button
            href={event.href}
            onClick={(clickEvent: MouseEvent<HTMLElement, globalThis.MouseEvent>) => {
              stopCardNavigation(clickEvent)
              onNavigate?.()
            }}
            className={`w-fit border border-white/30 !bg-white/16 !px-4 uppercase tracking-[0.16em] !text-current !shadow-none backdrop-blur-md supports-[backdrop-filter]:!bg-white/16 hover:!bg-white/24 hover:!text-current hover:!opacity-100 hover:!translate-y-0 ${
              compact ? "!py-2 text-[0.64rem]" : "!py-2.5 text-[0.68rem]"
            }`}
          >
            Get details
          </Button>
        </div>
      </div>
    </article>
  )
}
