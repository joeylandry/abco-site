"use client"

import Button from "@/components/ui/Button"
import { useRouter } from "next/navigation"
import type { EventItem } from "@/app/events/mockEvents"
import { getEventCardTheme } from "@/lib/eventCardTheme"
import { scrollToTopInstantly } from "@/lib/scrollToTop"
import { MobileEventBadge, MobileEventDateStack } from "@/components/events/mobile/MobileEventShared"
import type { KeyboardEvent, MouseEvent } from "react"

const EVENT_CARD_BACKDROP =
  "radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 34%), radial-gradient(circle at bottom right, rgba(255,255,255,0.08), transparent 32%), linear-gradient(135deg, rgba(255,255,255,0.12), transparent 30%, rgba(0,0,0,0.06))"

export function MobileEventWidget({
  event,
  label,
  accentIndex,
  interactive = false,
  ctaLabel = "Learn more",
  ctaHref = event.href,
  secondaryCtaLabel,
  secondaryCtaHref,
}: {
  event: EventItem
  label: string
  accentIndex: number
  interactive?: boolean
  ctaLabel?: string
  ctaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
}) {
  const router = useRouter()
  const theme = getEventCardTheme(accentIndex)
  const hasSecondaryCta = Boolean(secondaryCtaLabel && secondaryCtaHref)
  const secondaryButtonHref = secondaryCtaHref ?? ctaHref
  const navigateToEvent = () => {
    scrollToTopInstantly()
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
      className={`relative isolate mx-auto aspect-square w-full max-w-[20.5rem] overflow-hidden border shadow-[0_24px_60px_-36px_rgba(0,0,0,0.5)] ${
        interactive ? "cursor-pointer transition-transform duration-200 hover:-translate-y-1" : ""
      }`}
      role={interactive ? "link" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? navigateToEvent : undefined}
      onKeyDown={interactive ? handleCardKeyDown : undefined}
      aria-label={interactive ? `View details for ${event.title}` : undefined}
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

      <div className="relative flex h-full flex-col p-3">
        <div className="mb-2.5 flex items-center justify-start gap-2">
          <MobileEventBadge label={label} mutedTextColor={theme.accentMutedTextColor} />
        </div>

        <div className="flex flex-col items-center gap-1.5 text-center">
          <h3 className="w-full font-heading text-[clamp(1rem,4.2vw,1.28rem)] leading-[1.02] text-balance">
            {event.title}
          </h3>
        </div>

        <div className="flex flex-1 items-center justify-center py-1">
          <div className="flex flex-col items-center text-center gap-0.5">
            <p
              className="font-heading text-[clamp(0.68rem,2.8vw,0.84rem)] leading-none uppercase tracking-[0.14em]"
              style={{ color: theme.accentMutedTextColor }}
            >
              {event.weekday}
            </p>
            <p className="font-heading text-[clamp(1.6rem,7vw,2.28rem)] leading-none uppercase tracking-[0.08em]">
              {event.month}
            </p>
            <p className="font-heading text-[clamp(2.4rem,10.4vw,3.4rem)] leading-none">
              {event.day}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-2 text-center">
          <p
            className="mx-auto mb-2 max-w-[26ch] text-[0.8rem] leading-[1.4] text-balance sm:text-sm sm:leading-relaxed"
            style={{ color: theme.accentMutedTextColor }}
          >
            {event.shortDescription}
          </p>

          {hasSecondaryCta ? (
            <div className="grid grid-cols-2 gap-2">
              <Button
                href={secondaryButtonHref}
                onClick={stopCardNavigation}
                className="w-full whitespace-nowrap border border-white/30 !bg-white/12 !px-3 !py-[0.6rem] text-[0.66rem] uppercase tracking-[0.14em] !text-current !shadow-none backdrop-blur-md supports-[backdrop-filter]:!bg-white/12 hover:!bg-white/22 hover:!text-current hover:!opacity-100 hover:!translate-y-0 sm:!px-4 sm:text-[0.76rem]"
              >
                {secondaryCtaLabel}
              </Button>

              <Button
                href={ctaHref}
                onClick={stopCardNavigation}
                className="w-full whitespace-nowrap border border-white/30 !bg-white/16 !px-3 !py-[0.6rem] text-[0.66rem] uppercase tracking-[0.14em] !text-current !shadow-none backdrop-blur-md supports-[backdrop-filter]:!bg-white/16 hover:!bg-white/24 hover:!text-current hover:!opacity-100 hover:!translate-y-0 sm:!px-4 sm:text-[0.76rem]"
              >
                {ctaLabel}
              </Button>
            </div>
          ) : (
            <Button
              href={ctaHref}
              onClick={stopCardNavigation}
              className="w-full whitespace-nowrap border border-white/30 !bg-white/16 !px-4 !py-[0.6rem] text-[0.68rem] uppercase tracking-[0.14em] !text-current !shadow-none backdrop-blur-md supports-[backdrop-filter]:!bg-white/16 hover:!bg-white/24 hover:!text-current hover:!opacity-100 hover:!translate-y-0 sm:!px-[1.375rem] sm:!py-3 sm:text-[0.8rem]"
            >
              {ctaLabel}
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}

export function MobileCalendarGridCard({
  event,
  accentIndex,
  onNavigate,
  description,
  expandDescription = false,
}: {
  event: EventItem
  accentIndex: number
  onNavigate?: () => void
  description?: string
  expandDescription?: boolean
}) {
  const router = useRouter()
  const theme = getEventCardTheme(accentIndex)
  const navigateToEvent = () => {
    scrollToTopInstantly()
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
      className="group relative block aspect-[4/5] w-full cursor-pointer overflow-hidden border shadow-[0_16px_36px_rgba(0,0,0,0.12)]"
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

      <div className="relative flex h-full flex-col p-3">
        <div className="shrink-0 flex items-start justify-start gap-3">
          <MobileEventDateStack
            weekday={event.weekday}
            month={event.month}
            day={event.day}
            mutedTextColor={theme.accentMutedTextColor}
            weekdayClassName="text-[0.58rem] font-semibold uppercase tracking-[0.24em] leading-none"
            monthClassName="mt-1 font-heading text-[1.2rem] leading-none uppercase tracking-[0.16em]"
            dayClassName="font-heading text-[2.25rem] leading-none"
          />
        </div>

        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          <h3 className="max-w-[12ch] font-heading text-[clamp(1rem,4.1vw,1.3rem)] leading-[1.02] text-balance">
            {event.title}
          </h3>

          {description ? (
            <div className="mt-2 flex min-h-0 flex-1 items-start">
              <p
                className={
                  expandDescription
                    ? "mx-auto w-full max-w-[22ch] overflow-hidden text-center text-[0.8rem] leading-[1.5] text-balance sm:max-w-none"
                    : "mx-auto w-full max-w-[18ch] overflow-hidden text-center text-[0.68rem] leading-[1.35] text-balance [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]"
                }
                style={{ color: theme.accentMutedTextColor }}
              >
                {description}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-auto pt-4">
          <Button
            href={event.href}
            onClick={(clickEvent) => {
              stopCardNavigation(clickEvent)
              onNavigate?.()
            }}
            className="w-full border border-white/30 !bg-white/16 !px-3 !py-2.5 text-[0.68rem] uppercase tracking-[0.16em] !text-current !shadow-none backdrop-blur-md supports-[backdrop-filter]:!bg-white/16 hover:!bg-white/24 hover:!text-current hover:!opacity-100 hover:!translate-y-0"
          >
            VIEW EVENT
          </Button>
        </div>
      </div>
    </article>
  )
}
