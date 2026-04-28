import Link from "next/link"
import type { EventItem } from "@/app/events/mockEvents"
import { getEventCardTheme } from "@/lib/eventCardTheme"

export default function EventPreviewCard({
  event,
  accentIndex = 0,
  showDescription = true,
}: {
  event: EventItem
  accentIndex?: number
  showDescription?: boolean
}) {
  const theme = getEventCardTheme(accentIndex)

  return (
    <Link
      href={event.href}
      className="group block h-full overflow-hidden border border-black/10 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1"
      aria-label={`View details for ${event.title}`}
    >
      <article className="flex h-full flex-col sm:flex-row">
        <div
          className="flex min-w-[104px] shrink-0 flex-row items-center justify-center gap-4 px-4 py-4 text-center sm:flex-col sm:gap-1.5 sm:border-r sm:px-5"
          style={{
            backgroundColor: theme.accentColor,
            borderColor: theme.railBorderColor,
            color: theme.accentTextColor,
          }}
        >
          <p
            className="text-[9px] font-semibold uppercase tracking-[0.18em] sm:text-[10px]"
            style={{ color: theme.accentMutedTextColor }}
          >
            {event.weekday}
          </p>
          <p className="font-heading text-2xl leading-none uppercase sm:text-3xl">
            {event.month}
          </p>
          <p className="font-heading text-4xl leading-none sm:text-5xl">{event.day}</p>
        </div>

        <div
          className={`flex flex-1 flex-col items-center bg-white px-5 py-4 text-center ${
            showDescription ? "" : "justify-center"
          }`}
        >
          <h3 className="font-heading text-2xl leading-tight">
            {event.title}
          </h3>
          {showDescription ? (
            <p className="mt-2 max-w-[32rem] text-sm leading-snug text-black/75">
              {event.shortDescription}
            </p>
          ) : null}
        </div>
      </article>
    </Link>
  )
}
