import Button from "@/components/ui/Button"
import BreweryLocationWidget from "@/components/location/BreweryLocationWidget"
import Image from "next/image"

export default function VisitAnnoucment() {
  return (
    <section className="hidden border-t border-black/10 bg-background py-12 md:block">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
              Opening in 2026
            </p>
            <h2 className="mt-2 font-heading text-3xl leading-tight">
              We&apos;re building a brand-new taproom at 15 Ryder St.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/70">
              After years of pop-ups, we&apos;re thrilled to finally put down roots in Arlington. Follow along for
              build updates, events, and fresh releases as we get ready to open our doors.
            </p>
          </div>
          <div className="shrink-0">
          <Button
  href="/visit"
  variant="secondary"
  className="border-black bg-transparent text-black hover:bg-black/5 hover:text-black"
>
  Call now
</Button>

          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(320px,420px)] md:items-start">
          <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-black/5 shadow-sm">
            <div className="relative h-[320px] w-full sm:h-[360px]">
              <Image
                src="/tap_temp.png"
                alt="Concept rendering of the new taproom at 15 Ryder St."
                fill
                sizes="(min-width: 1024px) 640px, (min-width: 768px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="md:justify-self-end md:w-full">
            <BreweryLocationWidget compact />
          </div>
        </div>
      </div>
    </section>
  )
}
