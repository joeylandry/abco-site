"use client"

import type { CSSProperties, ReactNode } from "react"
import { useSyncExternalStore } from "react"

type MapProvider = "apple" | "google"

type MobileEventLocationLinkProps = {
  location: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

function isApplePlatform() {
  if (typeof navigator === "undefined") {
    return false
  }

  const navigatorWithUserAgentData = navigator as Navigator & {
    userAgentData?: {
      platform?: string
    }
  }

  const platform =
    typeof navigatorWithUserAgentData.userAgentData?.platform === "string" &&
    navigatorWithUserAgentData.userAgentData.platform
      ? navigatorWithUserAgentData.userAgentData.platform
      : navigator.platform

  return /Mac|iPhone|iPad|iPod/.test(platform)
}

function splitLocationLabel(location: string) {
  const bulletSeparator = " · "

  if (location.includes(bulletSeparator)) {
    const [venue, ...addressParts] = location.split(bulletSeparator)

    return {
      venue: venue.trim(),
      address: addressParts.join(bulletSeparator).trim() || null,
    }
  }

  const commaIndex = location.indexOf(",")

  if (commaIndex > 0) {
    return {
      venue: location.slice(0, commaIndex).trim(),
      address: location.slice(commaIndex + 1).trim() || null,
    }
  }

  return {
    venue: location.trim(),
    address: null,
  }
}

function buildEventMapsUrl(location: string, mapProvider: MapProvider) {
  const { venue, address } = splitLocationLabel(location)
  const query = encodeURIComponent([venue, address].filter(Boolean).join(" "))

  if (mapProvider === "apple") {
    return `https://maps.apple.com/?q=${query}`
  }

  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

export default function MobileEventLocationLink({
  location,
  className = "block text-left text-sm leading-relaxed text-black/75 underline-offset-2 transition hover:text-black hover:underline",
  style,
  children,
}: MobileEventLocationLinkProps) {
  const preferredMapProvider = useSyncExternalStore<MapProvider>(
    () => () => {},
    () => (isApplePlatform() ? "apple" : "google"),
    () => "google"
  )

  const { venue, address } = splitLocationLabel(location)
  const mapsUrl = buildEventMapsUrl(location, preferredMapProvider)
  const mapsLabel =
    preferredMapProvider === "apple"
      ? `Open ${venue} in Apple Maps`
      : `Open ${venue} in Google Maps`

  return (
    <a
      href={mapsUrl}
      aria-label={mapsLabel}
      className={className}
      style={style}
    >
      {children ?? (
        <>
          <p>{venue}</p>
          {address ? <p>{address}</p> : null}
        </>
      )}
    </a>
  )
}
