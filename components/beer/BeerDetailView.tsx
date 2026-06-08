"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import BeerCard, { type Beer } from "@/components/beer/BeerCard"
import HomeMobileBeerTeaser from "@/components/home/HomeMobileBeerTeaser"
import Button from "@/components/ui/Button"
import { getBeerImageFrame, getBeerImageStyle } from "@/components/beer/beerImageFrame"
import { getMobileBeerIconSrc } from "@/components/beer/mobileBeerArtwork"
import { DESKTOP_EVENT_SECTION_HEADING_CLASS } from "@/components/events/eventHeadingStyles"
import {
  formatBeerAttributeTitle,
  type BeerFilterGroup,
} from "@/studio/schemaTypes/shared/beerAttributes"

const CLEAR_EVENT_BUTTON_CLASS =
  "border border-black bg-transparent text-black shadow-none hover:bg-black/5 hover:text-black"
const GALLERY_NAV_BUTTON_BASE =
  "inline-flex items-center justify-center rounded-full border border-white/70 text-white transition-colors duration-200 focus-visible:outline-white focus-visible:outline-offset-2"

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

function formatBeerAttributes(beer: Beer, attributeGroups: BeerFilterGroup[]) {
  const filteredGroups = attributeGroups.filter(
    (group) => group.key !== "availability" && group.key !== "packaging",
  )

  return filteredGroups
    .map((group) => {
      const selectedValues = beer.filterSelections?.[group.key] ?? []
      if (selectedValues.length === 0) {
        return null
      }

      const selectedLabels = selectedValues.map((value) => {
        return group.options.find((option) => option.value === value)?.title ?? formatBeerAttributeTitle(value)
      })

      return {
        title: group.title,
        values: selectedLabels.join(", "),
      }
    })
    .filter((item): item is { title: string; values: string } => item !== null)
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

function BackArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className ?? "h-4 w-4 fill-none stroke-current stroke-[1.8]"}
    >
      <path d="M19 12H6" />
      <path d="M11 6l-6 6 6 6" />
    </svg>
  )
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

function GalleryArrowIcon({
  direction,
  className,
}: {
  direction: "left" | "right"
  className?: string
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className ?? "h-4 w-4 fill-none stroke-current stroke-[1.8]"}
    >
      {direction === "left" ? (
        <>
          <path d="M19 12H6" />
          <path d="M11 6l-6 6 6 6" />
        </>
      ) : (
        <>
          <path d="M5 12h13" />
          <path d="M13 6l6 6-6 6" />
        </>
      )}
    </svg>
  )
}

const DESKTOP_GALLERY_SLIDE_DURATION_MS = 6000

