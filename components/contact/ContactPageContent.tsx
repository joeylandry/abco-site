"use client"

import { useEffect, useState, type MouseEvent } from "react"
import BreweryLocationWidget from "@/components/location/BreweryLocationWidget"

const FACEBOOK_URL = "https://www.facebook.com/ArlingtonBrewingCompany"
const NEWSLETTER_SIGNUP_URL = "https://www.drinkarlingtonbeer.com/newsletter"

const inputClassName =
  "mt-2 w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-black/35"

export default function ContactPageContent() {
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false)

  useEffect(() => {
    if (!isNewsletterOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsNewsletterOpen(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [isNewsletterOpen])

  const openNewsletterModal = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setIsNewsletterOpen(true)
  }

  return (
    <>
      <main className="bg-background">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
          <div className="grid gap-12 md:grid-cols-[minmax(0,0.95fr)_minmax(340px,1.05fr)]">
            <section className="rounded-[28px] border border-black/10 bg-surface p-7 shadow-sm sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/60">
                Reach Out
              </p>

              <h2 className="mt-4 font-heading text-3xl leading-tight text-foreground sm:text-4xl">
                Questions, wholesale inquiries, and community notes.
              </h2>

              <div className="mt-6 space-y-5 text-sm leading-relaxed text-foreground/80 sm:text-base">
                <p>
                  <strong>Are you interested in selling our beer?</strong> We self distribute, so reach out and let us
                  know!
                </p>

                <p>
                  <strong>Are you interested in sharing something or asking a question?</strong> We love to connect
                  with our community. Tell us how we&apos;re doing or ask us anything.
                </p>

                <p>
                  Don&apos;t forget to follow us on{" "}
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-foreground underline decoration-black/30 underline-offset-4 transition hover:decoration-black"
                  >
                    Facebook
                  </a>{" "}
                  and sign up for our{" "}
                  <a
                    href="#newsletter-popup"
                    aria-controls="newsletter-popup"
                    onClick={openNewsletterModal}
                    className="font-semibold text-foreground underline decoration-black/30 underline-offset-4 transition hover:decoration-black"
                  >
                    newsletter
                  </a>
                  .
                </p>
              </div>
            </section>

            <section className="rounded-[28px] border border-black/10 bg-surface p-6 shadow-sm sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/60">
                Send a Message
              </p>

              <form className="mt-6 space-y-6">
                <div>
                  <span className="text-sm font-semibold text-foreground">Name</span>
                  <div className="mt-3 grid gap-6 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-semibold text-foreground">
                        First Name
                      </span>
                      <span className="ml-1 text-xs text-foreground/55">(required)</span>
                      <input type="text" required className={inputClassName} />
                    </label>

                    <label className="block">
                      <span className="text-sm font-semibold text-foreground">
                        Last Name
                      </span>
                      <span className="ml-1 text-xs text-foreground/55">(required)</span>
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
                  <span className="text-sm font-semibold text-foreground">Subject</span>
                  <span className="ml-1 text-xs text-foreground/55">(required)</span>
                  <input type="text" required className={inputClassName} />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-foreground">Message</span>
                  <span className="ml-1 text-xs text-foreground/55">(required)</span>
                  <textarea required rows={6} className={inputClassName} />
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:-translate-y-0.5 hover:opacity-95"
                >
                  Submit
                </button>
              </form>
            </section>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)]">
            <section className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/55">
                Future Home
              </p>
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

            <aside>
              <BreweryLocationWidget compact />
            </aside>
          </div>
        </div>
      </main>

      {isNewsletterOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6"
          onClick={() => setIsNewsletterOpen(false)}
        >
          <div
            id="newsletter-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="newsletter-popup-title"
            className="w-full max-w-xl rounded-[32px] border border-black/10 bg-[#fbf6ef] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground/60">
                  Newsletter
                </p>
                <h2
                  id="newsletter-popup-title"
                  className="mt-3 font-heading text-3xl leading-tight text-foreground sm:text-4xl"
                >
                  Follow our journey
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsNewsletterOpen(false)}
                className="shrink-0 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70 transition hover:bg-black/5"
              >
                Close
              </button>
            </div>

            <p className="mt-6 max-w-lg text-sm leading-relaxed text-foreground/75 sm:text-base">
              Our newsletter serves up brewery news, events, release dates, and more.
            </p>

            <a
              href={NEWSLETTER_SIGNUP_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => setIsNewsletterOpen(false)}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold tracking-wide text-white transition hover:-translate-y-0.5 hover:opacity-95"
            >
              Subscribe Now
            </a>
          </div>
        </div>
      ) : null}
    </>
  )
}
