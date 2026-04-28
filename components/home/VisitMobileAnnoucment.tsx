import Button from "@/components/ui/Button"

export default function VisitMobileAnnoucment() {
  return (
    <section className="border-t border-black/10 bg-background py-4 md:hidden">
      <div className="mx-auto max-w-md px-4">
        <article className="rounded-[2.1rem] border border-black/8 bg-white shadow-[0_24px_60px_-36px_rgba(0,0,0,0.28)]">
          <div className="p-5">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-black/45">
              Opening in 2026
            </p>

            <h2 className="mt-2 font-heading text-[clamp(1.75rem,7vw,2.35rem)] leading-tight text-black">
              We&apos;re building a brand-new taproom at 15 Ryder St.
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-black/70">
              After years of pop-ups, we&apos;re thrilled to finally put down roots in Arlington. Follow along for
              build updates, events, and fresh releases as we get ready to open our doors.
            </p>

            <div className="mt-5">
              <Button href="/visit" className="bg-black text-white hover:bg-neutral-800 hover:opacity-100">
                Learn more
              </Button>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
