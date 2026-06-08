import type { EventItem } from "@/lib/eventTypes"
import { MobileEventWidget } from "@/components/events/mobile/MobileEventWidgets"

type HomeMobileNextEventProps = {
  nextEvent: EventItem | null
}

export default function HomeMobileNextEvent({ nextEvent }: HomeMobileNextEventProps) {
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
