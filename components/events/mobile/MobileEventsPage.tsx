"use client"

import type { EventItem } from "@/lib/eventTypes"
import { MobileEventWidget } from "@/components/events/mobile/MobileEventWidgets"
import AllUpcomingEventsDrawer from "@/components/events/mobile/AllUpcomingEventsDrawer"

type MobileEventsPageProps = {
  upcomingEvents: EventItem[]
}

export default function MobileEventsPage({ upcomingEvents }: MobileEventsPageProps) {
  const featuredMobileEvents = upcomingEvents.slice(0, 3)

  return (
    <>
      <section className="bg-background text-foreground md:hidden">
        <div className="w-full px-3 py-4 pb-6">
          <div className="flex flex-col gap-4">
            {featuredMobileEvents.map((event, index) => (
              <MobileEventWidget
                key={event.id}
                event={event}
                label={index === 0 ? "Next Event" : "Upcoming Event"}
                accentIndex={index}
                interactive
                badgeCompact
              />
            ))}
          </div>

          <AllUpcomingEventsDrawer className="mt-5" events={upcomingEvents} />
        </div>
      </section>
    </>
  )
}
