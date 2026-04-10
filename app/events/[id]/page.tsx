import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Button from "@/components/ui/Button"
import EventPreviewCard from "@/components/events/EventPreviewCard"
import { CalendarIcon } from "@/components/events/mobile/MobileEventShared"
import {
  MobileCalendarGridCard,
} from "@/components/events/mobile/MobileEventWidgets"
import AllUpcomingEventsDrawer from "@/components/events/mobile/AllUpcomingEventsDrawer"
import MobileEventLocationLink from "@/components/events/mobile/MobileEventLocationLink"
import {
  getEventById,
  getRelatedUpcomingEvents,
  mockEvents,
} from "@/app/events/mockEvents"
import { buildEventCalendarFilename } from "@/lib/eventCalendar"
import { getEventCardTheme } from "@/lib/eventCardTheme"
import { truncateToEvenLength } from "@/lib/truncateToEvenLength"

const BUY_TICKETS_BUTTON_CLASS = "bg-black text-white hover:bg-neutral-800 hover:opacity-100"

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "")

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

function hexToRgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function mixHex(baseHex: string, targetHex: string, weight: number) {
  const base = hexToRgb(baseHex)
  const target = hexToRgb(targetHex)
  const mixChannel = (baseChannel: number, targetChannel: number) =>
    Math.round(baseChannel + (targetChannel - baseChannel) * weight)

  return `#${[mixChannel(base.r, target.r), mixChannel(base.g, target.g), mixChannel(base.b, target.b)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`
}

function getRelativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const toLinear = (channel: number) => {
    const normalized = channel / 255
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  }

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current stroke-[1.8]"
    >
      <path d="M5 12h13" />
      <path d="M13 6l5 6-5 6" />
    </svg>
  )
}

type EventDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  return mockEvents.map((event) => ({
    id: event.id,
  }))
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const event = getEventById(id)

  if (!event) {
    return {
      title: "Event Not Found",
    }
  }

  return {
    title: event.title,
    description: event.shortDescription,
  }
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params
  const event = getEventById(id)
  const fallbackEventImage = "/event_temp_bg.png"

  if (!event) {
    notFound()
  }

  const detailImages = [
    ...new Set(
      (event.detailImages && event.detailImages.length > 0
        ? event.detailImages
        : [event.imageSrc ?? fallbackEventImage]
      ).filter(Boolean)
    ),
  ]
  const hasSingleDetailImage = detailImages.length <= 1
  const mobileFlyerImage = detailImages.find((imageSrc) => imageSrc !== fallbackEventImage) ?? null
  const calendarHref =
    event.calendarStart && event.calendarEnd ? `/events/${event.id}/calendar` : null
  const mobileAccentIndex = Math.max(
    mockEvents.findIndex((candidate) => candidate.id === event.id),
    0
  )
  const mobileTheme = getEventCardTheme(mobileAccentIndex)
  const mobileDetailBackgroundColor = mixHex(mobileTheme.accentColor, "#FFFFFF", 0.82)
  const mobileDetailTextColor = getRelativeLuminance(mobileDetailBackgroundColor) < 0.45 ? "#FFFFFF" : "#161616"
  const mobileDetailMutedTextColor = hexToRgba(mobileDetailTextColor, 0.58)
  const mobileDetailBodyTextColor = hexToRgba(mobileDetailTextColor, 0.84)
  const mobileDetailSurfaceColor = hexToRgba(mobileDetailTextColor, 0.04)
  const mobileDetailSurfaceBorderColor = hexToRgba(mobileDetailTextColor, 0.12)
  const mobileDetailBackdrop = [
    `radial-gradient(circle at top left, ${hexToRgba(mobileTheme.accentColor, 0.24)} 0%, transparent 34%)`,
    `radial-gradient(circle at bottom right, ${hexToRgba(mobileTheme.accentColor, 0.18)} 0%, transparent 36%)`,
    `linear-gradient(180deg, ${hexToRgba(mobileTheme.accentColor, 0.08)} 0%, transparent 42%)`,
  ].join(", ")

  const relatedUpcomingEvents = truncateToEvenLength(getRelatedUpcomingEvents(event.id, 8))

  return (
    <div className="bg-background">
      <section
        className="relative overflow-hidden md:hidden"
        style={{ backgroundColor: mobileDetailBackgroundColor }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: mobileDetailBackdrop }}
        />

        <div className="relative mx-auto max-w-3xl px-4 py-4" style={{ color: mobileDetailTextColor }}>
          <div className="space-y-5">
            <div className="relative space-y-2">
              <div className="min-w-0 text-left">
                <h1 className="font-heading text-[clamp(2.8rem,13vw,4.2rem)] leading-[0.84] tracking-[-0.1em]">
                  {event.title}
                </h1>
              </div>
              <div className="text-left">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: mobileDetailMutedTextColor }}>
                  {event.time}
                </p>
                <MobileEventLocationLink
                  location={event.location}
                  className="mt-2 block text-sm leading-relaxed underline-offset-2 transition hover:underline"
                  style={{ color: mobileDetailBodyTextColor }}
                />
              </div>
            </div>

            <div className="max-w-[84%] text-left">
              <p className="mt-2 text-sm leading-relaxed" style={{ color: mobileDetailBodyTextColor }}>
                {event.shortDescription}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#1f6d43]/18 bg-[#dff6e8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1f6d43]">
                  <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                    <path d="M12 2.75l2.56 5.19 5.73.83-4.15 4.04.98 5.71L12 15.84l-5.12 2.68.98-5.71L3.7 8.77l5.73-.83L12 2.75z" />
                  </svg>
                  TAPROOM EVENT
                </span>
                <span
                  className="inline-flex w-fit items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]"
                  style={{
                    borderColor: mobileDetailSurfaceBorderColor,
                    backgroundColor: mobileDetailSurfaceColor,
                    color: mobileDetailMutedTextColor,
                  }}
                >
                  {event.ageRestriction}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                {event.ticketHref && event.status === "upcoming" ? (
                  <Button
                    href={event.ticketHref}
                    className="min-w-0 flex-1 !px-3 !py-3 !text-[0.95rem] !leading-none !tracking-normal !shadow-none hover:opacity-100 hover:translate-y-0"
                    style={{
                      backgroundColor: "#000000",
                      color: "#ffffff",
                    }}
                  >
                    Buy tickets
                  </Button>
                ) : null}

                {calendarHref ? (
                  <Button
                    href={calendarHref}
                    download={buildEventCalendarFilename(event)}
                    className="min-w-0 flex-1 !px-3 !py-3 !text-[0.95rem] !leading-none !tracking-normal !shadow-none hover:opacity-100 hover:translate-y-0"
                    style={{
                      backgroundColor: "transparent",
                      border: "1px solid rgba(0, 0, 0, 0.55)",
                      color: "#000000",
                    }}
                  >
                    <span className="inline-flex items-center gap-2">
                      <CalendarIcon />
                      Add to calendar
                    </span>
                  </Button>
                ) : null}
              </div>
              <AllUpcomingEventsDrawer />
            </div>

            {mobileFlyerImage ? (
              <div className="px-1 pt-2">
                <div className="relative w-full overflow-hidden">
                  <Image
                    src={mobileFlyerImage}
                    alt={`${event.title} flyer`}
                    width={1200}
                    height={1600}
                    className="h-auto w-full object-contain"
                    sizes="100vw"
                    priority
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="relative hidden overflow-hidden md:block">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,164,137,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(116,195,213,0.14),transparent_30%)]" />

        <div className="relative mx-auto max-w-6xl px-6 py-8 lg:py-10">
          <div className="mb-4">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-base font-semibold text-black/70 transition hover:text-black"
            >
              <span aria-hidden="true">&larr;</span>
              Back to events
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,0.9fr)] lg:items-stretch lg:gap-8">
            <div className="flex h-full flex-col">
              {hasSingleDetailImage ? (
                <div className="relative min-h-[320px] overflow-hidden border border-black/10 bg-white shadow-sm lg:h-full lg:min-h-0">
                  <Image
                    src={detailImages[0] ?? fallbackEventImage}
                    alt={event.title}
                    fill
                    className="object-cover object-[center_56%]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 sm:grid-rows-2 lg:h-full">
                  {detailImages.slice(0, 3).map((imageSrc, index) => (
                    <div
                      key={`${event.id}-${imageSrc}-${index}`}
                      className={`relative overflow-hidden border border-black/10 bg-white shadow-sm ${
                        index === 0
                          ? "min-h-[280px] sm:row-span-2 lg:h-full lg:min-h-0"
                          : "min-h-[165px] lg:min-h-0"
                      }`}
                    >
                      <Image
                        src={imageSrc}
                        alt={`${event.title} image ${index + 1}`}
                        fill
                        className="object-cover object-[center_56%]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index === 0}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex h-full flex-col border border-black/10 bg-surface p-6 shadow-sm lg:p-7">
              <div className="flex w-full flex-1 flex-col">
                <h1 className="mt-3 text-center font-heading text-3xl leading-none md:text-4xl">
                  {event.title}
                </h1>
                <div className="mt-4 text-center text-base leading-relaxed text-black/80 md:text-lg">
                  <p>{event.time}</p>
                  <p>{event.location}</p>
                </div>
                <p className="mt-5 max-w-xl self-center text-center text-base leading-relaxed text-black/85 md:text-lg">
                  {event.longDescription}
                </p>

                <dl className="mt-6 grid w-full gap-4 border-t border-black/10 pt-5 sm:grid-cols-2">
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/50">
                      Event Type
                    </dt>
                    <dd className="mt-1 text-sm text-black/80">{event.eventType}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/50">
                      Age
                    </dt>
                    <dd className="mt-1 text-sm text-black/80">{event.ageRestriction}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/50">
                      Date
                    </dt>
                    <dd className="mt-1 text-sm text-black/80">
                      {event.weekday}, {event.month} {event.day}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/50">
                      Taproom Notes
                    </dt>
                    <dd className="mt-1 text-sm text-black/80">{event.shortDescription}</dd>
                  </div>
                </dl>

                <div className="mt-auto flex flex-wrap justify-center gap-3 border-t border-black/10 pt-5">
                  {event.ticketHref && event.status === "upcoming" ? (
                    <Button
                      href={event.ticketHref}
                      className={BUY_TICKETS_BUTTON_CLASS}
                    >
                      Buy tickets
                    </Button>
                  ) : null}
                  <Button
                    href="/events"
                    variant="secondary"
                    className="border-black text-black hover:bg-black hover:text-white"
                  >
                    View all events
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="more-events"
        className="py-4 md:hidden"
        style={{ backgroundColor: mobileDetailBackgroundColor }}
      >
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-4 border-b border-black/10 pb-4">
            <h2 className="max-w-[8.5ch] font-heading text-[clamp(3rem,16vw,6rem)] uppercase leading-[0.84] tracking-[-0.08em] text-balance text-black">
              UPCOMING EVENTS
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {relatedUpcomingEvents.map((relatedEvent, index) => (
              <MobileCalendarGridCard
                key={relatedEvent.id}
                event={relatedEvent}
                accentIndex={index}
              />
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-black/80 transition hover:text-black"
            >
              <span>VIEW ALL EVENTS</span>
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="hidden border-t border-black/10 bg-white/50 py-12 md:block">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
                More To Explore
              </p>
              <h2 className="mt-2 font-heading text-3xl leading-tight">Upcoming Events</h2>
            </div>
            <Link href="/events" className="text-sm font-semibold text-black/70 transition hover:text-black">
              View all events
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4">
            {relatedUpcomingEvents.map((relatedEvent, index) => (
              <div key={relatedEvent.id} className="min-w-[280px] max-w-[280px] flex-none">
                <EventPreviewCard event={relatedEvent} accentIndex={index} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
