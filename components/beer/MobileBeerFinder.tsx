"use client"

import Image from "next/image"
import Script from "next/script"
import { createPortal } from "react-dom"
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { mockBeers } from "@/app/beer/mockBeers"
import type { BeerFinderLocation } from "@/lib/breww"
import { scrollToTopInstantly } from "@/lib/scrollToTop"
import { useSwipeToCloseDrawer } from "@/components/layout/useSwipeToCloseDrawer"
import {
  getLeaflet,
  hasCoordinates,
  type LeafletLayerGroup,
  type LeafletMap,
  type LeafletRuntime,
} from "@/components/beer/leafletRuntime"

type MobileBeerFinderProps = {
  locations: BeerFinderLocation[]
  initialSelectedBeers: string[]
  initialZip: string | null
}

type BeerFilterOption = {
  id: string
  name: string
  imageAlt: string
  imageSrc: string
}

type VenueFilterId = "grab-and-go" | "stay-and-enjoy"
type CurrentLocation = {
  latitude: number
  longitude: number
}

const ZIP_CODE_PATTERN = /^\d{5}$/
const MOBILE_LOCATION_BATCH_SIZE = 5
const MOBILE_MAP_TILE_ZOOM = 15
const MOBILE_STORE_MARKER_LOGO_SRC = "/main_logo_no_text.png"
const MOBILE_STORE_MARKER_GLOW = "rgba(52, 201, 121, 0.18)"

const beerFinderCoverFilterOptions: BeerFilterOption[] = mockBeers
  .map((beer) => {
    if (!beer.image.primarySrc) {
      return null
    }

    return {
      id: beer.id,
      name: beer.name,
      imageAlt: beer.image.alt,
      imageSrc: beer.image.primarySrc,
    }
  })
  .filter((option): option is BeerFilterOption => option !== null)

const beerFinderCoverFilterNameSet = new Set(beerFinderCoverFilterOptions.map((option) => option.name))

const beerFinderVenueFilterOptions: Array<{
  id: VenueFilterId
  label: string
  matchesCustomerType: (customerType: string | null) => boolean
}> = [
  {
    id: "grab-and-go",
    label: "Grab and Go",
    matchesCustomerType: (customerType) => customerType === "Shop",
  },
  {
    id: "stay-and-enjoy",
    label: "Stay and Enjoy",
    matchesCustomerType: (customerType) => customerType === "Bar / Restaurant" || customerType === "Club",
  },
]

function normalizeBeerFilterText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "")
}

function isCompleteZipCode(value: string) {
  return ZIP_CODE_PATTERN.test(value.trim())
}

function isFiniteCurrentLocation(value: CurrentLocation | null | undefined): value is CurrentLocation {
  return (
    value !== null &&
    value !== undefined &&
    Number.isFinite(value.latitude) &&
    Number.isFinite(value.longitude)
  )
}

function CarryoutBagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M7.5 9.25V7.75C7.5 5.4 9.29 3.75 12 3.75C14.71 3.75 16.5 5.4 16.5 7.75V9.25"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M5.25 8.75H18.75L17.55 19.04C17.4 20.32 16.31 21.25 15.02 21.25H8.98C7.69 21.25 6.6 20.32 6.45 19.04L5.25 8.75Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BeerGlassIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g transform="translate(-1.6 -1.6) scale(1.14)">
        <path
          d="M7.9 8.35H16.1L15.26 19.28C15.18 20.27 14.36 21.03 13.37 21.03H10.63C9.64 21.03 8.82 20.27 8.74 19.28L7.9 8.35Z"
          fill="#D89A2B"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path
          d="M7.15 8.45C6.59 8.08 6.25 7.47 6.25 6.78C6.25 5.69 7.13 4.81 8.22 4.81C8.45 4.81 8.66 4.85 8.86 4.92C9.22 3.97 10.14 3.3 11.22 3.3C12.35 3.3 13.31 4.03 13.64 5.05C13.93 4.83 14.29 4.7 14.68 4.7C15.3 4.7 15.86 5.03 16.18 5.52C16.41 5.42 16.67 5.36 16.95 5.36C17.95 5.36 18.75 6.16 18.75 7.16C18.75 7.69 18.53 8.16 18.18 8.5"
          fill="#F5F0E2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.1 10.55V17.4"
          stroke="currentColor"
          strokeWidth="1.45"
          strokeLinecap="round"
          opacity="0.35"
        />
      </g>
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 7.5h15" />
      <path d="M7.5 12h9" />
      <path d="M10.5 16.5h3" />
    </svg>
  )
}

