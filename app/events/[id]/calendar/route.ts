import { getEventById } from "@/app/events/mockEvents"
import { buildEventCalendarFilename, buildEventCalendarIcs } from "@/lib/eventCalendar"

type CalendarRouteParams = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_: Request, { params }: CalendarRouteParams) {
  const { id } = await params
  const event = getEventById(id)

  if (!event) {
    return new Response("Event not found", { status: 404 })
  }

  const calendar = buildEventCalendarIcs(event)

  if (!calendar) {
    return new Response("Calendar entry not available", { status: 404 })
  }

  return new Response(calendar, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${buildEventCalendarFilename(event)}"`,
      "Cache-Control": "public, max-age=3600",
    },
  })
}
