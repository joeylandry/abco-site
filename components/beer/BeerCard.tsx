import Image from "next/image"
import Link from "next/link"
import type { BeerFilterSelections } from "@/studio/schemaTypes/shared/beerAttributes"

export type BeerAvailability = "yearRound" | "seasonal" | "rotating"

export type Beer = {
  id: string
  name: string
  style: string
  abv: number
  ibu?: number
  shortDescription: string
  availability: BeerAvailability
  featured?: boolean
  image: {
    primarySrc: string
    secondarySrc?: string
    alt: string
  }
  detailImages?: string[]
  longDescription?: string
  tags?: string[]
  packaging?: Array<"draft" | "cans" | "bottles" | "crowlers">
  filterSelections?: BeerFilterSelections
  cardColor?: string
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "")

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

function mixHex(baseHex: string, targetHex: string, weight: number) {
  const base = hexToRgb(baseHex)
  const target = hexToRgb(targetHex)
  const mixChannel = (baseChannel: number, targetChannel: number) =>
    Math.round(baseChannel + (targetChannel - baseChannel) * weight)

  return `#${[mixChannel(base.r, target.r), mixChannel(base.g, target.g), mixChannel(base.b, target.b)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`
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

export default function BeerCard({
  beer,
  interactive = true,
}: {
  beer: Beer
  interactive?: boolean
}) {
  const secondarySrc = beer.image.secondarySrc
  const imageStageColor = beer.cardColor ?? "#FFFFFF"
  const contentPanelColor = mixHex(imageStageColor, "#FFFFFF", 0.24)
  const textColor = getRelativeLuminance(contentPanelColor) < 0.34 ? "#FFFFFF" : "#161616"
  const taglineColor = mixHex(textColor, contentPanelColor, textColor === "#FFFFFF" ? 0.16 : 0.2)
  const borderColor = mixHex(imageStageColor, textColor, textColor === "#FFFFFF" ? 0.18 : 0.12)
  const cardClassName = `group block h-full overflow-hidden rounded-none border shadow-[0_18px_40px_rgba(0,0,0,0.08)] ${
    interactive ? "cursor-pointer transition-transform duration-200 hover:-translate-y-1" : ""
  }`

  const content = (
    <div className="flex h-full flex-col">
      <div
        className="relative aspect-[3/4] w-full overflow-hidden"
        style={{ backgroundColor: imageStageColor }}
      >
        <Image
          src={beer.image.primarySrc}
          alt={beer.image.alt}
          fill
          className={`object-cover transition-opacity duration-300 ${
            secondarySrc ? "opacity-100 group-hover:opacity-0" : ""
          }`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={false}
        />
        {secondarySrc ? (
          <Image
            src={secondarySrc}
            alt={beer.image.alt}
            fill
            className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={false}
          />
        ) : null}
      </div>

      <div
        className="grid h-[6.85rem] grid-rows-[auto_1fr] gap-1 px-5 py-3 text-center"
        style={{
          backgroundColor: contentPanelColor,
          color: textColor,
        }}
      >
        <h3 className="font-heading text-[1.35rem] leading-[1.02]">
          {beer.name}
        </h3>
        <p
          className="min-h-0 self-center overflow-hidden text-[0.82rem] font-medium leading-[1.1rem] tracking-[0.01em]"
          style={{
            color: taglineColor,
          }}
        >
          {beer.shortDescription}
        </p>
      </div>
    </div>
  )

  if (!interactive) {
    return (
      <article
        className={cardClassName}
        style={{
          backgroundColor: imageStageColor,
          borderColor,
        }}
      >
        {content}
      </article>
    )
  }

  return (
    <Link
      href={`/beer/${beer.id}`}
      className={cardClassName}
      style={{
        backgroundColor: imageStageColor,
        borderColor,
      }}
      aria-label={`View details for ${beer.name}`}
    >
      {content}
    </Link>
  )
}
