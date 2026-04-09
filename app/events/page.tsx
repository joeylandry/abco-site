import EventsPageContent from "@/components/events/EventsPageContent"
import MobileEventsPage from "@/components/events/mobile/MobileEventsPage"
import EventsHeader from "@/components/page-headers/EventsHeader"
import MobileEventsHeader from "@/components/page-headers/MobileEventsHeader"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events at ABCo.",
}

export default function EventsPage() {
  return (
    <>
      <div className="hidden md:block">
        <EventsHeader />

        <EventsPageContent />
      </div>

      <div className="md:hidden">
        <MobileEventsHeader />
      </div>

      <MobileEventsPage />
    </>
  )
}
