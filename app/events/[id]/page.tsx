import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Button from "@/components/ui/Button"
import EventPreviewCard from "@/components/events/EventPreviewCard"
import {
  getEventById,
  getRelatedUpcomingEvents,
  mockEvents,
} from "@/app/events/mockEvents"

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

  const relatedUpcomingEvents = getRelatedUpcomingEvents(event.id, 8)

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden">
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
                      className="bg-black text-white hover:bg-black/90 hover:opacity-100"
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

      <section className="border-t border-black/10 bg-white/50 py-12">
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