function DesktopRotatingGallery({
  images,
  beerId,
  beerName,
}: {
  images: string[]
  beerId: string
  beerName: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (images.length < 2) {
      return
    }

    const timeout = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % images.length)
    }, DESKTOP_GALLERY_SLIDE_DURATION_MS)

    return () => window.clearTimeout(timeout)
  }, [activeIndex, images.length])

  const normalizedActiveIndex = images.length === 0 ? 0 : activeIndex % images.length

  if (!images.length) {
    return null
  }

  return (
    <div className="relative aspect-[5/6] min-h-[30rem] w-full overflow-hidden border border-black/10 bg-white shadow-sm">
      <div className="absolute inset-0">
        {images.map((imageSrc, index) => (
          <div
            key={`${beerName}-${imageSrc}-${index}`}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              index === normalizedActiveIndex
                ? "opacity-100 scale-100"
                : "pointer-events-none opacity-0 scale-[1.02]"
            }`}
          >
            <Image
              src={imageSrc}
              alt={`${beerName} gallery image ${index + 1}`}
              fill
              className="object-cover will-change-transform"
              style={getBeerImageStyle(getBeerImageFrame(imageSrc, beerId))}
              sizes="(max-width: 1024px) 50vw, 50vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.06),transparent_34%,transparent_72%,rgba(15,23,42,0.26))]" />

      <div className="absolute inset-x-0 bottom-4 flex justify-center px-4">
        <div className="flex items-center gap-2 text-white">
          <button
            type="button"
            onClick={() => setActiveIndex((current) => (current - 1 + images.length) % images.length)}
            aria-label="Previous gallery image"
            className={`${GALLERY_NAV_BUTTON_BASE} h-7 w-7 bg-transparent hover:bg-white/15`}
          >
            <GalleryArrowIcon direction="left" />
          </button>

          <div className="flex items-center gap-2">
            {images.map((_, index) => (
              <button
                key={`${beerName}-dot-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show gallery image ${index + 1}`}
                aria-pressed={index === normalizedActiveIndex}
                className={`${GALLERY_NAV_BUTTON_BASE} h-2.5 w-2.5 ${
                  index === normalizedActiveIndex
                    ? "bg-white"
                    : "bg-transparent hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setActiveIndex((current) => (current + 1) % images.length)}
            aria-label="Next gallery image"
            className={`${GALLERY_NAV_BUTTON_BASE} h-7 w-7 bg-transparent hover:bg-white/15`}
          >
            <GalleryArrowIcon direction="right" />
          </button>
        </div>
      </div>
    </div>
  )
}

const WHITE_BACKGROUND = "#FFFFFF"
const BLACK_TEXT = "#161616"
const MUTED_BLACK_TEXT = "rgba(22, 22, 22, 0.58)"
const BODY_BLACK_TEXT = "rgba(22, 22, 22, 0.84)"
const SURFACE_BLACK = "rgba(22, 22, 22, 0.04)"
const SURFACE_BORDER_BLACK = "rgba(22, 22, 22, 0.12)"

type BeerDetailViewProps = {
  beer: Beer
  relatedBeers: Beer[]
  beerAttributeGroups: BeerFilterGroup[]
}

export default function BeerDetailView({ beer, relatedBeers, beerAttributeGroups }: BeerDetailViewProps) {
  const detailImages =
    beer.detailImages && beer.detailImages.length > 0
      ? beer.detailImages
      : [beer.image.primarySrc, beer.image.secondarySrc ?? beer.image.primarySrc, beer.image.primarySrc]
  const uniqueDetailImages = Array.from(new Set(detailImages))
  const mobileGalleryImages = uniqueDetailImages
  const mobileCanSrc = getMobileBeerIconSrc(beer.id)

  const buttonTextColor = BLACK_TEXT
  const mobileMutedTextColor = MUTED_BLACK_TEXT
  const mobileBodyTextColor = BODY_BLACK_TEXT
  const mobileSurfaceColor = SURFACE_BLACK
  const mobileSurfaceBorderColor = SURFACE_BORDER_BLACK
  const desktopGalleryImages = uniqueDetailImages
  const beerSpecs = [beer.abv > 0 ? `${beer.abv}% ABV` : null, beer.ibu ? `${beer.ibu} IBU` : null]
    .filter((value): value is string => value !== null)
    .join(" | ")
  const beerAttributes = formatBeerAttributes(beer, beerAttributeGroups)

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden md:hidden" style={{ backgroundColor: WHITE_BACKGROUND }}>
        <div className="relative mx-auto max-w-3xl px-4 py-4" style={{ color: buttonTextColor }}>
          <div className="space-y-5">
            <div className="grid grid-cols-[minmax(0,1fr)_clamp(128px,32vw,180px)] items-start gap-x-4 gap-y-3">
              <div className="min-w-0">
                <h1 className="font-heading text-[clamp(2.8rem,13vw,4.2rem)] leading-[0.84] tracking-[-0.1em]">
                  {beer.name}
                </h1>
              </div>

              <div className="pointer-events-none relative row-span-2 h-[clamp(194px,48vw,280px)] w-[clamp(128px,32vw,180px)] justify-self-end">
                <Image
                  src={mobileCanSrc}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 32vw, 180px"
                  className="origin-top-right object-contain rotate-[2deg]"
                  priority={false}
                />
              </div>

              <p
                className="col-start-1 text-left text-[11px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: mobileMutedTextColor }}
              >
                {beer.style.toUpperCase()}
                {beerSpecs ? ` | ${beerSpecs}` : ""}
              </p>
            </div>

            <div className="w-full">
              <p className="text-left text-sm leading-relaxed" style={{ color: mobileBodyTextColor }}>
                {beer.longDescription ?? beer.shortDescription}
              </p>

              <div className="mt-4 flex justify-center">
                <Button
                  href={`/beer-finder?beer=${encodeURIComponent(beer.id)}`}
                  variant="secondary"
                  className={`px-5 py-2.5 text-xs sm:text-sm ${CLEAR_EVENT_BUTTON_CLASS}`}
                >
                  Find this beer
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {mobileGalleryImages.slice(0, 2).map((imageSrc, index) => (
                <div
                  key={`${beer.id}-${imageSrc}-${index}`}
                  className="relative w-full overflow-hidden shadow-sm"
                  style={{
                    aspectRatio: getGalleryAspectRatio(imageSrc),
                    backgroundColor: mobileSurfaceColor,
                    borderColor: mobileSurfaceBorderColor,
                    borderWidth: "1px",
                    borderStyle: "solid",
                  }}
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

      <HomeMobileBeerTeaser variant="related" backgroundColor={WHITE_BACKGROUND} />

      <section className="relative hidden overflow-hidden md:block">
        <div className="relative mx-auto max-w-6xl px-6 py-8 lg:py-10">
          <div className="mb-4">
            <Link
              href="/beer"
              className="inline-flex items-center gap-2 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-black/80 transition hover:text-black"
            >
              <BackArrowIcon />
              <span>BACK TO BEERS</span>
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,0.9fr)] lg:items-stretch lg:gap-8">
            <div className="flex h-full">
              <DesktopRotatingGallery images={desktopGalleryImages} beerId={beer.id} beerName={beer.name} />
            </div>

            <div className="flex h-full flex-col border border-black/10 bg-white p-6 shadow-sm lg:p-7">
              <div className="flex h-full w-full flex-col">
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
                      {beerAttributes.length ? (
                        <div className="grid gap-1">
                          {beerAttributes.map((attribute) => (
                            <div key={attribute.title}>
                              <span className="font-semibold text-black/90">{attribute.title}:</span>{" "}
                              <span>{attribute.values}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        "Details coming soon"
                      )}
                    </dd>
                  </div>
                </dl>

                <div className="mt-auto flex justify-center pt-5">
                  <Button
                    href={`/beer-finder?beer=${encodeURIComponent(beer.id)}`}
                    variant="secondary"
                    className={`px-5 py-2.5 text-xs sm:text-sm ${CLEAR_EVENT_BUTTON_CLASS}`}
                  >
                    Find this beer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hidden border-t border-black/10 bg-white py-12 md:block">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className={DESKTOP_EVENT_SECTION_HEADING_CLASS}>
                As You May Also Like...
              </h2>
            </div>
            <Link
              href="/beer"
              className="inline-flex items-center gap-2 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-black/80 transition hover:text-black"
            >
              <span>VIEW ALL BEERS</span>
              <ForwardArrowIcon />
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
