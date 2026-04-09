import Image from "next/image"
import Link from "next/link"
import BeerCard from "@/components/beer/BeerCard"
import BeerFinderBeerSearch from "@/components/home/BeerFinderBeerSearch"
import { getBeerById, mockBeers } from "@/app/beer/mockBeers"
import { getBeerFinderData } from "@/lib/breww"

const featuredBeerIds = [
  "money-comes-and-goes",
  "my-new-gf",
  "presita",
  "bike-path",
  "jedermann",
  "marleys-ghost",
  "spy-p-a",
  "stave-450",
] as const

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "")
}

function hexToRgb(hex: string) {
  const normalized = hex.trim().replace("#", "")

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return null
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

function getRelativeLuminance(hex: string) {
  const rgb = hexToRgb(hex)

  if (!rgb) {
    return 1
  }

  const toLinear = (channel: number) => {
    const normalized = channel / 255
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  }

  return 0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b)
}

function getReadableTextColor(backgroundHex: string) {
  return getRelativeLuminance(backgroundHex) < 0.36 ? "#FFFFFF" : "#0f172a"
}

function formatNearbyLocationsLabel(locationCount: number | null) {
  if (locationCount === null) {
    return "Check availability in Beer Finder"
  }

  if (locationCount >= 3) {
    return "3+ LOCATIONS"
  }

  if (locationCount === 2) {
    return "2 LOCATIONS"
  }

  if (locationCount === 1) {
    return "1 LOCATION"
  }

  return "No recent matches"
}

export default async function HomeFeaturedBeers() {
  const featuredBeers = featuredBeerIds
    .map((id) => getBeerById(id))
    .filter((beer) => beer !== undefined)

  if (featuredBeers.length === 0) {
    return null
  }

  const beerSearchOptions = mockBeers
    .map((beer) => ({ id: beer.id, name: beer.name }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const beerFinderData = await getBeerFinderData({ maxCoordinateLookups: 0 })
  const hasBeerFinderData = beerFinderData.status === "ready"

  const featuredBeerFinderSummaries: Array<{
    beer: (typeof featuredBeers)[number]
    locationCount: number | null
  }> = featuredBeers.map((beer) => ({ beer, locationCount: null }))

  if (hasBeerFinderData) {
    const locations = beerFinderData.locations

    for (const summary of featuredBeerFinderSummaries) {
      const normalizedBeerName = normalizeText(summary.beer.name)
      summary.locationCount = locations.reduce((total, location) => {
        if (location.beers.some((locationBeer) => normalizeText(locationBeer) === normalizedBeerName)) {
          return total + 1
        }

        return total
      }, 0)
    }
  }

  const featuredBeerFinderMatches = featuredBeerFinderSummaries.filter((summary) =>
    typeof summary.locationCount === "number" ? summary.locationCount > 0 : false
  )
  const featuredBeerFinderCarouselMatches = featuredBeerFinderMatches.slice(0, 4)

  return (
    <section className="hidden border-t border-black/10 bg-background py-12 md:block">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-[24px] border border-black/10 bg-surface p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:grid md:grid-cols-[minmax(0,440px)_minmax(0,1fr)] md:gap-10 md:items-start">
            <div className="max-w-xl md:max-w-none">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/55">Beer Finder</p>
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-900">
                  <span className="relative mr-2 flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Now live
                </span>
              </div>
              <h3 className="mt-2 font-heading text-2xl leading-tight">Find these beers near you</h3>
              <p className="mt-3 text-sm leading-relaxed text-black/70">
                Start with featured picks or choose any beer from the lineup, then we&apos;ll show where it&apos;s pouring.
                {" "}
                <span className="ml-2">
                  <Link
                    href="/beer-finder"
                    className="inline-flex items-center gap-1 font-semibold text-black/80 transition hover:text-black"
                  >
                    Open Beer Finder <span aria-hidden="true">→</span>
                  </Link>
                </span>
              </p>

              <BeerFinderBeerSearch beers={beerSearchOptions} className="mt-5 max-w-xl" />
            </div>

            <div className="min-w-0">
              <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 md:pb-2">
                {featuredBeerFinderCarouselMatches.length > 0 ? (
                  <>
                    {featuredBeerFinderCarouselMatches.map(({ beer, locationCount }) => {
                      const buttonTextColor = getReadableTextColor(beer.cardColor)

                      return (
                        <div
                          key={beer.id}
                          className="min-w-[170px] max-w-[170px] flex-none snap-start"
                        >
                          <div className="overflow-hidden rounded-[22px] border border-black/10 bg-white shadow-sm">
                            <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/[0.03]">
                              <Image
                                src={beer.image.primarySrc}
                                alt={beer.image.alt}
                                fill
                                className="object-cover"
                                sizes="170px"
                              />
                            </div>
                          </div>

                          <div className="relative -mt-6 px-3">
                            <div className="rounded-[18px] border border-black/10 bg-white/90 px-3 py-3 text-center shadow-sm backdrop-blur">
                              <p className="truncate text-sm font-semibold text-black">{beer.name}</p>
                              <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/50">
                                {formatNearbyLocationsLabel(locationCount)}
                              </p>
                              <div className="mt-2.5 flex justify-center">
                                <Link
                                  href={`/beer-finder?beer=${encodeURIComponent(beer.id)}`}
                                  className="inline-flex items-center justify-center rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black/10"
                                  style={{
                                    backgroundColor: beer.cardColor,
                                    color: buttonTextColor,
                                  }}
                                >
                                  FIND BEER
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    <div className="min-w-[170px] max-w-[170px] flex-none snap-start">
                      <Link
                        href="/beer-finder"
                        className="flex aspect-[3/4] items-center justify-center px-5 text-center text-sm font-semibold text-black/65 transition hover:text-black focus:outline-none focus:ring-2 focus:ring-black/10"
                        aria-label="Find all beers in Beer Finder"
                      >
                        <span className="inline-flex items-center gap-2">
                          Find all beers <span aria-hidden="true">→</span>
                        </span>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex min-w-[280px] flex-1 items-center justify-center rounded-[22px] border border-dashed border-black/15 bg-black/[0.02] px-6 py-10 text-center">
                    <p className="text-sm font-semibold text-black/65">
                      No featured beers have nearby matches right now. Try selecting a beer below.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        <div className="mt-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
              Featured Beers
            </p>
            <h2 className="mt-2 font-heading text-3xl leading-tight">Fresh From The Lineup</h2>
          </div>
          <Link href="/beer" className="text-sm font-semibold text-black/70 transition hover:text-black">
            View all beers
          </Link>
        </div>

        <div className="mt-8 flex gap-6 overflow-x-auto pb-4">
          {featuredBeers.map((beer) => (
            <div key={beer.id} className="min-w-[280px] max-w-[280px] flex-none">
              <BeerCard beer={beer} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