function formatDistance(distanceInMiles: number) {
  if (distanceInMiles < 1) {
    return `${distanceInMiles.toFixed(1)} miles away`
  }

  if (distanceInMiles < 10) {
    return `${distanceInMiles.toFixed(1)} mi`
  }

  return `${Math.round(distanceInMiles)} mi`
}

function calculateDistanceInMiles(origin: CurrentLocation, destination: CurrentLocation) {
  const earthRadiusMiles = 3958.8
  const latitudeDelta = ((destination.latitude - origin.latitude) * Math.PI) / 180
  const longitudeDelta = ((destination.longitude - origin.longitude) * Math.PI) / 180
  const originLatitudeRadians = (origin.latitude * Math.PI) / 180
  const destinationLatitudeRadians = (destination.latitude * Math.PI) / 180

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(originLatitudeRadians) * Math.cos(destinationLatitudeRadians) * Math.sin(longitudeDelta / 2) ** 2

  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateValue))
}

function formatMobileAddress(address: string | null) {
  if (!address) {
    return null
  }

  return address.replace(/,\s*United States of America$/i, ", MA")
}

function isLocationCoordinateSet(location: BeerFinderLocation): location is BeerFinderLocation & CurrentLocation {
  return (
    location.latitude !== null &&
    location.longitude !== null &&
    Number.isFinite(location.latitude) &&
    Number.isFinite(location.longitude)
  )
}

function toMapTileCoordinate(value: number, zoom: number) {
  return Math.floor(value * 2 ** zoom)
}

function buildMiniMapTileUrl(location: CurrentLocation) {
  const zoom = MOBILE_MAP_TILE_ZOOM
  const latitudeRadians = (location.latitude * Math.PI) / 180
  const x = toMapTileCoordinate((location.longitude + 180) / 360, zoom)
  const y = toMapTileCoordinate(
    (1 - Math.log(Math.tan(latitudeRadians) + 1 / Math.cos(latitudeRadians)) / Math.PI) / 2,
    zoom
  )

  return `/api/map-tiles/${zoom}/${x}/${y}?r=1`
}

function buildMiniMapStoreIcon(leaflet: LeafletRuntime) {
  return leaflet.divIcon({
    className: "beer-finder-mini-map-store-icon",
    html: `
      <div style="display:flex;width:34px;height:34px;align-items:center;justify-content:center;border-radius:999px;background:rgba(255,255,255,0.96);box-shadow:0 0 0 7px ${MOBILE_STORE_MARKER_GLOW}, 0 10px 18px rgba(15,23,42,0.18);">
        <img
          src="${MOBILE_STORE_MARKER_LOGO_SRC}"
          alt=""
          style="display:block;width:28px;height:28px;object-fit:contain;"
        />
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  })
}

function buildMiniMapCurrentLocationIcon(leaflet: LeafletRuntime) {
  return leaflet.divIcon({
    className: "beer-finder-mini-map-current-icon",
    html: `
      <div style="
        width:16px;
        height:16px;
        border-radius:999px;
        background:#f59e0b;
        border:3px solid rgba(255,255,255,0.98);
        box-shadow:0 0 0 7px rgba(245,158,11,0.16), 0 8px 18px rgba(15,23,42,0.16);
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

function MapPinIcon() {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-[0_0_0_7px_rgba(52,201,121,0.18),0_10px_18px_rgba(15,23,42,0.18)]">
      <Image
        src={MOBILE_STORE_MARKER_LOGO_SRC}
        alt=""
        width={30}
        height={30}
        className="h-8 w-8 rounded-full object-contain"
        aria-hidden="true"
      />
    </span>
  )
}

function MobileBeerFinderMiniMap({
  location,
  currentLocation,
  leafletReady,
}: {
  location: CurrentLocation
  currentLocation: CurrentLocation | null
  leafletReady: boolean
}) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const leafletMapRef = useRef<LeafletMap | null>(null)
  const markersLayerRef = useRef<LeafletLayerGroup | null>(null)
  const fitSignatureRef = useRef<string | null>(null)

  useEffect(() => {
    fitSignatureRef.current = null
  }, [location.latitude, location.longitude])

  useEffect(() => {
    const leaflet = getLeaflet()

    if (!leafletReady || !mapRef.current || leafletMapRef.current || !leaflet) {
      return
    }

    const map = leaflet.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
      zoomSnap: 0,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 200,
      minZoom: 2,
      maxZoom: 18,
      inertia: false,
      preferCanvas: true,
    }).setView([location.latitude, location.longitude], 15)

    leaflet.tileLayer("/api/map-tiles/{z}/{x}/{y}?r={r}", {
      maxZoom: 20,
      detectRetina: true,
    }).addTo(map)

    markersLayerRef.current = leaflet.layerGroup().addTo(map)
    leafletMapRef.current = map

    const handleResize = () => {
      map.invalidateSize()
    }

    window.addEventListener("resize", handleResize)
    const resizeTimeout = window.setTimeout(handleResize, 0)

    return () => {
      window.clearTimeout(resizeTimeout)
      window.removeEventListener("resize", handleResize)
      map.remove()
      leafletMapRef.current = null
      markersLayerRef.current = null
      fitSignatureRef.current = null
    }
  }, [leafletReady, location.latitude, location.longitude])

  useEffect(() => {
    const leaflet = getLeaflet()
    const map = leafletMapRef.current
    const markersLayer = markersLayerRef.current

    if (!leaflet || !map || !markersLayer) {
      return
    }

    markersLayer.clearLayers()

    const points: Array<[number, number]> = [[location.latitude, location.longitude]]

    markersLayer.addLayer(
      leaflet.marker([location.latitude, location.longitude], {
        icon: buildMiniMapStoreIcon(leaflet),
      })
    )

    if (currentLocation) {
      points.push([currentLocation.latitude, currentLocation.longitude])
      markersLayer.addLayer(
        leaflet.marker([currentLocation.latitude, currentLocation.longitude], {
          icon: buildMiniMapCurrentLocationIcon(leaflet),
        })
      )
    }

    const signature = JSON.stringify(points)

    if (fitSignatureRef.current !== signature) {
      fitSignatureRef.current = signature

      if (points.length > 1) {
        map.fitBounds(points, {
          padding: [28, 28],
          maxZoom: 16,
          animate: false,
        })
      } else {
        map.setView(points[0], 15.25, {
          animate: false,
        })
      }
    }

    map.invalidateSize()
  }, [currentLocation, location.latitude, location.longitude])

  return <div ref={mapRef} className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true" />
}

