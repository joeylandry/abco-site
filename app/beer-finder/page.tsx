import type { Metadata } from "next"
import BeerFinderExplorer from "@/components/beer/BeerFinderExplorer"
import MobileBeerFinder from "@/components/beer/MobileBeerFinder"
import { mockBeers } from "@/app/beer/mockBeers"
import { getBeerFinderData } from "@/lib/breww"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Beer Finder",
  description: "Find ABCo beers near you.",
}

type BeerFinderPageProps = {
  searchParams: Promise<{
    beer?: string | string[]
    zip?: string
  }>
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "")
}

const ZIP_CODE_PATTERN = /^\d{5}$/

function isCompleteZipCode(value: string) {
  return ZIP_CODE_PATTERN.test(value.trim())
}

function resolveBeerFilter(rawBeer: string) {
  const trimmedBeer = rawBeer.trim()

  if (!trimmedBeer) {
    return null
  }

  const fromCatalog =
    mockBeers.find((beer) => beer.id === trimmedBeer) ??
    mockBeers.find((beer) => normalizeText(beer.name) === normalizeText(trimmedBeer))

  return fromCatalog?.name ?? trimmedBeer
}

function resolveBeerFilters(rawBeer: string | string[] | undefined) {
  if (!rawBeer) {
    return []
  }

  const values = Array.isArray(rawBeer) ? rawBeer : [rawBeer]
  const resolved: string[] = []
  const seen = new Set<string>()

  for (const value of values) {
    const resolvedBeer = resolveBeerFilter(value)
    if (!resolvedBeer || seen.has(resolvedBeer)) {
      continue
    }

    resolved.push(resolvedBeer)
    seen.add(resolvedBeer)
  }

  return resolved
}

export default async function BeerFinderPage({ searchParams }: BeerFinderPageProps) {
  const { beer, zip } = await searchParams
  const initialSelectedBeers = resolveBeerFilters(beer)
  const initialZip = zip && isCompleteZipCode(zip) ? zip.trim() : null
  const data = await getBeerFinderData()

  return (
    <>
      <h1 className="sr-only">Beer Finder</h1>
      <div className="bg-background">
        {data.status === "missing-config" ? (
          <section className="px-6 py-10 md:py-14">
            <div className="mx-auto max-w-5xl rounded-[28px] border border-black/10 bg-surface p-8 shadow-sm md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/55">Setup Needed</p>
              <h2 className="mt-3 font-heading text-3xl">Breww API key not configured</h2>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-black/75 md:text-base">
                Add `BREWW_API_KEY` to the environment and restart the Next.js server. This page reads recent
                wholesale orders from Breww and maps the current external accounts carrying beer.
              </p>
            </div>
          </section>
        ) : data.locations.length === 0 ? (
          <section className="px-6 py-10 md:py-14">
            <div className="mx-auto max-w-5xl rounded-[24px] border border-dashed border-black/15 bg-black/[0.03] p-8 text-center">
              <p className="font-heading text-2xl">No recent matches</p>
              <p className="mt-3 text-sm text-black/70 md:text-base">
                No qualifying wholesale orders were found in the current Breww lookback window.
              </p>
            </div>
          </section>
        ) : (
          <>
            <div className="md:hidden">
              <MobileBeerFinder
                key={`${initialSelectedBeers.join("|") || "all"}-${initialZip ?? "nozip"}-${data.generatedAt}-${data.locations.length}`}
                locations={data.locations}
                initialSelectedBeers={initialSelectedBeers}
                initialZip={initialZip}
              />
            </div>

            <div className="hidden md:block">
              <BeerFinderExplorer
                key={`${initialSelectedBeers.join("|") || "all"}-${initialZip ?? "nozip"}-${data.generatedAt}-${data.locations.length}`}
                locations={data.locations}
                initialSelectedBeers={initialSelectedBeers}
                initialZip={initialZip}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}
