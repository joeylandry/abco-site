import type { Metadata } from "next"
import BreweryLocationWidget from "@/components/location/BreweryLocationWidget"
import VisitHeader from "@/components/page-headers/VisitHeader"
import VisitAnnoucment from "@/components/home/VisitAnnoucment"
import VisitMobileAnnoucment from "@/components/home/VisitMobileAnnoucment"

export const metadata: Metadata = {
  title: "Visit",
  description: "Get the latest on ABCo's future home in Arlington.",
}

export default function VisitPage() {
  return (
    <>
      <VisitHeader />
      <VisitAnnoucment />
      <VisitMobileAnnoucment />

      <main className="bg-background">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 sm:py-14 md:items-start md:grid-cols-[minmax(0,1.15fr)_minmax(320px,360px)]">
          <section className="md:pr-8">
            <div className="mx-auto max-w-2xl">
              <div className="space-y-5 text-sm leading-7 text-foreground/80 sm:text-base">
                <p>
                  After more than 4 years of searching for the perfect space, a year of slinging beers at pop-ups, and
                  fielding countless &ldquo;So, are you ever going to get your own space?&rdquo; questions, we are
                  thrilled to finally say: the wait is over.
                </p>

                <p>
                  Coming in 2026, we&apos;re excited to open our brand-new home at 15 Ryder St, Arlington, MA.
                </p>

                <p>
                  This space will feature a full-sized production brewery, taproom, kitchen, beer garden, and plenty of
                  room for you to gather with friends, neighbors, and fellow beer lovers.
                </p>

                <p>
                  There&apos;s a lot of work ahead: design, permits, construction, menu development, hiring, just to
                  name a few. We hope you&apos;ll join us on this exciting journey.
                </p>
              </div>
            </div>
          </section>

          <aside className="space-y-6 md:w-full md:justify-self-end">
            <section className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/55">Address</p>
              <p className="mt-4 font-heading text-2xl leading-tight text-foreground">
                15 Ryder St
                <br />
                Arlington, MA 02476
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=15+Ryder+St+Arlington+MA+02476"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center text-sm font-semibold uppercase tracking-[0.18em] text-foreground transition hover:opacity-65"
              >
                Open in Google Maps
              </a>
            </section>

            <BreweryLocationWidget compact />
          </aside>
        </div>
      </main>
    </>
  )
}