function MobileBeerFinderLocationCard({
  location,
  distanceLabel,
  beerLabel,
  matchingBeers,
  currentLocation,
  leafletReady,
}: {
  location: BeerFinderLocation
  distanceLabel: string | null
  beerLabel: string
  matchingBeers: string[]
  currentLocation: CurrentLocation | null
  leafletReady: boolean
}) {
  const displayAddress = formatMobileAddress(location.address)

  return (
    <article className="overflow-hidden rounded-[24px] border border-black/10 bg-white/88 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
      <div className="grid grid-cols-2 gap-3 p-3 sm:p-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-black/42">
            {distanceLabel ?? "Distance unavailable"}
          </p>
          <h3 className="mt-1 font-heading text-[1.45rem] leading-[0.95] text-black">{location.name}</h3>
          <p className="mt-2 text-sm leading-6 text-black/68">{displayAddress ?? "Address unavailable"}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60">
              {location.customerType ?? "Retailer"}
            </span>
            <span className="inline-flex items-center rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/60">
              {beerLabel}
            </span>
          </div>

          {matchingBeers.length > 0 ? (
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/46">
              Matching beers: {matchingBeers.join(", ")}
            </p>
          ) : (
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/46">
              Last seen {formatDate(location.lastSeenDate)}
            </p>
          )}
        </div>

        <div className="relative flex min-h-[8.75rem] w-full overflow-hidden rounded-[18px] border border-black/10 bg-[#dce4ec] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.26)]">
          {hasCoordinates(location) ? (
            <div className="absolute inset-0">
              <Image
                src={buildMiniMapTileUrl(location)}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 25vw, 112px"
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/[0.03] text-[10px] font-semibold uppercase tracking-[0.16em] text-black/50">
              Map unavailable
            </div>
          )}
          {leafletReady && hasCoordinates(location) ? (
            <MobileBeerFinderMiniMap
              location={{ latitude: location.latitude, longitude: location.longitude }}
              currentLocation={currentLocation}
              leafletReady={leafletReady}
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(15,23,42,0.14))]" />
          {!leafletReady && hasCoordinates(location) ? (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <MapPinIcon />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function MobileBeerFinder({
  locations,
  initialSelectedBeers,
  initialZip,
}: MobileBeerFinderProps) {
  const router = useRouter()
  const [zipCode, setZipCode] = useState(() => initialZip ?? "")
  const [beerFilterSearch, setBeerFilterSearch] = useState("")
  const [selectedVenueFilters, setSelectedVenueFilters] = useState<VenueFilterId[]>([])
  const [selectedBeerFilters, setSelectedBeerFilters] = useState(() =>
    initialSelectedBeers.filter((beerName) => beerFinderCoverFilterNameSet.has(beerName))
  )
  const [zipSearchCoordinates, setZipSearchCoordinates] = useState<CurrentLocation | null>(null)
  const [isZipLookupPending, setIsZipLookupPending] = useState(false)
  const [zipLookupError, setZipLookupError] = useState<string | null>(null)
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation | null>(null)
  const [isLocatingCurrentLocation, setIsLocatingCurrentLocation] = useState(false)
  const [currentLocationError, setCurrentLocationError] = useState<string | null>(null)
  const [leafletReady, setLeafletReady] = useState(false)
  const [visibleLocationCount, setVisibleLocationCount] = useState(MOBILE_LOCATION_BATCH_SIZE)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDrawerRendered, setIsDrawerRendered] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const openTimerRef = useRef<number | null>(null)
  const closeTimerRef = useRef<number | null>(null)
  const scrollYRef = useRef(0)
  const previousBodyStyleRef = useRef<{
    position: string
    top: string
    width: string
    overflow: string
    touchAction: string
  } | null>(null)
  const filterMenuRef = useRef<HTMLDivElement | null>(null)
  const filterButtonRef = useRef<HTMLButtonElement | null>(null)

  const trimmedZipCode = zipCode.trim()
  const isValidZipCode = isCompleteZipCode(trimmedZipCode)

  const selectedBeerFilterSet = useMemo(() => new Set(selectedBeerFilters), [selectedBeerFilters])
  const selectedVenueFilterSet = useMemo(() => new Set(selectedVenueFilters), [selectedVenueFilters])
  const hasBeerFilters = selectedBeerFilters.length > 0
  const hasVenueFilters = selectedVenueFilters.length > 0
  const hasActiveFilters = hasBeerFilters || hasVenueFilters
  const activeFilterCount = selectedBeerFilters.length + selectedVenueFilters.length

  const beerFilterOptions = useMemo(() => {
    return beerFinderCoverFilterOptions.filter((option) => {
      if (!beerFilterSearch.trim()) {
        return true
      }

      return normalizeBeerFilterText(option.name).includes(normalizeBeerFilterText(beerFilterSearch))
    })
  }, [beerFilterSearch])

  const canClearAllFilters = hasActiveFilters || Boolean(beerFilterSearch.trim())
  const activeSearchLocation = currentLocation ?? zipSearchCoordinates
  const activeSearchLocationLabel = currentLocation
    ? "your current location"
    : zipSearchCoordinates
      ? `ZIP code ${initialZip?.trim() ?? ""}`
      : null

  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const matchesVenue =
        selectedVenueFilterSet.size === 0 ||
        beerFinderVenueFilterOptions.some(
          (option) => selectedVenueFilterSet.has(option.id) && option.matchesCustomerType(location.customerType)
        )

      const matchesBeer =
        selectedBeerFilterSet.size === 0 || location.beers.some((beerName) => selectedBeerFilterSet.has(beerName))

      return matchesVenue && matchesBeer
    })
  }, [locations, selectedBeerFilterSet, selectedVenueFilterSet])

  const distanceSortedLocations = useMemo(() => {
    if (!activeSearchLocation) {
      return filteredLocations
    }

    return [...filteredLocations].sort((left, right) => {
      const leftDistance = isLocationCoordinateSet(left)
        ? calculateDistanceInMiles(activeSearchLocation, left)
        : Number.POSITIVE_INFINITY
      const rightDistance = isLocationCoordinateSet(right)
        ? calculateDistanceInMiles(activeSearchLocation, right)
        : Number.POSITIVE_INFINITY

      if (leftDistance !== rightDistance) {
        return leftDistance - rightDistance
      }

      return left.name.localeCompare(right.name)
    })
  }, [activeSearchLocation, filteredLocations])

  const visibleLocations = useMemo(
    () => distanceSortedLocations.slice(0, visibleLocationCount),
    [distanceSortedLocations, visibleLocationCount]
  )
  const canLoadMoreLocations = visibleLocationCount < distanceSortedLocations.length

  useEffect(() => {
    setVisibleLocationCount(MOBILE_LOCATION_BATCH_SIZE)
  }, [activeSearchLocation?.latitude, activeSearchLocation?.longitude, selectedBeerFilters, selectedVenueFilters])

  useEffect(() => {
    const trimmedZip = initialZip?.trim() ?? ""

    if (!trimmedZip) {
      setZipSearchCoordinates(null)
      setIsZipLookupPending(false)
      setZipLookupError(null)
      return
    }

    const abortController = new AbortController()
    const lookupTimeout = window.setTimeout(async () => {
      setIsZipLookupPending(true)
      setZipLookupError(null)

      try {
        const response = await fetch(`/api/geocode?query=${encodeURIComponent(trimmedZip)}`, {
          signal: abortController.signal,
          cache: "no-store",
        })

        if (!response.ok) {
          setZipSearchCoordinates(null)
          setZipLookupError(`Unable to locate ZIP code ${trimmedZip}.`)
          return
        }

        const payload = (await response.json()) as {
          coordinates: CurrentLocation | null
        }

        const resolvedCoordinates = isFiniteCurrentLocation(payload.coordinates) ? payload.coordinates : null

        setZipSearchCoordinates(resolvedCoordinates)
        setZipLookupError(resolvedCoordinates ? null : `Unable to locate ZIP code ${trimmedZip}.`)
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setZipSearchCoordinates(null)
          setZipLookupError(`Unable to locate ZIP code ${trimmedZip}.`)
        }
      } finally {
        setIsZipLookupPending(false)
      }
    }, 350)

    return () => {
      abortController.abort()
      window.clearTimeout(lookupTimeout)
    }
  }, [initialZip])

  const handleUseCurrentLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setCurrentLocationError("Current location is not available in this browser.")
      return
    }

    setIsLocatingCurrentLocation(true)
    setCurrentLocationError(null)
    setCurrentLocation(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (Number.isFinite(position.coords.latitude) && Number.isFinite(position.coords.longitude)) {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        } else {
          setCurrentLocationError("Unable to retrieve your current location.")
        }

        setIsLocatingCurrentLocation(false)
      },
      (error) => {
        setCurrentLocationError(
          error.code === error.PERMISSION_DENIED
            ? "Location access was denied."
            : "Unable to retrieve your current location."
        )
        setIsLocatingCurrentLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  }, [])

  const clearAllFilters = () => {
    setSelectedBeerFilters([])
    setSelectedVenueFilters([])
    setBeerFilterSearch("")
  }

  const handleCloseFilterMenu = useCallback(() => {
    setIsMenuOpen(false)

    if (openTimerRef.current !== null) {
      window.cancelAnimationFrame(openTimerRef.current)
      openTimerRef.current = null
    }

    setIsDrawerOpen(false)

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
    }

    closeTimerRef.current = window.setTimeout(() => {
      setIsDrawerRendered(false)
      closeTimerRef.current = null
    }, 240)
  }, [])

  const handleToggleFilterMenu = () => {
    if (isMenuOpen) {
      handleCloseFilterMenu()
      return
    }

    setIsMenuOpen(true)
    setIsDrawerRendered(true)

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    if (openTimerRef.current !== null) {
      window.cancelAnimationFrame(openTimerRef.current)
    }

    openTimerRef.current = window.requestAnimationFrame(() => {
      setIsDrawerOpen(true)
      openTimerRef.current = null
    })
  }

  const drawerSwipeHandlers = useSwipeToCloseDrawer({
    enabled: isDrawerOpen,
    onClose: handleCloseFilterMenu,
  })

  useEffect(() => {
    if (!isDrawerRendered) {
      return
    }

    const bodyStyle = document.body.style
    const htmlStyle = document.documentElement.style
    const scrollY = window.scrollY
    const openedLocation = `${window.location.pathname}${window.location.search}`

    scrollYRef.current = scrollY
    previousBodyStyleRef.current = {
      position: bodyStyle.position,
      top: bodyStyle.top,
      width: bodyStyle.width,
      overflow: bodyStyle.overflow,
      touchAction: bodyStyle.touchAction,
    }

    bodyStyle.position = "fixed"
    bodyStyle.top = `-${scrollY}px`
    bodyStyle.width = "100%"
    bodyStyle.overflow = "hidden"
    bodyStyle.touchAction = "none"
    htmlStyle.overflow = "hidden"
    htmlStyle.touchAction = "none"

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseFilterMenu()
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      const previousBodyStyle = previousBodyStyleRef.current

      if (previousBodyStyle) {
        bodyStyle.position = previousBodyStyle.position
        bodyStyle.top = previousBodyStyle.top
        bodyStyle.width = previousBodyStyle.width
        bodyStyle.overflow = previousBodyStyle.overflow
        bodyStyle.touchAction = previousBodyStyle.touchAction
      } else {
        bodyStyle.position = ""
        bodyStyle.top = ""
        bodyStyle.width = ""
        bodyStyle.overflow = ""
        bodyStyle.touchAction = ""
      }

      htmlStyle.overflow = ""
      htmlStyle.touchAction = ""
      window.removeEventListener("keydown", onKeyDown)

      if (
        `${window.location.pathname}${window.location.search}` === openedLocation &&
        window.scrollY !== scrollYRef.current
      ) {
        window.scrollTo(0, scrollYRef.current)
      }
    }
  }, [handleCloseFilterMenu, isDrawerRendered])

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null

      if (
        (filterMenuRef.current && filterMenuRef.current.contains(target)) ||
        (filterButtonRef.current && filterButtonRef.current.contains(target))
      ) {
        return
      }

      handleCloseFilterMenu()
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return
      }

      handleCloseFilterMenu()
      filterButtonRef.current?.focus()
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("touchstart", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("touchstart", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleCloseFilterMenu, isMenuOpen])

  const toggleBeerFilter = (beerName: string) => {
    setSelectedBeerFilters((currentFilters) =>
      currentFilters.includes(beerName)
        ? currentFilters.filter((currentBeerName) => currentBeerName !== beerName)
        : [...currentFilters, beerName]
    )
  }

  const toggleVenueFilter = (filterId: VenueFilterId) => {
    setSelectedVenueFilters((currentFilters) =>
      currentFilters.includes(filterId)
        ? currentFilters.filter((currentFilterId) => currentFilterId !== filterId)
        : [...currentFilters, filterId]
    )
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isValidZipCode) {
      return
    }

    const params = new URLSearchParams()
    params.set("zip", trimmedZipCode)

    for (const beerName of selectedBeerFilters) {
      params.append("beer", beerName)
    }

    scrollToTopInstantly()
    router.push(`/beer-finder?${params.toString()}`)
  }

  return (
    <>
      <Script
        id="mobile-beer-finder-leaflet-script"
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
        strategy="afterInteractive"
        onLoad={() => setLeafletReady(true)}
      />

      <section className="overflow-x-hidden bg-background text-foreground md:hidden">
        <div className="w-full px-0 py-11">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 sm:px-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-end gap-2">
                <h2 className="max-w-[56%] font-heading text-[clamp(4.1rem,20vw,6.5rem)] uppercase leading-[0.8] tracking-[-0.1em] text-black">
                  <span className="flex flex-col gap-6">
                    <span className="block">FIND</span>
                    <span className="block">OUR</span>
                    <span className="block">BEER</span>
                  </span>
                </h2>

                <div className="pointer-events-none relative -mr-4 h-[clamp(220px,60vw,324px)] w-[clamp(146px,44vw,224px)] shrink-0 self-end">
                  <Image
                    src="/my_juicy_gf_cutout.png"
                    alt=""
                    fill
                    sizes="(max-width: 768px) 44vw, 224px"
                    className="origin-bottom-right object-contain rotate-[3deg]"
                    priority={false}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  ref={filterButtonRef}
                  type="button"
                  onClick={handleToggleFilterMenu}
                  aria-expanded={isMenuOpen}
                  aria-controls="beer-finder-mobile-filter-menu"
                  aria-haspopup="dialog"
                  className={`inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border px-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] transition ${
                    hasActiveFilters
                      ? "border-[#0f172a] bg-[#0f172a] text-white"
                      : "border-black/10 bg-white/95 text-neutral-700 hover:text-neutral-900"
                  }`}
                >
                  <span>Filter</span>
                  <FilterIcon />
                  {hasActiveFilters ? (
                    <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold leading-none text-[#0f172a] shadow-sm">
                      {activeFilterCount}
                    </span>
                  ) : null}
                </button>
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
                  className="h-12 w-full border-b border-black/25 bg-transparent px-0 text-[0.92rem] font-semibold uppercase tracking-[0.16em] text-black outline-none transition placeholder:text-black/35 focus:border-black"
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
                onClick={handleUseCurrentLocation}
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

      {isZipLookupPending || isLocatingCurrentLocation || zipLookupError || currentLocationError || activeSearchLocation ? (
        <section className="overflow-x-hidden bg-background px-4 pb-8 text-foreground sm:px-6">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-3">
            {isZipLookupPending || isLocatingCurrentLocation ? (
              <div className="rounded-[24px] border border-black/10 bg-white/82 px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
                <p className="font-heading text-2xl leading-tight text-black">
                  {isZipLookupPending
                    ? `Looking up ZIP code ${initialZip?.trim() ?? trimmedZipCode}`
                    : "Finding nearby locations"}
                </p>
                <p className="mt-2 text-sm leading-6 text-black/62">
                  {isZipLookupPending
                    ? "Pulling the closest stores into view."
                    : "Using your current location to sort the nearest stores."}
                </p>
              </div>
            ) : null}

            {zipLookupError ? (
              <div className="rounded-[24px] border border-black/10 bg-white/82 px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
                <p className="font-heading text-2xl leading-tight text-black">ZIP code not found</p>
                <p className="mt-2 text-sm leading-6 text-black/62">{zipLookupError}</p>
              </div>
            ) : null}

            {currentLocationError ? (
              <div className="rounded-[24px] border border-black/10 bg-white/82 px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
                <p className="font-heading text-2xl leading-tight text-black">Current location unavailable</p>
                <p className="mt-2 text-sm leading-6 text-black/62">{currentLocationError}</p>
              </div>
            ) : null}

            {activeSearchLocation ? (
              <>
                <div className="flex flex-wrap items-end justify-between gap-3 px-1">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/42">
                      Nearby locations
                    </p>
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/42">
                    Sorted by {activeSearchLocationLabel}
                  </p>
                </div>

                {distanceSortedLocations.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-black/12 bg-black/[0.02] px-6 py-8 text-center shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                    <p className="font-heading text-2xl text-black">No matching locations</p>
                    <p className="mt-3 text-sm leading-6 text-black/62">
                      Try clearing the beer or venue filters to widen the list.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {visibleLocations.map((location) => {
                      const matchingBeers = hasBeerFilters
                        ? location.beers.filter((beerName) => selectedBeerFilterSet.has(beerName))
                        : []
                      const beerLabel = hasBeerFilters
                        ? `${matchingBeers.length} matching beer${matchingBeers.length === 1 ? "" : "s"}`
                        : `${location.beers.length} beer${location.beers.length === 1 ? "" : "s"}`
                      const distanceLabel =
                        isLocationCoordinateSet(location) && activeSearchLocation
                          ? formatDistance(calculateDistanceInMiles(activeSearchLocation, location))
                          : null

                      return (
                        <MobileBeerFinderLocationCard
                          key={location.customerId}
                          location={location}
                          distanceLabel={distanceLabel}
                          beerLabel={beerLabel}
                          matchingBeers={matchingBeers}
                          currentLocation={currentLocation}
                          leafletReady={leafletReady}
                        />
                      )
                    })}

                    {canLoadMoreLocations ? (
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleLocationCount((currentCount) =>
                            Math.min(currentCount + MOBILE_LOCATION_BATCH_SIZE, distanceSortedLocations.length)
                          )
                        }
                        className="w-full rounded-[24px] border border-black/10 bg-white/86 px-4 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-black/72 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:border-black/20 hover:text-black"
                      >
                        Load more locations
                      </button>
                    ) : null}
                  </div>
                )}
              </>
            ) : null}
          </div>
        </section>
      ) : null}

      {isDrawerRendered && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[100] md:hidden">
              <button
                type="button"
                aria-label="Close beer filters"
                className={`absolute inset-0 bg-black/35 transition-opacity duration-200 ${
                  isDrawerOpen ? "opacity-100" : "opacity-0"
                }`}
                onClick={handleCloseFilterMenu}
              />

              <div
                ref={filterMenuRef}
                id="beer-finder-mobile-filter-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Filter"
                className={`absolute inset-y-0 right-0 flex h-full w-[min(22rem,88vw)] flex-col overflow-y-auto overscroll-contain border-l border-black/10 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-out touch-pan-y ${
                  isDrawerOpen ? "translate-x-0" : "translate-x-full"
                }`}
                {...drawerSwipeHandlers}
              >
                <div className="flex items-start justify-between gap-4 border-b border-black/10 px-5 py-4">
                  <h2 className="font-heading text-3xl leading-none text-black">Filter</h2>

                  <button
                    type="button"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-neutral-800 transition hover:border-black/20 hover:text-neutral-950"
                    aria-label="Close beer filters"
                    onClick={handleCloseFilterMenu}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <path d="M6 6l12 12" />
                      <path d="M18 6 6 18" />
                    </svg>
                  </button>
                </div>

                <div className="grid gap-6 px-5 py-5 pb-10">
                  <div className="grid gap-3">
                    <form
                      onSubmit={(event) => {
                        event.preventDefault()
                      }}
                      className="flex min-w-0 flex-1 items-center gap-2"
                    >
                      <label className="relative min-w-0 flex-1">
                        <span className="sr-only">Search for a beer</span>
                        <input
                          type="search"
                          value={beerFilterSearch}
                          onChange={(event) => setBeerFilterSearch(event.target.value)}
                          placeholder="Search beers"
                          className="h-10 w-full rounded-full border border-black/10 bg-white px-4 text-xs font-medium uppercase tracking-[0.18em] leading-none text-black outline-none transition placeholder:text-black/35 focus:border-black/25"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={clearAllFilters}
                        disabled={!canClearAllFilters}
                        className={`inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white px-4 text-xs font-semibold uppercase tracking-[0.18em] leading-none text-black/70 transition hover:border-black/20 hover:text-black ${
                          !canClearAllFilters ? "cursor-not-allowed opacity-50" : ""
                        }`}
                      >
                        Clear all
                      </button>
                    </form>

                    <div className="flex items-start gap-2 rounded-2xl border border-amber-300/70 bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-950">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 9v4" />
                        <path d="M12 16.5h.01" />
                        <path d="M10.29 4.86 2.81 18a2 2 0 0 0 1.73 3h15a2 2 0 0 0 1.73-3L13.71 4.86a2 2 0 0 0-3.42 0Z" />
                      </svg>
                      <p>
                        Search is whack right now.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div className="grid gap-2 pb-4">
                      {beerFinderVenueFilterOptions.map((option) => {
                        const isSelected = selectedVenueFilterSet.has(option.id)
                        const Icon = option.id === "grab-and-go" ? CarryoutBagIcon : BeerGlassIcon

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => toggleVenueFilter(option.id)}
                            aria-pressed={isSelected}
                            className={`group relative flex items-center gap-3 rounded-[18px] border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f172a]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                              isSelected
                                ? "border-[#0f172a] bg-[#0f172a] text-white shadow-[0_12px_24px_rgba(15,23,42,0.14)]"
                                : "border-black/10 bg-white/20 text-black hover:bg-white/45"
                            }`}
                          >
                            <span
                              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] border transition ${
                                isSelected
                                  ? "border-white/14 bg-white/10 text-white"
                                  : "border-black/10 bg-white/70 text-black/80"
                              }`}
                            >
                              <Icon className="h-4.5 w-4.5" />
                            </span>
                            <span className="min-w-0 text-sm font-semibold leading-tight">{option.label}</span>
                            <span
                              className={`ml-auto inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-black transition ${
                                isSelected
                                  ? "border-white bg-white text-[#0f172a]"
                                  : "border-black/10 bg-white/80 text-transparent group-hover:border-black/20"
                              }`}
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                          </button>
                        )
                      })}
                    </div>

                    {beerFilterOptions.length === 0 ? (
                      <div className="flex h-full min-h-[220px] items-center justify-center rounded-[24px] border border-dashed border-black/10 bg-black/[0.02] px-6 text-center">
                        <div>
                          <p className="font-heading text-2xl text-black">No beers found</p>
                          <p className="mt-3 text-sm leading-6 text-black/60">
                            Try a different beer name or clear all filters.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="-mx-5 overflow-hidden sm:-mx-5">
                        <div className="grid grid-cols-2 gap-0 sm:grid-cols-3">
                          {beerFilterOptions.map((beerOption) => {
                            const isChecked = selectedBeerFilterSet.has(beerOption.name)

                            return (
                              <button
                                key={beerOption.id}
                                type="button"
                                onClick={() => toggleBeerFilter(beerOption.name)}
                                aria-pressed={isChecked}
                                className={`group relative w-full cursor-pointer text-left shadow-[inset_0_0_0_1px_rgba(15,23,42,0.10)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f172a]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                                  isChecked ? "bg-[#0f172a] text-white" : "bg-white/20 text-black hover:bg-white/45"
                                }`}
                              >
                                <div className="relative aspect-[3/4] w-full overflow-hidden">
                                  <Image
                                    src={beerOption.imageSrc}
                                    alt={beerOption.imageAlt}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 50vw, 33vw"
                                  />
                                  {isChecked ? (
                                    <div className="absolute inset-0 z-0 bg-[#0f172a]/35" aria-hidden="true" />
                                  ) : null}
                                  <span
                                    className={`absolute left-1.5 top-1.5 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full border shadow-[0_10px_18px_rgba(15,23,42,0.14)] transition ${
                                      isChecked
                                        ? "border-white bg-white text-[11px] font-black text-[#0f172a] group-hover:scale-[1.06] group-hover:border-white"
                                        : "border-white/90 bg-white/0 group-hover:scale-[1.06] group-hover:border-white group-hover:bg-white/15"
                                    }`}
                                    aria-hidden="true"
                                  >
                                    {isChecked ? "✓" : null}
                                  </span>
                                </div>
                                <span className="sr-only">{beerOption.name}</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  )
}

export default MobileBeerFinder
