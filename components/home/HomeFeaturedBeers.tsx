import Image from "next/image"
import Link from "next/link"
import BeerCard from "@/components/beer/BeerCard"
import HomeDesktopBeerFinderSearch from "@/components/home/HomeDesktopBeerFinderSearch"
import { DESKTOP_EVENT_SECTION_HEADING_CLASS } from "@/components/events/eventHeadingStyles"
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

function ForwardArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className ?? "h-4 w-4 fill-none stroke-current stroke-[1.8]"}
    >
      <path d="M5 12h13" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  )
}

export default async function HomeFeaturedBeers() {
  const featuredBeers = featuredBeerIds
    .map((id) => getBeerById(id))
    .filter((beer) => beer !== undefined)

  if (featuredBeers.length === 0) {
    return null
  }

  const beerFinderCarouselBeers = mockBeers.filter((beer) => Boolean(beer.image.primarySrc))
  const beerFinderData = await getBeerFinderData({ maxCoordinateLookups: 0 })
  const hasBeerFinderData = beerFinderData.status === "ready"

  const beerFinderCarouselSummaries: Array<{
    beer: (typeof beerFinderCarouselBeers)[number]
    locationCount: number | null
  }> = beerFinderCarouselBeers.map((beer) => ({ beer, locationCount: null }))

  if (hasBeerFinderData) {
    const locations = beerFinderData.locations

    for (const summary of beerFinderCarouselSummaries) {
      const normalizedBeerName = normalizeText(summary.beer.name)
      summary.locationCount = locations.reduce((total, location) => {
        if (location.beers.some((locationBeer) => normalizeText(locationBeer) === normalizedBeerName)) {
          return total + 1
        }

        return total
      }, 0)
    }
  }

  const beerFinderCarouselItems = beerFinderCarouselSummaries

  return (
    <section className="hidden border-y border-black/10 bg-background py-12 md:block">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-6 mx-auto w-fit whitespace-nowrap text-center font-heading text-[clamp(4.25rem,7vw,7.5rem)] leading-[0.8] tracking-[-0.1em] text-black">
          Find Our Beer
        </h2>
        <div>
          <div className="flex flex-col gap-10">
            <div className="min-w-0">
              <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 md:pb-2">
                {beerFinderCarouselItems.map(({ beer, locationCount }) => {
                  const buttonTextColor = getReadableTextColor(beer.cardColor)
                  const isMockMatch = locationCount === null

                  return (
                    <div key={beer.id} className="min-w-[200px] max-w-[200px] flex-none snap-start">
                      <div className="overflow-hidden rounded-[22px] border border-black/10 bg-white shadow-sm">
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/[0.03]">
                          <Image
                            src={beer.image.primarySrc}
                            alt={beer.image.alt}
                            fill
                            className="object-cover"
                            sizes="200px"
                          />
                        </div>
                      </div>

                      <div className="relative -mt-6 px-3">
                        <div className="rounded-[18px] border border-black/10 bg-white/90 px-3 py-3 text-center shadow-sm backdrop-blur">
                          <p className="truncate text-sm font-semibold text-black">{beer.name}</p>
                          <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/50">
                            {isMockMatch
                              ? "Mock availability"
                              : formatNearbyLocationsLabel(locationCount)}
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

                <div className="min-w-[200px] max-w-[200px] flex-none snap-start">
                  <Link
              href="/beer-finder"
              className="flex aspect-[3/4] items-center justify-center px-5 text-center text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-black/80 transition hover:text-black focus:outline-none focus:ring-2 focus:ring-black/10"
            >
              <span className="inline-flex items-center gap-2"></span>
              <span>VIEW ALL BEERS</span>
              <ForwardArrowIcon />
            </Link>
                </div>
              </div>
              <div className="mt-2 flex justify-end pr-1">
                <p className="text-right text-xs font-semibold uppercase tracking-[0.22em] text-black/45">
                  Scroll right for more
                </p>
              </div>
            </div>

            <div className="mx-auto min-w-0 w-full">
              <h2 className={`mb-4 text-center ${DESKTOP_EVENT_SECTION_HEADING_CLASS}`}>
                Or Enter Zip Code
              </h2>
              <HomeDesktopBeerFinderSearch />
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-end justify-between gap-4">
          <div>
            <h2 className={`mt-2 ${DESKTOP_EVENT_SECTION_HEADING_CLASS}`}>Featured Beers</h2>
          </div>
          <Link
            href="/beer"
            className="inline-flex items-center gap-2 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-black/80 transition hover:text-black"
          >
            <span>VIEW ALL BEERS</span>
            <ForwardArrowIcon />
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
