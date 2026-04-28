import { upcomingEvents } from "@/app/events/mockEvents"
import { MobileEventWidget } from "@/components/events/mobile/MobileEventWidgets"

const nextEvent = upcomingEvents[0]

export default function HomeMobileNextEvent() {
  if (!nextEvent) {
    return null
  }

  return (
    <section className="bg-background py-4 md:hidden">
      <div className="w-full px-3">
        <MobileEventWidget
          event={nextEvent}
          label="Next Event"
          accentIndex={0}
          interactive
          contentStretch
          dateCompact
        />
      </div>
    </section>
  )
}
