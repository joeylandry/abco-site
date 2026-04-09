import BookAnEventHeader from "@/components/page-headers/BookAnEventHeader"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book an Event",
  description: "Beer catering services from ABCo for private parties, corporate events, and community gatherings.",
}

export default function BookAnEventPage() {
  return (
    <>
      <BookAnEventHeader />

      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[1fr_1.05fr] lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/60">
              Beer Catering Services
            </p>

            <h2 className="mt-4 font-heading text-3xl leading-tight text-foreground sm:text-4xl">
              Let us bring the bar to you.
            </h2>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-foreground/75 sm:text-base">
              Why book an expensive event space and pay for services you don&apos;t
              need? Let us bring the bar to you! From birthday parties and corporate
              celebrations to community gatherings and fundraisers, we believe every
              event is better with great beer.
            </p>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-foreground/75 sm:text-base">
              We offer full-service beer catering tailored to your needs and budget,
              including:
            </p>

            <ul className="mt-5 space-y-3 text-sm text-foreground/85 sm:text-base">
              <li className="rounded-2xl border border-black/10 bg-surface px-5 py-4">
                Permitting
              </li>
              <li className="rounded-2xl border border-black/10 bg-surface px-5 py-4">
                TIPS-certified bartenders
              </li>
              <li className="rounded-2xl border border-black/10 bg-surface px-5 py-4">
                Insurance
              </li>
            </ul>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-foreground/75 sm:text-base">
              Whether you&apos;re hosting an intimate gathering of 50 or a large
              celebration with 500+ guests, we&apos;ve got you covered in any season,
              indoors or out. Our mobile bars transform any space into a lively and
              memorable venue, with options for beer in cans or on draft.
            </p>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-foreground/75 sm:text-base">
              Ready to elevate your event? Fill out the form to get started!
            </p>
          </div>

          <div className="rounded-[28px] border border-black/10 bg-surface p-6 shadow-sm sm:p-8">
            <form className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-foreground">
                    First Name
                  </span>
                  <span className="ml-1 text-xs text-foreground/55">(required)</span>
                  <input
                    type="text"
                    required
                    className="mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-black/35"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-foreground">
                    Last Name
                  </span>
                  <span className="ml-1 text-xs text-foreground/55">(required)</span>
                  <input
                    type="text"
                    required
                    className="mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-black/35"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-foreground">
                  Organization
                </span>
                <input
                  type="text"
                  className="mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-black/35"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-foreground">Email</span>
                <span className="ml-1 text-xs text-foreground/55">(required)</span>
                <input
                  type="email"
                  required
                  className="mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-black/35"
                />
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-black/20 text-foreground focus:ring-foreground/30"
                />
                <span className="text-sm text-foreground/80">
                  Sign up for news and updates
                </span>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-foreground">Phone</span>
                <span className="ml-1 text-xs text-foreground/55">(required)</span>
                <input
                  type="tel"
                  required
                  className="mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-black/35"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-foreground">
                  Event Description
                </span>
                <span className="ml-1 text-xs text-foreground/55">(required)</span>
                <textarea
                  required
                  rows={5}
                  className="mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-black/35"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-foreground">
                  Estimated Number of Attendees
                </span>
                <span className="ml-1 text-xs text-foreground/55">(required)</span>
                <input
                  type="number"
                  min="1"
                  required
                  className="mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-black/35"
                />
              </label>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-foreground">
                    Event Date
                  </span>
                  <span className="ml-1 text-xs text-foreground/55">(required)</span>
                  <input
                    type="date"
                    required
                    className="mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-black/35"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-foreground">
                    Event Time
                  </span>
                  <span className="ml-1 text-xs text-foreground/55">(required)</span>
                  <input
                    type="time"
                    required
                    className="mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-black/35"
                  />
                  <p className="mt-2 text-xs text-foreground/60">
                    Please enter expected event start time in Eastern Time.
                  </p>
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-foreground">
                  Event Location
                </span>
                <span className="ml-1 text-xs text-foreground/55">(required)</span>
                <input
                  type="text"
                  required
                  className="mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-black/35"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-foreground">
                  Additional Information
                </span>
                <textarea
                  rows={4}
                  className="mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-black/35"
                />
              </label>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:-translate-y-0.5 hover:opacity-95"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
