import EventsPageContent from "@/components/events/EventsPageContent"
import MobileEventsPage from "@/components/events/mobile/MobileEventsPage"
import EventsHeader from "@/components/page-headers/EventsHeader"
import MobileEventsHeader from "@/components/page-headers/MobileEventsHeader"
import type { Metadata } from "next"
import { getEventsSnapshot } from "@/lib/events"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events at ABCo.",
}

export default async function EventsPage() {
  const { upcomingEvents, pastEvents } = await getEventsSnapshot()

  return (
    <>
      <div className="hidden md:block">
        <EventsHeader />

        <EventsPageContent upcomingEvents={upcomingEvents} pastEvents={pastEvents} />
      </div>

      <div className="md:hidden">
        <MobileEventsHeader />
      </div>

      <MobileEventsPage upcomingEvents={upcomingEvents} />
    </>
  )
}
