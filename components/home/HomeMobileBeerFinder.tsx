"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { HOME_MOBILE_BEER_FINDER_ICON_SRC } from "@/components/beer/mobileBeerArtwork"

const ZIP_CODE_PATTERN = /^\d{5}$/

function isCompleteZipCode(value: string) {
  return ZIP_CODE_PATTERN.test(value.trim())
}

export default function HomeMobileBeerFinder() {
  const router = useRouter()
  const [zipCode, setZipCode] = useState("")

  const trimmedZipCode = zipCode.trim()
  const isValidZipCode = isCompleteZipCode(trimmedZipCode)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isValidZipCode) {
      return
    }

    const params = new URLSearchParams()
    params.set("zip", trimmedZipCode)

    router.push(`/beer-finder?${params.toString()}`)
  }

  function handleNearMe() {
    router.push("/beer-finder")
  }

  return (
    <section className="overflow-x-hidden bg-background text-foreground md:hidden">
      <div className="w-full px-0 py-11">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 sm:px-6">
          <div className="flex items-end justify-between gap-3">
            <h2 className="max-w-[56%] font-heading text-[clamp(4.1rem,20vw,6.5rem)] uppercase leading-[0.8] tracking-[-0.1em] text-black">
              <span className="flex flex-col gap-6">
                <span className="block">FIND</span>
                <span className="block">OUR</span>
                <span className="block">BEER!</span>
              </span>
            </h2>

            <div className="pointer-events-none relative -mr-4 h-[clamp(220px,60vw,324px)] w-[clamp(146px,44vw,224px)] shrink-0 self-end">
              <Image
                src={HOME_MOBILE_BEER_FINDER_ICON_SRC}
                alt=""
                fill
                sizes="(max-width: 768px) 44vw, 224px"
                className="origin-bottom-right object-contain rotate-[3deg]"
                priority={false}
              />
            </div>
          </div>

          <form className="flex items-center gap-2" onSubmit={handleSubmit} noValidate>
            <label className="min-w-0 flex-1">
              <span className="sr-only">ZIP code</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                enterKeyHint="search"
                maxLength={5}
                value={zipCode}
                onChange={(event) => {
                  setZipCode(event.target.value.replace(/\D+/g, "").slice(0, 5))
                }}
                placeholder="ZIP code"
                className="h-12 w-full border-b border-black/25 bg-transparent px-0 text-base font-semibold uppercase tracking-[0.16em] text-black outline-none transition placeholder:text-black/35 focus:border-black"
              />
            </label>

            <button
              type="submit"
              aria-label="Search beer finder"
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/10 bg-neutral-100 text-black/55 shadow-[0_10px_24px_rgba(0,0,0,0.06)] transition hover:border-black/15 hover:bg-neutral-200 hover:text-black/75 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!isValidZipCode}
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-4.5 w-4.5 fill-none stroke-current stroke-[1.9]"
              >
                <path d="M5 12h12" strokeLinecap="round" />
                <path d="M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleNearMe}
              aria-label="Use current location"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-full border border-black/10 bg-black px-3.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_24px_rgba(0,0,0,0.08)] transition hover:bg-black/90 hover:border-black/20"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-none stroke-current stroke-[1.8]"
              >
                <path d="M12 2.75c-3.9 0-7 3.15-7 7.05 0 4.46 4.66 8.81 6.4 10.23.34.27.84.27 1.18 0 1.74-1.42 6.4-5.77 6.4-10.23 0-3.9-3.15-7.05-7.05-7.05Zm0 9.45a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8Z" />
              </svg>
              <span>Near Me</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
