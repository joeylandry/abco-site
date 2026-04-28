"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { mockBeers } from "@/app/beer/mockBeers"

const ZIP_CODE_PATTERN = /^\d{5}$/

function isCompleteZipCode(value: string) {
  return ZIP_CODE_PATTERN.test(value.trim())
}

export default function HomeDesktopBeerFinderSearch() {
  const router = useRouter()
  const [zipCode, setZipCode] = useState("")
  const [isBeerFilterOpen, setIsBeerFilterOpen] = useState(false)
  const [selectedBeerIds, setSelectedBeerIds] = useState<string[]>([])

  const trimmedZipCode = zipCode.trim()
  const isValidZipCode = isCompleteZipCode(trimmedZipCode)
  const hasZipCode = trimmedZipCode.length > 0
  const selectedBeerIdSet = new Set(selectedBeerIds)
  const beerFilterOptions = mockBeers.filter((beer) => Boolean(beer.image.primarySrc))
  const canSubmit = (!hasZipCode || isValidZipCode) && (hasZipCode || selectedBeerIds.length > 0)

  function buildSearchParams(includeCurrentLocation = false) {
    const params = new URLSearchParams()

    if (isValidZipCode) {
      params.set("zip", trimmedZipCode)
    }

    if (includeCurrentLocation) {
      params.set("near", "1")
    }

    for (const beerId of selectedBeerIds) {
      params.append("beer", beerId)
    }

    return params
  }

  function toggleBeerFilter(beerId: string) {
    setSelectedBeerIds((currentSelectedBeerIds) =>
      currentSelectedBeerIds.includes(beerId)
        ? currentSelectedBeerIds.filter((currentBeerId) => currentBeerId !== beerId)
        : [...currentSelectedBeerIds, beerId]
    )
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!canSubmit) {
      return
    }

    const params = buildSearchParams(false)
    router.push(`/beer-finder?${params.toString()}`)
  }

  function handleUseCurrentLocation() {
    const params = buildSearchParams(true)
    router.push(`/beer-finder?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-nowrap sm:items-center sm:justify-center">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-none sm:flex-row sm:items-center sm:justify-center sm:gap-2"
        >
          <label className="min-w-0 flex-1 sm:flex-none sm:w-[14rem]">
            <span className="sr-only">Search by ZIP code</span>
            <input
              type="search"
              inputMode="numeric"
              autoComplete="postal-code"
              enterKeyHint="search"
              maxLength={5}
              value={zipCode}
              onChange={(event) => {
                setZipCode(event.target.value.replace(/\D+/g, "").slice(0, 5))
              }}
              placeholder="ZIP CODE"
              className="h-10 w-full rounded-full border border-black/10 bg-white px-4 text-center text-xs font-medium uppercase tracking-[0.18em] leading-none text-black outline-none transition placeholder:text-black/35 focus:border-black/25"
            />
          </label>

          <button
            type="submit"
            className="inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-[#0f172a] bg-[#0f172a] px-4 text-xs font-semibold uppercase tracking-[0.18em] leading-none text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canSubmit}
          >
            Search
          </button>
        </form>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 text-xs font-semibold uppercase tracking-[0.18em] leading-none text-black/70 transition hover:border-black/20 hover:text-black"
          >
            Use current location
          </button>

          <button
            type="button"
            onClick={() => setIsBeerFilterOpen((currentValue) => !currentValue)}
            aria-expanded={isBeerFilterOpen}
            aria-controls="home-beer-filter-checklist"
            className={`inline-flex h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.18em] leading-none transition ${
              isBeerFilterOpen || selectedBeerIds.length > 0
                ? "border-[#0f172a] bg-[#0f172a] text-white"
                : "border-black/10 bg-white text-black/70 hover:border-black/20 hover:text-black"
            }`}
          >
            Filter beers
          </button>
        </div>
      </div>

      {isBeerFilterOpen ? (
        <div
          id="home-beer-filter-checklist"
          className="max-h-72 w-full overflow-y-auto border border-black/10 bg-white shadow-sm"
        >
          <div className="grid grid-cols-3 gap-0 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {beerFilterOptions.map((beer) => {
              const isSelected = selectedBeerIdSet.has(beer.id)

              return (
                <button
                  key={beer.id}
                  type="button"
                  onClick={() => toggleBeerFilter(beer.id)}
                  aria-pressed={isSelected}
                  className={`group relative w-full overflow-hidden border border-black/10 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f172a]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                    isSelected
                      ? "border-[#0f172a] bg-[#0f172a] text-white shadow-[0_12px_24px_rgba(15,23,42,0.14)]"
                      : "bg-white text-black hover:bg-black/[0.02]"
                  }`}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <Image
                      src={beer.image.primarySrc}
                      alt={beer.image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    />
                    {isSelected ? <div className="absolute inset-0 bg-[#0f172a]/30" aria-hidden="true" /> : null}
                    <span
                      className={`absolute left-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-black shadow-[0_10px_18px_rgba(15,23,42,0.14)] transition ${
                        isSelected
                          ? "border-white bg-white text-[#0f172a]"
                          : "border-white/90 bg-white/20 text-transparent group-hover:bg-white/30"
                      }`}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
