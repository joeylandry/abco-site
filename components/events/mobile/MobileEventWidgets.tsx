"use client"

import Button from "@/components/ui/Button"
import type { CSSProperties } from "react"
import { useState } from "react"
import type { EventItem } from "@/app/events/mockEvents"
import { getEventCardTheme } from "@/lib/eventCardTheme"
import {
  MobileEventBadge,
  MobileEventDateStack,
  formatMobileEventBackDate,
} from "@/components/events/mobile/MobileEventShared"

const BACK_TITLE_CLAMP_STYLE: CSSProperties = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
}

const EVENT_CARD_BACKDROP =
  "radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 34%), radial-gradient(circle at bottom right, rgba(255,255,255,0.08), transparent 32%), linear-gradient(135deg, rgba(255,255,255,0.12), transparent 30%, rgba(0,0,0,0.06))"

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current stroke-[1.9]"
    >
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  )
}

export function MobileEventWidget({
  event,
  label,
  accentIndex,
  ctaLabel = "Learn more",
  ctaHref = event.href,
  secondaryCtaLabel,
  secondaryCtaHref,
}: {
  event: EventItem
  label: string
  accentIndex: number
  ctaLabel?: string
  ctaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
}) {
  const theme = getEventCardTheme(accentIndex)
  const hasSecondaryCta = Boolean(secondaryCtaLabel && secondaryCtaHref)
  const secondaryButtonHref = secondaryCtaHref ?? ctaHref

  return (
    <article
      className="relative isolate mx-auto aspect-square w-full max-w-[20.5rem] overflow-hidden border shadow-[0_24px_60px_-36px_rgba(0,0,0,0.5)]"
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
                className="w-full whitespace-nowrap border border-white/30 !bg-white/12 !px-3 !py-[0.6rem] text-[0.66rem] uppercase tracking-[0.14em] !text-current !shadow-none backdrop-blur-md supports-[backdrop-filter]:!bg-white/12 hover:!bg-white/22 hover:!text-current hover:!opacity-100 hover:!translate-y-0 sm:!px-4 sm:text-[0.76rem]"
              >
                {secondaryCtaLabel}
              </Button>

              <Button
                href={ctaHref}
                className="w-full whitespace-nowrap border border-white/30 !bg-white/16 !px-3 !py-[0.6rem] text-[0.66rem] uppercase tracking-[0.14em] !text-current !shadow-none backdrop-blur-md supports-[backdrop-filter]:!bg-white/16 hover:!bg-white/24 hover:!text-current hover:!opacity-100 hover:!translate-y-0 sm:!px-4 sm:text-[0.76rem]"
              >
                {ctaLabel}
              </Button>
            </div>
          ) : (
            <Button
              href={ctaHref}
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
}: {
  event: EventItem
  accentIndex: number
  onNavigate?: () => void
}) {
  const [isFlipped, setIsFlipped] = useState(false)
  const theme = getEventCardTheme(accentIndex)

  return (
    <article
      className="group relative block aspect-square overflow-hidden border shadow-[0_16px_36px_rgba(0,0,0,0.12)] [perspective:1200px]"
      style={{
        backgroundColor: theme.accentColor,
        borderColor: theme.railBorderColor,
        color: theme.accentTextColor,
      }}
    >
      <div
        className={`relative h-full w-full transition-transform duration-500 ease-out [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <button
          type="button"
          aria-label={`Open details for ${event.title}`}
          aria-expanded={isFlipped}
          onClick={() => setIsFlipped(true)}
          className="absolute inset-0 block h-full w-full text-left"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-100"
            style={{ backgroundImage: EVENT_CARD_BACKDROP }}
          />

          <div className="relative flex h-full flex-col items-center justify-center p-3 text-center">
            <MobileEventDateStack
              weekday={event.weekday}
              month={event.month}
              day={event.day}
              mutedTextColor={theme.accentMutedTextColor}
              weekdayClassName="text-[0.6rem] font-semibold uppercase tracking-[0.24em]"
              monthClassName="font-heading text-[1.25rem] leading-none uppercase tracking-[0.16em]"
              dayClassName="font-heading text-[2.35rem] leading-none"
            />

            <p
              className="mt-4 text-[0.68rem] font-semibold uppercase tracking-[0.22em]"
              style={{ color: theme.accentMutedTextColor }}
            >
              Tap for details
            </p>
          </div>
        </button>

        <div
          aria-hidden={!isFlipped}
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          onClick={() => setIsFlipped(false)}
        >
          <button
            type="button"
            aria-label={`Close details for ${event.title}`}
            onClick={(clickEvent) => {
              clickEvent.stopPropagation()
              setIsFlipped(false)
            }}
            className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/20 text-current shadow-[0_10px_24px_rgba(0,0,0,0.18)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-black/30"
          >
            <CloseIcon />
          </button>

          <div
            className="pointer-events-none absolute inset-0 opacity-100"
            style={{ backgroundImage: EVENT_CARD_BACKDROP }}
          />

          <div className="relative flex h-full flex-col items-center justify-start px-4 pt-14 pb-4 text-center">
            <div className="flex w-full max-w-[calc(100%-2.5rem)] flex-col items-center">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.26em] leading-tight text-black">
                {formatMobileEventBackDate(event.weekday, event.month, event.day)}
              </p>

              <p
                className="mt-1 text-[0.68rem] font-semibold tracking-[0.08em] leading-[0.96] text-balance"
                style={{
                  color: theme.accentMutedTextColor,
                  ...BACK_TITLE_CLAMP_STYLE,
                }}
              >
                {event.title}
              </p>
            </div>

            <div className="mt-auto pt-4">
              <Button
                href={event.href}
                onClick={(clickEvent) => {
                  clickEvent.stopPropagation()
                  onNavigate?.()
                }}
                className="border border-white/30 !bg-white/16 !px-5 !py-2.5 text-[0.78rem] uppercase tracking-[0.18em] !text-current !shadow-none backdrop-blur-md supports-[backdrop-filter]:!bg-white/16 hover:!bg-white/24 hover:!text-current hover:!opacity-100 hover:!translate-y-0"
              >
                VIEW EVENT
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
