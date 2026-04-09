"use client"

import Image from "next/image"
import Link from "next/link"
import BeerCard, { type Beer } from "@/components/beer/BeerCard"
import HomeMobileBeerTeaser from "@/components/home/HomeMobileBeerTeaser"
import { getBeerImageFrame, getBeerImageStyle } from "@/components/beer/beerImageFrame"

function formatPackaging(packaging: string[] | undefined) {
  if (!packaging?.length) {
    return "Taproom only"
  }

  return packaging.map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join(", ")
}

function formatAvailability(availability: "yearRound" | "seasonal" | "rotating") {
  if (availability === "yearRound") return "Year round"
  if (availability === "seasonal") return "Seasonal"
  return "Rotating"
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "")

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

function hexToRgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function getGalleryAspectRatio(imageSrc: string) {
  if (imageSrc.includes("horizontal")) {
    return "4 / 3"
  }

  if (imageSrc.includes("beer2_temp")) {
    return "3 / 4"
  }

  return "3 / 4"
}

function getRelativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const toLinear = (channel: number) => {
    const normalized = channel / 255
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  }

  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

type BeerDetailViewProps = {
  beer: Beer
  relatedBeers: Beer[]
}

export default function BeerDetailView({ beer, relatedBeers }: BeerDetailViewProps) {
  const detailImages =
    beer.detailImages && beer.detailImages.length > 0
      ? beer.detailImages
      : [beer.image.primarySrc, beer.image.secondarySrc ?? beer.image.primarySrc, beer.image.primarySrc]
  const uniqueDetailImages = Array.from(new Set(detailImages))
  const mobileGalleryImages = uniqueDetailImages

  const accentColor = beer.cardColor
  const buttonTextColor = getRelativeLuminance(accentColor) < 0.34 ? "#FFFFFF" : "#161616"
  const beerSpecs = [beer.abv > 0 ? `${beer.abv}% ABV` : null, beer.ibu ? `${beer.ibu} IBU` : null]
    .filter((value): value is string => value !== null)
    .join(" | ")

  const heroBackdrop = [
    `radial-gradient(circle at top left, ${hexToRgba(accentColor, 0.28)} 0%, transparent 34%)`,
    `radial-gradient(circle at bottom right, ${hexToRgba(accentColor, 0.22)} 0%, transparent 36%)`,
    `linear-gradient(180deg, ${hexToRgba(accentColor, 0.1)} 0%, transparent 42%)`,
  ].join(", ")

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden md:hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: heroBackdrop }}
        />

        <div className="relative mx-auto max-w-3xl px-4 py-4">
          <div className="mb-4">
            <Link
              href="/beer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-black/70 transition hover:text-black"
            >
              <span aria-hidden="true">&larr;</span>
              Back to beer
            </Link>
          </div>

          <div className="space-y-5">
            <div className="overflow-hidden border border-black/10 bg-surface shadow-sm">
              <div className="px-5 py-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-black/50">
                  Beer Detail
                </p>
                <h1 className="mt-2 font-heading text-4xl leading-none">{beer.name}</h1>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-black/45">
                  {beer.style}
                </p>
                {beerSpecs ? (
                  <p className="mt-3 text-sm leading-relaxed text-black/70">{beerSpecs}</p>
                ) : null}
                <p className="mt-4 text-sm leading-relaxed text-black/85">
                  {beer.longDescription ?? beer.shortDescription}
                </p>

                <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-black/10 pt-4">
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
                      Availability
                    </dt>
                    <dd className="mt-1 text-sm text-black/80">
                      {formatAvailability(beer.availability)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
                      Packaging
                    </dt>
                    <dd className="mt-1 text-sm text-black/80">
                      {formatPackaging(beer.packaging)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
                      Attributes
                    </dt>
                    <dd className="mt-1 text-sm text-black/80">
                      {beer.tags?.length ? beer.tags.join(", ") : "Details coming soon"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/45">
                      Pour Notes
                    </dt>
                    <dd className="mt-1 text-sm text-black/80">{beer.shortDescription}</dd>
                  </div>
                </dl>

                <div className="mt-5 flex flex-col gap-3">
                  <Link
                    href={`/beer-finder?beer=${encodeURIComponent(beer.id)}`}
                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-wide shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                    style={{
                      backgroundColor: accentColor,
                      color: buttonTextColor,
                    }}
                  >
                    Find this beer
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {mobileGalleryImages.slice(0, 3).map((imageSrc, index) => (
                <div
                  key={`${beer.id}-${imageSrc}-${index}`}
                  className="relative w-full overflow-hidden border border-black/10 bg-black/[0.03] shadow-sm"
                  style={{ aspectRatio: getGalleryAspectRatio(imageSrc) }}
                >
                  <Image
                    src={imageSrc}
                    alt={`${beer.name} gallery image ${index + 1}`}
                    fill
                    className="object-cover will-change-transform"
                    style={getBeerImageStyle(getBeerImageFrame(imageSrc, beer.id))}
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <HomeMobileBeerTeaser variant="related" />

      <section className="relative hidden overflow-hidden md:block">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: heroBackdrop }}
        />

        <div className="relative mx-auto max-w-6xl px-6 py-8 lg:py-10">
          <div className="mb-4">
            <Link
              href="/beer"
              className="inline-flex items-center gap-2 text-base font-semibold text-black/70 transition hover:text-black"
            >
              <span aria-hidden="true">&larr;</span>
              Back to beer
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,0.9fr)] lg:items-stretch lg:gap-8">
            <div className="flex h-full flex-col">
              <div className="grid gap-3 sm:grid-cols-2 sm:grid-rows-2 lg:h-full">
                {detailImages.slice(0, 3).map((imageSrc, index) => (
                  <div
                    key={`${beer.id}-${imageSrc}-${index}`}
                    className={`relative overflow-hidden border border-black/10 bg-white shadow-sm ${
                      index === 0
                        ? "min-h-[280px] sm:row-span-2 lg:h-full lg:min-h-0"
                        : "min-h-[165px] lg:min-h-0"
                    }`}
                  >
                    <Image
                      src={imageSrc}
                      alt={`${beer.name} gallery image ${index + 1}`}
                      fill
                      className="object-cover will-change-transform"
                      style={getBeerImageStyle(getBeerImageFrame(imageSrc, beer.id))}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex h-full flex-col border border-black/10 bg-surface p-6 shadow-sm lg:p-7">
              <div className="flex w-full flex-1 flex-col">
                <h1 className="mt-3 text-center font-heading text-3xl leading-none md:text-4xl">
                  {beer.name}
                </h1>
                <p className="mt-4 text-center text-base leading-relaxed text-black/80 md:text-lg">
                  {beer.style}
                  {beer.abv > 0 ? ` | ${beer.abv}% ABV` : ""}
                  {beer.ibu ? ` | ${beer.ibu} IBU` : ""}
                </p>
                <p className="mt-5 max-w-xl self-center text-center text-base leading-relaxed text-black/85 md:text-lg">
                  {beer.longDescription ?? beer.shortDescription}
                </p>

                <dl className="mt-6 grid w-full gap-4 border-t border-black/10 pt-5 sm:grid-cols-2">
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/50">
                      Availability
                    </dt>
                    <dd className="mt-1 text-sm text-black/80">
                      {formatAvailability(beer.availability)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/50">
                      Packaging
                    </dt>
                    <dd className="mt-1 text-sm text-black/80">
                      {formatPackaging(beer.packaging)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/50">
                      Attributes
                    </dt>
                    <dd className="mt-1 text-sm text-black/80">
                      {beer.tags?.length ? beer.tags.join(", ") : "Details coming soon"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/50">
                      Pour Notes
                    </dt>
                    <dd className="mt-1 text-sm text-black/80">{beer.shortDescription}</dd>
                  </div>
                </dl>

                <div className="mt-auto flex justify-center pt-5">
                  <Link
                    href={`/beer-finder?beer=${encodeURIComponent(beer.id)}`}
                    className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground/80"
                    style={{
                      backgroundColor: accentColor,
                      color: buttonTextColor,
                    }}
                  >
                    Find this beer
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hidden border-t border-black/10 bg-white/50 py-12 md:block">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
                More To Explore
              </p>
              <h2 className="mt-2 font-heading text-xl leading-tight md:text-2xl">
                you may also like...
              </h2>
            </div>
            <Link href="/beer" className="text-sm font-semibold text-black/70 transition hover:text-black">
              View all beers
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4">
            {relatedBeers.map((relatedBeer) => (
              <div key={relatedBeer.id} className="min-w-[280px] max-w-[280px] flex-none">
                <BeerCard beer={relatedBeer} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
