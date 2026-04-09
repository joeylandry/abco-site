"use client"

import { useEffect, useState } from "react"

const roleHighlights = [
  "Deliver kegs, cases, and packaged beer safely and accurately to local accounts.",
  "Build relationships with bars, restaurants, and retailers through strong service and communication.",
  "Help grow the business by identifying new accounts and supporting sales outreach.",
  "Handle physical delivery work, including loading, unloading, and moving heavy kegs.",
  "Work independently, stay organized on route, and represent the brewery professionally.",
  "Must be 21+ with a valid driver's license and clean driving record.",
] as const

const inputClassName =
  "mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-black/35"

export default function JobsPageContent() {
  const [activeModal, setActiveModal] = useState<"delivery" | "general" | null>(
    null
  )

  useEffect(() => {
    if (!activeModal) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveModal(null)
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [activeModal])

  return (
    <>
      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[1fr_1.05fr] lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/60">
              Join Arlington Brewing Company
            </p>

            <h2 className="mt-4 font-heading text-3xl leading-tight text-foreground sm:text-4xl">
              Help us spread joy through beer and hospitality.
            </h2>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-foreground/75 sm:text-base">
              At Arlington Brewing Company, our mission is to spread joy in our
              community and beyond by serving a memorable experience focused on
              incredible craft beer, and authentic human connections.
            </p>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-foreground/75 sm:text-base">
              If you share our passion for great beer and serving others, we&apos;d
              love to work with you. Check out the open positions below and apply
              by filling out the form.
            </p>

            <div className="mt-8 rounded-[28px] border border-black/10 bg-surface p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/55">
                Current Openings
              </p>

              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={() => setActiveModal("delivery")}
                  className="flex w-full items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4 text-left text-sm text-foreground/85 transition hover:-translate-y-0.5 hover:border-black/20 sm:text-base"
                >
                  <span>Delivery Driver and Sales Rep - Part Time</span>
                  <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/55">
                    View Role
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveModal("general")}
                  className="flex w-full items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white px-5 py-4 text-left text-sm text-foreground/85 transition hover:-translate-y-0.5 hover:border-black/20 sm:text-base"
                >
                  <span>General Inquiry</span>
                  <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/55">
                    Learn More
                  </span>
                </button>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-foreground/65">
                Ready to apply? Use the form on the right.
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-black/10 bg-surface p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/60">
              Apply Here
            </p>

            <form className="mt-6 space-y-6">
              <div>
                <span className="text-sm font-semibold text-foreground">Name</span>
                <div className="mt-3 grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-semibold text-foreground">
                      First Name
                    </span>
                    <span className="ml-1 text-xs text-foreground/55">
                      (required)
                    </span>
                    <input type="text" required className={inputClassName} />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-foreground">
                      Last Name
                    </span>
                    <span className="ml-1 text-xs text-foreground/55">
                      (required)
                    </span>
                    <input type="text" required className={inputClassName} />
                  </label>
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-foreground">Email</span>
                <span className="ml-1 text-xs text-foreground/55">(required)</span>
                <input type="email" required className={inputClassName} />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-foreground">Phone</span>
                <span className="ml-1 text-xs text-foreground/55">(required)</span>
                <input type="tel" required className={inputClassName} />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-foreground">
                  Which job are you applying for?
                </span>
                <select defaultValue="" className={inputClassName}>
                  <option value="" disabled>
                    Select a position
                  </option>
                  <option value="delivery-driver-sales-rep-part-time">
                    Delivery Driver and Sales Rep - Part Time
                  </option>
                  <option value="general-inquiry">General Inquiry</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-foreground">
                  Message
                </span>
                <textarea rows={5} className={inputClassName} />
              </label>

              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-foreground">
                    Resume
                  </span>
                  <span className="ml-1 text-xs text-foreground/55">
                    (required)
                  </span>
                  <input
                    type="file"
                    required
                    className={`${inputClassName} file:mr-4 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:opacity-95`}
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-foreground">
                    Cover Letter
                  </span>
                  <input
                    type="file"
                    className={`${inputClassName} file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-foreground file:shadow-sm hover:file:bg-black/5`}
                  />
                </label>
              </div>

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

      {activeModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6"
          onClick={() => setActiveModal(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={
              activeModal === "delivery"
                ? "Delivery Driver and Sales Rep details"
                : "General inquiry details"
            }
            className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/60">
                  {activeModal === "delivery"
                    ? "Delivery Driver and Sales Rep - Part Time"
                    : "General Inquiry"}
                </p>
                <h2 className="mt-3 font-heading text-3xl leading-tight text-foreground sm:text-4xl">
                  {activeModal === "delivery"
                    ? "Beer Delivery Driver & Sales Representative"
                    : "Let’s Keep in Touch"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="shrink-0 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70 transition hover:bg-black/5"
              >
                Close
              </button>
            </div>

            {activeModal === "delivery" ? (
              <div className="mt-8 space-y-8">
                <p className="max-w-3xl text-sm leading-relaxed text-foreground/75 sm:text-base">
                  We are seeking a reliable, self-motivated Beer Delivery Driver
                  &amp; Sales Representative to join our distribution team. This
                  part-time role combines hands-on delivery of kegs and cases of
                  beer with proactive sales outreach to expand our customer base.
                </p>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-black/10 bg-white px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/55">
                      Compensation
                    </p>
                    <p className="mt-2 font-heading text-2xl text-foreground">
                      $20/Hour
                    </p>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-white px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/55">
                      Schedule
                    </p>
                    <p className="mt-2 font-heading text-2xl text-foreground">
                      15-20 Hrs/Week
                    </p>
                  </div>
                  <div className="rounded-2xl border border-black/10 bg-white px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/55">
                      Status
                    </p>
                    <p className="mt-2 font-heading text-2xl text-foreground">
                      Part Time
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-foreground/55">
                    Role Highlights
                  </h3>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {roleHighlights.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-sm leading-relaxed text-foreground/85"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-8 max-w-3xl text-sm leading-relaxed text-foreground/75 sm:text-base">
                We&apos;re always up for meeting great people and you never know
                what might come up in the future. Drop us a line and say hi any
                time through the form on this page.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}
