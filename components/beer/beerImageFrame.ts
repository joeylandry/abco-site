import type { CSSProperties } from "react"

type BeerImageFrame = {
  objectPosition: string
  zoom: number
}

const DEFAULT_PACKSHOT_FRAME: BeerImageFrame = {
  objectPosition: "50% 50%",
  zoom: 1.32,
}

const DEFAULT_PACKSHOT_OVERRIDES_BY_ID: Record<string, Partial<BeerImageFrame>> = {
  "foxy-librarian-2025": {
    zoom: 1.85,
  },
  "stave-450": {
    zoom: 1.85,
  },
}

const DEFAULT_GALLERY_BEER_FRAME: BeerImageFrame = {
  objectPosition: "50% 72%",
  zoom: 1.08,
}

export function getBeerImageFrame(imageSrc: string, beerId?: string): BeerImageFrame | null {
  if (!imageSrc.startsWith("/beer/")) {
    return null
  }

  if (imageSrc.startsWith("/beer/beer_gallery/")) {
    if (imageSrc.includes("_beer")) {
      return DEFAULT_GALLERY_BEER_FRAME
    }

    return null
  }

  if (!imageSrc.endsWith(".png")) {
    return null
  }

  const override = beerId ? DEFAULT_PACKSHOT_OVERRIDES_BY_ID[beerId] : undefined
  if (!override) {
    return DEFAULT_PACKSHOT_FRAME
  }

  return {
    ...DEFAULT_PACKSHOT_FRAME,
    ...override,
  }
}

export function getBeerImageStyle(frame: BeerImageFrame | null): CSSProperties | undefined {
  if (!frame) {
    return undefined
  }

  return {
    objectPosition: frame.objectPosition,
    transform: `scale(${frame.zoom})`,
    transformOrigin: "center",
  }
}

