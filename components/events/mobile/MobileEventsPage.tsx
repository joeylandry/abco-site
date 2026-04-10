"use client"

import { upcomingEvents } from "@/app/events/mockEvents"
import { MobileEventWidget } from "@/components/events/mobile/MobileEventWidgets"
import AllUpcomingEventsDrawer from "@/components/events/mobile/AllUpcomingEventsDrawer"

const featuredMobileEvents = upcomingEvents.slice(0, 3)

export default function MobileEventsPage() {
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
              />
            ))}
          </div>

          <AllUpcomingEventsDrawer className="mt-5" />
        </div>
      </section>
    </>
  )
}
