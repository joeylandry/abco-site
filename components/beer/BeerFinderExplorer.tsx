"use client"

import Image from "next/image"
import Script from "next/script"
import { useSearchParams } from "next/navigation"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type MutableRefObject,
} from "react"
import { mockBeers } from "@/app/beer/mockBeers"
import type { BeerFinderLocation } from "@/lib/breww"
import { BEER_FINDER_MOBILE_ICON_SRC } from "@/components/beer/mobileBeerArtwork"
import {
  getLeaflet,
  hasCoordinates,
  type LeafletLayerGroup,
  type LeafletMap,
  type LeafletMarker,
  type LeafletRuntime,
} from "@/components/beer/leafletRuntime"

type BeerFinderExplorerProps = {
  locations: BeerFinderLocation[]
  initialSelectedBeers: string[]
  initialZip: string | null
}

type CurrentLocation = {
  latitude: number
  longitude: number
}

type SearchLocationMatch = {
  query: string
  coordinates: CurrentLocation | null
}

type BeerFilterOption = {
  id: string
  name: string
  imageAlt: string
  imageSrc: string
}

type VenueFilterId = "grab-and-go" | "stay-and-enjoy"

type VenueFilterOption = {
  id: VenueFilterId
  label: string
  description: string
  matchesCustomerType: (customerType: string | null) => boolean
}

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

const beerFinderCoverFilterOptionsById = new Map(beerFinderCoverFilterOptions.map((option) => [option.id, option]))
const beerFinderCoverFilterOptionIdByName = new Map(beerFinderCoverFilterOptions.map((option) => [option.name, option.id]))

const beerFinderCoverFilterNameSet = new Set(beerFinderCoverFilterOptions.map((option) => option.name))

const beerFinderVenueFilterOptions: VenueFilterOption[] = [
  {
    id: "grab-and-go",
    label: "Grab and Go",
    description: "Package stores and bottle shops",
    matchesCustomerType: (customerType) => customerType === "Shop",
  },
  {
    id: "stay-and-enjoy",
    label: "Stay and Enjoy",
    description: "Bars, restaurants, and clubs",
    matchesCustomerType: (customerType) => customerType === "Bar / Restaurant" || customerType === "Club",
  },
]

const DEFAULT_CENTER = {
  latitude: 42.3876,
  longitude: -71.1437,
}

const MAP_MAX_BOUNDS: [[number, number], [number, number]] = [
  [41.05, -74.65],
  [43.35, -69.1],
]

const MAP_MIN_ZOOM = 8
const MAP_MAX_ZOOM = 17
const ZOOM_CONTROL_STEP = 1
const SEARCH_RADIUS_MILES = 1
const ZIP_CODE_PATTERN = /^\d{5}$/
const TRACKPAD_WHEEL_ZOOM_SENSITIVITY = 0.0045
const TRACKPAD_GESTURE_ZOOM_SENSITIVITY = 4.25

function normalizeBeerFilterText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "")
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

const beerCatalog = mockBeers.map((beer) => ({
  beer,
  normalizedName: normalizeBeerFilterText(beer.name),
}))

const beerCatalogByNormalizedName = new Map(beerCatalog.map(({ beer, normalizedName }) => [normalizedName, beer]))

function stripLeadingOrTrailingYear(value: string) {
  return value.replace(/^(19|20)\d{2}/, "").replace(/(19|20)\d{2}$/, "")
}

function resolveBeerCatalogMatch(beerName: string) {
  const normalizedQuery = normalizeBeerFilterText(beerName)

  if (!normalizedQuery) {
    return null
  }

  const exactMatch = beerCatalogByNormalizedName.get(normalizedQuery)

  if (exactMatch) {
    return exactMatch
  }

  const normalizedQueryWithoutYear = stripLeadingOrTrailingYear(normalizedQuery)

  let bestMatch: (typeof mockBeers)[number] | null = null
  let bestScore = 0

  for (const { beer, normalizedName } of beerCatalog) {
    if (!normalizedName) {
      continue
    }

    const normalizedNameWithoutYear = stripLeadingOrTrailingYear(normalizedName)
    const matchesDirect =
      normalizedName.includes(normalizedQuery) || normalizedQuery.includes(normalizedName)
    const matchesWithoutYear =
      normalizedNameWithoutYear &&
      normalizedQueryWithoutYear &&
      (normalizedNameWithoutYear.includes(normalizedQueryWithoutYear) ||
        normalizedQueryWithoutYear.includes(normalizedNameWithoutYear))

    if (!matchesDirect && !matchesWithoutYear) {
      continue
    }

    const score = matchesWithoutYear
      ? Math.min(normalizedNameWithoutYear.length, normalizedQueryWithoutYear.length)
      : Math.min(normalizedName.length, normalizedQuery.length)

    if (score > bestScore) {
      bestScore = score
      bestMatch = beer
    }
  }

  return bestMatch
}

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateValue))
}

type LeafletContinuousZoomMap = LeafletMap & {
  mouseEventToContainerPoint?: (event: WheelEvent) => { x: number; y: number }
  setZoomAround?: (around: { x: number; y: number }, zoom: number, options?: { animate?: boolean }) => void
}

function normalizeWheelDelta(delta: number, deltaMode: number) {
  if (deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return delta * 16
  }

  if (deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return delta * 800
  }

  return delta
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

function formatBeerCountLabel(count: number) {
  return `${count} beer${count === 1 ? "" : "s"}`
}

function formatBeerMatchLabel(count: number) {
  return `${count} match${count === 1 ? "" : "es"}`
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

function toRadians(value: number) {
  return (value * Math.PI) / 180
}

function calculateDistanceInMiles(from: CurrentLocation, to: { latitude: number; longitude: number }) {
  const earthRadiusMiles = 3958.8
  const latitudeDelta = toRadians(to.latitude - from.latitude)
  const longitudeDelta = toRadians(to.longitude - from.longitude)
  const fromLatitude = toRadians(from.latitude)
  const toLatitude = toRadians(to.latitude)
  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2

  return 2 * earthRadiusMiles * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatMilesCount(value: number) {
  if (value < 10) {
    const label = value.toFixed(1).replace(/\.0$/, "")
    return { label, isSingular: label === "1" }
  }

  const label = String(Math.round(value))
  return { label, isSingular: label === "1" }
}

function formatMilesPlain(value: number) {
  const { label, isSingular } = formatMilesCount(value)
  return `${label} ${isSingular ? "mile" : "miles"}`
}

function formatMilesHyphenated(value: number) {
  const { label } = formatMilesCount(value)
  return `${label}-mile`
}

function formatDistance(distanceInMiles: number) {
  if (distanceInMiles < 10) {
    return `${distanceInMiles.toFixed(1)} mi`
  }

  return `${Math.round(distanceInMiles)} mi`
}

function resolveMinimumMapViewRadiusMiles(options: {
  center: CurrentLocation
  visibleLocations: Array<{ latitude: number; longitude: number }>
  baseRadiusMiles: number
}) {
  const { center, visibleLocations, baseRadiusMiles } = options

  if (visibleLocations.length === 0) {
    return baseRadiusMiles
  }

  const milesPerLatitudeDegree = 69
  const milesPerLongitudeDegree = Math.max(69 * Math.cos(toRadians(center.latitude)), 0.01)

  let bestRequiredMiles = Number.POSITIVE_INFINITY

  for (const location of visibleLocations) {
    const requiredMiles = Math.max(
      Math.abs(location.latitude - center.latitude) * milesPerLatitudeDegree,
      Math.abs(location.longitude - center.longitude) * milesPerLongitudeDegree
    )

    if (requiredMiles < bestRequiredMiles) {
      bestRequiredMiles = requiredMiles
    }
  }

  if (!Number.isFinite(bestRequiredMiles)) {
    return baseRadiusMiles
  }

  return Math.max(baseRadiusMiles, bestRequiredMiles)
}

function buildRadiusBounds(center: CurrentLocation, radiusMiles: number): [[number, number], [number, number]] {
  const latitudeDelta = radiusMiles / 69
  const longitudeDelta = radiusMiles / Math.max(69 * Math.cos(toRadians(center.latitude)), 0.01)

  return [
    [center.latitude - latitudeDelta, center.longitude - longitudeDelta],
    [center.latitude + latitudeDelta, center.longitude + longitudeDelta],
  ]
}

function applyBeerFinderMapView(options: {
  map: LeafletMap
  currentLocation: CurrentLocation | null
  prioritizedMapLocation: CurrentLocation | null
  visibleLocations: Array<{ latitude: number; longitude: number }>
  fittedBoundsRef: MutableRefObject<boolean>
  ignoreNextMapMoveEndRef: MutableRefObject<boolean>
}) {
  const {
    map,
    currentLocation,
    prioritizedMapLocation,
    visibleLocations,
    fittedBoundsRef,
    ignoreNextMapMoveEndRef,
  } = options

  const hasFiniteCurrentLocation = isFiniteCurrentLocation(currentLocation)
  const hasFinitePrioritizedLocation = isFiniteCurrentLocation(prioritizedMapLocation)

  if (hasFinitePrioritizedLocation) {
    const mapViewRadiusMiles = resolveMinimumMapViewRadiusMiles({
      center: prioritizedMapLocation,
      visibleLocations,
      baseRadiusMiles: SEARCH_RADIUS_MILES,
    })

    ignoreNextMapMoveEndRef.current = true
    map.flyToBounds(buildRadiusBounds(prioritizedMapLocation, mapViewRadiusMiles), {
      padding: [48, 48],
      maxZoom: 14.5,
      duration: fittedBoundsRef.current ? 1.2 : 1.6,
      easeLinearity: 0.18,
    })
    fittedBoundsRef.current = true
    return
  }

  if (visibleLocations.length === 0) {
    ignoreNextMapMoveEndRef.current = true
    map.setView([DEFAULT_CENTER.latitude, DEFAULT_CENTER.longitude], 10.5, {
      animate: fittedBoundsRef.current,
    })
    return
  }

  if (visibleLocations.length === 1 && !currentLocation) {
    ignoreNextMapMoveEndRef.current = true
    map.setView([visibleLocations[0].latitude, visibleLocations[0].longitude], 12.2, {
      animate: fittedBoundsRef.current,
    })
    fittedBoundsRef.current = true
    return
  }

  const fitBoundsPoints = hasFiniteCurrentLocation
    ? [
        [currentLocation.latitude, currentLocation.longitude] as [number, number],
        ...visibleLocations.map((location) => [location.latitude, location.longitude] as [number, number]),
      ]
    : visibleLocations.map((location) => [location.latitude, location.longitude] as [number, number])

  ignoreNextMapMoveEndRef.current = true
  map.fitBounds(fitBoundsPoints, {
    padding: [72, 72],
    animate: fittedBoundsRef.current,
    maxZoom: 11.5,
  })
  fittedBoundsRef.current = true
}

function buildDirectionsUrl(location: BeerFinderLocation) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    location.address ?? `${location.name}, Massachusetts`
  )}`
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function buildMarkerTooltipMarkup(location: BeerFinderLocation, distanceLabel: string | null, beerLabel: string) {
  const detailLabel = [distanceLabel, beerLabel].filter(Boolean).join(" • ")

  return `<div style="display:block;min-width:0;border-radius:14px;background:rgba(15,23,42,0.96);padding:10px 12px;color:rgba(255,255,255,0.96);box-shadow:0 16px 28px rgba(15,23,42,0.18)"><p style="margin:0;font:700 13px/1.25 var(--font-ui-role);color:rgba(255,255,255,0.98);white-space:nowrap">${escapeHtml(location.name)}</p><p style="margin:3px 0 0;font:600 10px/1.25 var(--font-ui-role);letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.72);white-space:nowrap">${escapeHtml(detailLabel)}</p></div>`
}

function buildLocationIcon(leaflet: LeafletRuntime, isSelected: boolean) {
  const size = isSelected ? 40 : 34

  return leaflet.divIcon({
    className: "beer-finder-map-marker",
    html: `
      <div style="
        width:${size}px;
        height:${size}px;
        border-radius:999px;
        background:rgba(255,255,255,0.96);
        border:4px solid rgba(255,255,255,0.96);
        box-shadow:0 0 0 7px rgba(52, 201, 121, 0.18), 0 10px 18px rgba(15,23,42,0.18);
        display:flex;
        align-items:center;
        justify-content:center;
        transform:${isSelected ? "scale(1.05)" : "scale(1)"};
      ">
        <img
          src="${BEER_FINDER_MOBILE_ICON_SRC}"
          alt=""
          style="display:block;width:${isSelected ? 30 : 26}px;height:${isSelected ? 30 : 26}px;object-fit:contain;"
        />
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

function updateLocationMarkerState(leaflet: LeafletRuntime, marker: LeafletMarker, isSelected: boolean) {
  marker.setIcon(buildLocationIcon(leaflet, isSelected))
  marker.setZIndexOffset(isSelected ? 1000 : 0)
}

function buildCurrentLocationIcon(leaflet: LeafletRuntime) {
  return leaflet.divIcon({
    className: "beer-finder-map-marker beer-finder-map-marker-current",
    html: `
      <div style="
        width:20px;
        height:20px;
        border-radius:999px;
        background:#f59e0b;
        border:4px solid rgba(255,255,255,0.98);
        box-shadow:0 0 0 8px rgba(245,158,11,0.16), 0 12px 24px rgba(15,23,42,0.18);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })
}

function BeerFinderExplorerInner({
  locations,
  initialSelectedBeers,
  initialZip,
}: BeerFinderExplorerProps) {
  const [leafletReady, setLeafletReady] = useState(false)
  const [showMapZoomHint, setShowMapZoomHint] = useState(false)
  const [locationSearch, setLocationSearch] = useState(() => (initialZip && isCompleteZipCode(initialZip) ? initialZip.trim() : ""))
  const [submittedLocationSearch, setSubmittedLocationSearch] = useState<string | null>(() =>
    initialZip && isCompleteZipCode(initialZip) ? initialZip.trim() : null
  )
  const [currentLocation, setCurrentLocation] = useState<CurrentLocation | null>(null)
  const [mapSearchCenter, setMapSearchCenter] = useState<CurrentLocation | null>(null)
  const [searchLocationMatch, setSearchLocationMatch] = useState<SearchLocationMatch | null>(null)
  const [searchValidationError, setSearchValidationError] = useState<string | null>(null)
  const [isLocatingCurrentLocation, setIsLocatingCurrentLocation] = useState(false)
  const [currentLocationError, setCurrentLocationError] = useState<string | null>(null)
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null)
  const [beerFilterSearch, setBeerFilterSearch] = useState("")
  const [selectedVenueFilters, setSelectedVenueFilters] = useState<VenueFilterId[]>([])
  const [selectedBeerFilters, setSelectedBeerFilters] = useState<string[]>(() => {
    const initialFilters = initialSelectedBeers
      .map((beerName) => beerName.trim())
      .filter((beerName) => beerName && beerFinderCoverFilterNameSet.has(beerName))
    return [...new Set(initialFilters)]
  })
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(() => selectedBeerFilters.length > 0)
  const [beerFilterOptionOrder, setBeerFilterOptionOrder] = useState<string[]>(() => {
    const baseOrder = beerFinderCoverFilterOptions.map((option) => option.id)

    const selectedIds: string[] = []
    const seen = new Set<string>()

    for (const beerName of initialSelectedBeers) {
      const selectedId = beerFinderCoverFilterOptionIdByName.get(beerName)
      if (!selectedId || seen.has(selectedId)) {
        continue
      }

      selectedIds.push(selectedId)
      seen.add(selectedId)
    }

    return selectedIds.length > 0 ? [...selectedIds, ...baseOrder.filter((id) => !seen.has(id))] : baseOrder
  })

  const mapRef = useRef<HTMLDivElement | null>(null)
  const leafletMapRef = useRef<LeafletMap | null>(null)
  const markersLayerRef = useRef<LeafletLayerGroup | null>(null)
  const markersRef = useRef<Map<number, LeafletMarker>>(new Map())
  const selectedLocationIdRef = useRef<number | null>(null)
  const previousSelectedLocationIdRef = useRef<number | null>(null)
  const fittedBoundsRef = useRef(false)
  const filterMenuRef = useRef<HTMLDivElement | null>(null)
  const filterButtonRef = useRef<HTMLButtonElement | null>(null)
  const suppressAutoRecenterRef = useRef(false)
  const ignoreNextMapMoveEndRef = useRef(true)
  const zoomHintTimeoutRef = useRef<number | null>(null)
  const zoomHintLastShownAtRef = useRef(0)
  const useAppleCommandIcon = isApplePlatform()

  useEffect(() => {
    fittedBoundsRef.current = false
  }, [locations, selectedBeerFilters, selectedVenueFilters])

  useEffect(() => {
    const trimmedSearch = submittedLocationSearch?.trim()

    if (!trimmedSearch) {
      return
    }

    const abortController = new AbortController()
    const lookupTimeout = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/geocode?query=${encodeURIComponent(trimmedSearch)}`, {
          signal: abortController.signal,
          cache: "no-store",
        })

        if (!response.ok) {
          setSearchLocationMatch({
            query: trimmedSearch,
            coordinates: null,
          })
          return
        }

        const payload = (await response.json()) as {
          coordinates: {
            latitude: number
            longitude: number
          } | null
        }

        const resolvedCoordinates = isFiniteCurrentLocation(payload.coordinates)
          ? {
              latitude: payload.coordinates.latitude,
              longitude: payload.coordinates.longitude,
            }
          : null

        setSearchLocationMatch({
          query: trimmedSearch,
          coordinates: resolvedCoordinates,
        })
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setSearchLocationMatch({
            query: trimmedSearch,
            coordinates: null,
          })
        }
      }
    }, 350)

    return () => {
      abortController.abort()
      window.clearTimeout(lookupTimeout)
    }
  }, [submittedLocationSearch])

  const selectedVenueFilterSet = useMemo(() => new Set(selectedVenueFilters), [selectedVenueFilters])
  const selectedBeerFilterSet = useMemo(() => new Set(selectedBeerFilters), [selectedBeerFilters])
  const hasVenueFilters = selectedVenueFilters.length > 0
  const hasBeerFilters = selectedBeerFilters.length > 0
  const hasActiveFilters = hasVenueFilters || hasBeerFilters
  const activeFilterCount = selectedVenueFilters.length + selectedBeerFilters.length

  const selectedVenueFilterOptions = useMemo(
    () => beerFinderVenueFilterOptions.filter((option) => selectedVenueFilterSet.has(option.id)),
    [selectedVenueFilterSet]
  )

  const doesLocationBeerMatchSelectedFilters = useCallback(
    (beerName: string) => {
      if (selectedBeerFilterSet.has(beerName)) {
        return true
      }

      const matchedBeer = resolveBeerCatalogMatch(beerName)

      return matchedBeer ? selectedBeerFilterSet.has(matchedBeer.name) : false
    },
    [selectedBeerFilterSet]
  )

  const doesLocationMatchSelectedVenueFilters = useCallback(
    (location: BeerFinderLocation) => {
      if (selectedVenueFilterSet.size === 0) {
        return true
      }

      return beerFinderVenueFilterOptions.some(
        (option) => selectedVenueFilterSet.has(option.id) && option.matchesCustomerType(location.customerType)
      )
    },
    [selectedVenueFilterSet]
  )

  const beerFilterOptions = useMemo(() => {
    const options: BeerFilterOption[] = []
    const seen = new Set<string>()

    for (const id of beerFilterOptionOrder) {
      const option = beerFinderCoverFilterOptionsById.get(id)
      if (!option) {
        continue
      }

      options.push(option)
      seen.add(id)
    }

    for (const option of beerFinderCoverFilterOptions) {
      if (seen.has(option.id)) {
        continue
      }

      options.push(option)
    }

    return options
  }, [beerFilterOptionOrder])

  const handleCloseFilterMenu = useCallback(() => {
    setIsFilterMenuOpen(false)
    setBeerFilterOptionOrder((currentOrder) => {
      const selectedIds: string[] = []
      const unselectedIds: string[] = []
      const seen = new Set<string>()
      const baseOrder = currentOrder.length > 0 ? currentOrder : beerFinderCoverFilterOptions.map((option) => option.id)

      for (const id of baseOrder) {
        const option = beerFinderCoverFilterOptionsById.get(id)
        if (!option) {
          continue
        }

        seen.add(id)

        if (selectedBeerFilterSet.has(option.name)) {
          selectedIds.push(id)
        } else {
          unselectedIds.push(id)
        }
      }

      for (const option of beerFinderCoverFilterOptions) {
        if (seen.has(option.id)) {
          continue
        }

        if (selectedBeerFilterSet.has(option.name)) {
          selectedIds.push(option.id)
        } else {
          unselectedIds.push(option.id)
        }
      }

      return [...selectedIds, ...unselectedIds]
    })
  }, [selectedBeerFilterSet])

  const handleToggleFilterMenu = useCallback(() => {
    if (isFilterMenuOpen) {
      handleCloseFilterMenu()
      return
    }

    setIsFilterMenuOpen(true)
  }, [handleCloseFilterMenu, isFilterMenuOpen])

  const normalizedBeerFilterSearch = normalizeBeerFilterText(beerFilterSearch)
  const searchableBeerFilterOptions = useMemo(() => {
    if (!normalizedBeerFilterSearch) {
      return beerFilterOptions
    }

    return beerFilterOptions.filter((option) =>
      normalizeBeerFilterText(option.name).includes(normalizedBeerFilterSearch)
    )
  }, [beerFilterOptions, normalizedBeerFilterSearch])

  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const matchesVenue = doesLocationMatchSelectedVenueFilters(location)
      const matchesBeer = !hasBeerFilters || location.beers.some(doesLocationBeerMatchSelectedFilters)

      return matchesVenue && matchesBeer
    })
  }, [doesLocationBeerMatchSelectedFilters, doesLocationMatchSelectedVenueFilters, hasBeerFilters, locations])

  const hasSubmittedLocationSearch = submittedLocationSearch !== null
  const hasResolvedSearchLocation = submittedLocationSearch !== null && searchLocationMatch?.query === submittedLocationSearch
  const isSearchLookupPending = hasSubmittedLocationSearch && !hasResolvedSearchLocation
  const activeSearchLocation = hasResolvedSearchLocation ? searchLocationMatch.coordinates : null
  const distanceReference = activeSearchLocation ?? mapSearchCenter ?? currentLocation
  const shouldShowSearchRadiusSummary = Boolean(activeSearchLocation || mapSearchCenter)
  const locationsWithinSearchRadius =
    shouldShowSearchRadiusSummary && distanceReference
      ? filteredLocations.filter(
          (location) =>
            hasCoordinates(location) && calculateDistanceInMiles(distanceReference, location) <= SEARCH_RADIUS_MILES
        )
      : []

  const activeSelectedLocationId =
    filteredLocations.find((location) => location.customerId === selectedLocationId)?.customerId ?? null

  const selectedLocation = filteredLocations.find((location) => location.customerId === activeSelectedLocationId) ?? null

  const locationDistances = distanceReference
    ? new Map(
        filteredLocations
          .filter(hasCoordinates)
          .map((location) => [location.customerId, calculateDistanceInMiles(distanceReference, location)])
      )
    : null

  const distanceSortedLocations = locationDistances
    ? [...filteredLocations].sort((left, right) => {
        const leftDistance = locationDistances.get(left.customerId) ?? Number.POSITIVE_INFINITY
        const rightDistance = locationDistances.get(right.customerId) ?? Number.POSITIVE_INFINITY

        if (leftDistance !== rightDistance) {
          return leftDistance - rightDistance
        }

        return left.name.localeCompare(right.name)
      })
    : [...filteredLocations]

  const displayedLocations = distanceSortedLocations
  const visibleLocations = displayedLocations.filter(hasCoordinates)
  const markerDistanceReference = distanceReference ?? DEFAULT_CENTER
  const nearbyLocationCount = locationsWithinSearchRadius.length
  const unmappedCount = displayedLocations.length - visibleLocations.length
  const prioritizedMapLocation = activeSearchLocation ?? currentLocation

  let mapStatusMessage: string | null = null

  if (isSearchLookupPending) {
    mapStatusMessage = `Centering a ${formatMilesHyphenated(SEARCH_RADIUS_MILES)} map view around ZIP code ${submittedLocationSearch}.`
  } else if (hasSubmittedLocationSearch && hasResolvedSearchLocation && !activeSearchLocation) {
    mapStatusMessage = "That ZIP code could not be located."
  } else if (hasActiveFilters && displayedLocations.length === 0) {
    mapStatusMessage = "No locations currently match the selected filters."
  } else if (activeSearchLocation) {
    mapStatusMessage =
      nearbyLocationCount > 0
        ? `${nearbyLocationCount} mapped location${nearbyLocationCount === 1 ? "" : "s"} within ${formatMilesPlain(SEARCH_RADIUS_MILES)} of ZIP code ${submittedLocationSearch}.`
        : `No mapped locations found within ${formatMilesPlain(SEARCH_RADIUS_MILES)} of ZIP code ${submittedLocationSearch}.`
  } else if (visibleLocations.length === 0) {
    mapStatusMessage = "No saved map coordinates are available for the current dataset."
  } else if (unmappedCount > 0) {
    mapStatusMessage = `${unmappedCount} location${unmappedCount === 1 ? "" : "s"} still need server-side map coordinates.`
  }

  useEffect(() => {
    if (!isFilterMenuOpen) {
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
  }, [handleCloseFilterMenu, isFilterMenuOpen])

  function handleLocationSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedSearch = locationSearch.trim()

    if (!trimmedSearch) {
      setSubmittedLocationSearch(null)
      setSearchValidationError(null)
      setSearchLocationMatch(null)
      setMapSearchCenter(null)
      suppressAutoRecenterRef.current = false
      return
    }

    if (!isCompleteZipCode(trimmedSearch)) {
      setSearchValidationError("Enter a full 5-digit ZIP code, then press Search.")
      return
    }

    setSearchValidationError(null)
    setSelectedLocationId(null)
    setCurrentLocation(null)
    setCurrentLocationError(null)
    setMapSearchCenter(null)
    suppressAutoRecenterRef.current = false
    setSubmittedLocationSearch(trimmedSearch)
  }

  const handleUseCurrentLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setCurrentLocationError("Current location is not available in this browser.")
      return
    }

    setIsLocatingCurrentLocation(true)
    setCurrentLocationError(null)
    setSubmittedLocationSearch(null)
    setSearchLocationMatch(null)
    setSearchValidationError(null)
    setMapSearchCenter(null)
    suppressAutoRecenterRef.current = false

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

  const handleStopUsingCurrentLocation = useCallback(() => {
    setCurrentLocation(null)
    setCurrentLocationError(null)
    setIsLocatingCurrentLocation(false)
    suppressAutoRecenterRef.current = false
  }, [])

  function toggleBeerFilter(beerName: string) {
    setSelectedLocationId(null)
    setSelectedBeerFilters((currentFilters) =>
      currentFilters.includes(beerName)
        ? currentFilters.filter((currentBeerName) => currentBeerName !== beerName)
        : [...currentFilters, beerName]
    )
  }

  function toggleVenueFilter(filterId: VenueFilterId) {
    setSelectedLocationId(null)
    setSelectedVenueFilters((currentFilters) =>
      currentFilters.includes(filterId)
        ? currentFilters.filter((currentFilterId) => currentFilterId !== filterId)
        : [...currentFilters, filterId]
    )
  }

  function clearSelectedFilters() {
    setSelectedLocationId(null)
    setSelectedBeerFilters([])
    setSelectedVenueFilters([])
  }

  function handleClearAllFilters() {
    clearSelectedFilters()
  }

  function handleBeerFilterSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isFilterMenuOpen) {
      return
    }

    handleCloseFilterMenu()
    setSelectedLocationId(null)
    suppressAutoRecenterRef.current = false
    const map = leafletMapRef.current
    if (map) {
      applyBeerFinderMapView({
        map,
        currentLocation,
        prioritizedMapLocation,
        visibleLocations,
        fittedBoundsRef,
        ignoreNextMapMoveEndRef,
      })
    }
  }

  function handleClearBeerFilterSearch() {
    setBeerFilterSearch("")
    clearSelectedFilters()
  }

  function handleZoom(direction: "in" | "out") {
    const map = leafletMapRef.current

    if (!map) {
      return
    }

    const currentZoom = map.getZoom()
    const nextZoom =
      direction === "in"
        ? Math.min(currentZoom + ZOOM_CONTROL_STEP, MAP_MAX_ZOOM)
        : Math.max(currentZoom - ZOOM_CONTROL_STEP, MAP_MIN_ZOOM)

    if (nextZoom === currentZoom) {
      return
    }

    const center = map.getCenter()
    suppressAutoRecenterRef.current = true
    ignoreNextMapMoveEndRef.current = true
    map.flyTo([center.lat, center.lng], nextZoom, {
      animate: true,
      duration: 0.6,
      easeLinearity: 0.2,
    })
  }

  function focusMapAroundLocation(center: CurrentLocation) {
    const map = leafletMapRef.current

    if (!map) {
      return
    }

    ignoreNextMapMoveEndRef.current = true
    map.flyToBounds(buildRadiusBounds(center, SEARCH_RADIUS_MILES), {
      padding: [48, 48],
      maxZoom: 14.5,
      duration: fittedBoundsRef.current ? 1.2 : 1.6,
      easeLinearity: 0.18,
    })
    fittedBoundsRef.current = true
  }

  useEffect(() => {
    const leaflet = getLeaflet()

    if (!leafletReady || !mapRef.current || leafletMapRef.current || !leaflet) {
      return
    }

    const map = leaflet.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      dragging: true,
      doubleClickZoom: "center",
      touchZoom: true,
      boxZoom: false,
      keyboard: true,
      zoomSnap: 0,
      zoomDelta: 0.65,
      wheelPxPerZoomLevel: 240,
      wheelDebounceTime: 0,
      minZoom: MAP_MIN_ZOOM,
      maxZoom: MAP_MAX_ZOOM,
      maxBounds: MAP_MAX_BOUNDS,
      maxBoundsViscosity: 1,
      inertia: true,
      preferCanvas: true,
    }).setView([DEFAULT_CENTER.latitude, DEFAULT_CENTER.longitude], 10.5)

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

    const handleMoveEnd = () => {
      if (ignoreNextMapMoveEndRef.current) {
        ignoreNextMapMoveEndRef.current = false
        return
      }

      suppressAutoRecenterRef.current = true
    }

    map.on("moveend", handleMoveEnd)

    const mapContainer = (typeof (map as unknown as { getContainer?: () => HTMLElement }).getContainer === "function"
      ? (map as unknown as { getContainer: () => HTMLElement }).getContainer()
      : mapRef.current) as HTMLElement

    const zoomHintDurationMs = 1600
    const zoomHintCooldownMs = 3500

    const showZoomHint = (respectCooldown = true) => {
      const now = Date.now()
      if (respectCooldown && now - zoomHintLastShownAtRef.current < zoomHintCooldownMs) {
        return
      }

      zoomHintLastShownAtRef.current = now
      setShowMapZoomHint(true)

      if (zoomHintTimeoutRef.current) {
        window.clearTimeout(zoomHintTimeoutRef.current)
      }

      zoomHintTimeoutRef.current = window.setTimeout(() => {
        setShowMapZoomHint(false)
        zoomHintTimeoutRef.current = null
      }, zoomHintDurationMs)
    }

    const applyContinuousZoom = (deltaZoom: number, wheelEvent?: WheelEvent) => {
      if (!Number.isFinite(deltaZoom) || deltaZoom === 0) {
        return
      }

      const currentZoom = map.getZoom()
      const nextZoom = Math.max(MAP_MIN_ZOOM, Math.min(MAP_MAX_ZOOM, currentZoom + deltaZoom))

      if (Math.abs(nextZoom - currentZoom) < 0.001) {
        return
      }

      suppressAutoRecenterRef.current = true
      ignoreNextMapMoveEndRef.current = true

      const mapWithContinuousZoom = map as LeafletContinuousZoomMap

      if (
        wheelEvent &&
        typeof mapWithContinuousZoom.mouseEventToContainerPoint === "function" &&
        typeof mapWithContinuousZoom.setZoomAround === "function"
      ) {
        mapWithContinuousZoom.setZoomAround(mapWithContinuousZoom.mouseEventToContainerPoint(wheelEvent), nextZoom, {
          animate: false,
        })
        return
      }

      const center = map.getCenter()
      map.setView([center.lat, center.lng], nextZoom, {
        animate: false,
      })
    }

    const handleTrackpadWheel = (event: WheelEvent) => {
      const isZoomModifierPressed = event.ctrlKey || event.metaKey
      const isAlternateModifierPressed = event.shiftKey || event.altKey
      const deltaY = normalizeWheelDelta(event.deltaY, event.deltaMode)
      const deltaX = normalizeWheelDelta(event.deltaX, event.deltaMode)

      if (!isZoomModifierPressed) {
        if (isAlternateModifierPressed) {
          event.preventDefault()
          event.stopImmediatePropagation()
          event.stopPropagation()
          setShowMapZoomHint(false)
          return
        }

        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          showZoomHint(false)
        }
        return
      }

      event.preventDefault()
      event.stopImmediatePropagation()
      event.stopPropagation()

      applyContinuousZoom(-deltaY * TRACKPAD_WHEEL_ZOOM_SENSITIVITY, event)
    }

    let gestureLastScale = 1

    const handleGestureStart = (event: Event) => {
      gestureLastScale = 1
      ;(event as Event & { preventDefault?: () => void }).preventDefault?.()
    }

    const handleGestureChange = (event: Event) => {
      const gestureEvent = event as Event & { scale?: number; preventDefault?: () => void }
      gestureEvent.preventDefault?.()

      const scale = typeof gestureEvent.scale === "number" && Number.isFinite(gestureEvent.scale) ? gestureEvent.scale : 1
      const safeScale = Math.max(scale, 0.0001)
      const safeLastScale = Math.max(gestureLastScale, 0.0001)
      const delta = Math.log2(safeScale / safeLastScale)
      gestureLastScale = safeScale

      applyContinuousZoom(delta * TRACKPAD_GESTURE_ZOOM_SENSITIVITY)
    }

    const handleGestureEnd = (event: Event) => {
      gestureLastScale = 1
      ;(event as Event & { preventDefault?: () => void }).preventDefault?.()
    }

    mapContainer.addEventListener("wheel", handleTrackpadWheel, { passive: false, capture: true })
    mapContainer.addEventListener("gesturestart", handleGestureStart, { passive: false, capture: true })
    mapContainer.addEventListener("gesturechange", handleGestureChange, { passive: false, capture: true })
    mapContainer.addEventListener("gestureend", handleGestureEnd, { passive: false, capture: true })

    return () => {
      window.clearTimeout(resizeTimeout)
      window.removeEventListener("resize", handleResize)
      map.off("moveend", handleMoveEnd)
      mapContainer.removeEventListener("wheel", handleTrackpadWheel, true)
      mapContainer.removeEventListener("gesturestart", handleGestureStart, true)
      mapContainer.removeEventListener("gesturechange", handleGestureChange, true)
      mapContainer.removeEventListener("gestureend", handleGestureEnd, true)
      if (zoomHintTimeoutRef.current) {
        window.clearTimeout(zoomHintTimeoutRef.current)
        zoomHintTimeoutRef.current = null
      }
      map.remove()
      leafletMapRef.current = null
      markersLayerRef.current = null
      markersRef.current = new Map()
    }
  }, [leafletReady])

  useEffect(() => {
    const leaflet = getLeaflet()
    const markersLayer = markersLayerRef.current

    if (!markersLayer || !leaflet) {
      return
    }

    markersLayer.clearLayers()
    markersRef.current.clear()

    if (currentLocation) {
      const currentLocationMarker = leaflet.marker([currentLocation.latitude, currentLocation.longitude], {
        icon: buildCurrentLocationIcon(leaflet),
      })

      currentLocationMarker.bindPopup(
        `<div style="min-width:180px"><p style="margin:0;font:700 16px/1.3 var(--font-heading-role);color:#111">Current location</p></div>`
      )
      markersLayer.addLayer(currentLocationMarker)
    }

    visibleLocations.forEach((location) => {
      const markerDistanceLabel = markerDistanceReference
        ? formatDistance(calculateDistanceInMiles(markerDistanceReference, location))
        : null
      const matchingBeerCount = location.beers.filter(doesLocationBeerMatchSelectedFilters).length
      const markerBeerLabel = hasBeerFilters
        ? formatBeerMatchLabel(matchingBeerCount)
        : formatBeerCountLabel(location.beers.length)
      const marker = leaflet.marker([location.latitude, location.longitude], {
        icon: buildLocationIcon(leaflet, false),
      })

      marker.on("click", () => {
        setSelectedLocationId(location.customerId)
        focusMapAroundLocation({ latitude: location.latitude, longitude: location.longitude })
      })

      marker.bindTooltip(buildMarkerTooltipMarkup(location, markerDistanceLabel, markerBeerLabel), {
        direction: "top",
        offset: [0, -22],
        opacity: 1,
        className: "beer-finder-marker-tooltip",
      })
      markersLayer.addLayer(marker)
      markersRef.current.set(location.customerId, marker)
    })

    if (selectedLocationIdRef.current !== null) {
      const selectedMarker = markersRef.current.get(selectedLocationIdRef.current)

      if (selectedMarker) {
        updateLocationMarkerState(leaflet, selectedMarker, true)
      }
    }
  }, [
    currentLocation,
    doesLocationBeerMatchSelectedFilters,
    hasBeerFilters,
    markerDistanceReference,
    visibleLocations,
  ])

  useEffect(() => {
    const leaflet = getLeaflet()

    if (!leaflet) {
      return
    }

    const previousSelectedLocationId = previousSelectedLocationIdRef.current

    if (previousSelectedLocationId !== null && previousSelectedLocationId !== activeSelectedLocationId) {
      const previousMarker = markersRef.current.get(previousSelectedLocationId)

      if (previousMarker) {
        updateLocationMarkerState(leaflet, previousMarker, false)
      }
    }

    if (activeSelectedLocationId !== null) {
      const selectedMarker = markersRef.current.get(activeSelectedLocationId)

      if (selectedMarker) {
        updateLocationMarkerState(leaflet, selectedMarker, true)
      }
    }

    selectedLocationIdRef.current = activeSelectedLocationId
    previousSelectedLocationIdRef.current = activeSelectedLocationId
  }, [activeSelectedLocationId])

  useEffect(() => {
    if (activeSelectedLocationId === null) {
      return
    }

    document
      .getElementById(`beer-finder-location-card-${activeSelectedLocationId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [activeSelectedLocationId])

  useEffect(() => {
    const map = leafletMapRef.current

    if (!map) {
      return
    }

    if (suppressAutoRecenterRef.current) {
      return
    }

    applyBeerFinderMapView({
      map,
      currentLocation,
      prioritizedMapLocation,
      visibleLocations,
      fittedBoundsRef,
      ignoreNextMapMoveEndRef,
    })
  }, [currentLocation, prioritizedMapLocation, visibleLocations])

  useEffect(() => {
    const desktopBreakpoint = window.matchMedia("(min-width: 1024px)")

    const applyScrollLock = () => {
      const shouldLock = desktopBreakpoint.matches

      document.documentElement.style.overflow = shouldLock ? "hidden" : ""
      document.body.style.overflow = shouldLock ? "hidden" : ""
    }

    applyScrollLock()
    desktopBreakpoint.addEventListener("change", applyScrollLock)

    return () => {
      desktopBreakpoint.removeEventListener("change", applyScrollLock)
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
    }
  }, [])

  return (
    <>
      <Script
        id="leaflet-script"
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
        strategy="afterInteractive"
        onReady={() => setLeafletReady(true)}
      />

      <section className="relative overflow-hidden px-7 pt-6 pb-10 sm:px-8 md:pt-8 md:pb-12 lg:h-[calc(100dvh-4.75rem)] lg:px-0 lg:py-0 lg:overflow-hidden">
        <div className="relative z-10 mx-auto max-w-[1500px] lg:h-full lg:max-w-none">
          <div className="grid items-start gap-5 lg:h-full lg:grid-cols-2 lg:gap-0">
            <div className="flex flex-col gap-4 lg:h-full lg:min-h-0 lg:w-full">
              <section className="relative h-[420px] overflow-hidden rounded-[24px] border border-black/10 bg-[#dfe6ee] sm:h-[520px] lg:h-full lg:rounded-none lg:border-0 lg:border-r lg:border-black/10 lg:bg-transparent">
                <div
                  ref={mapRef}
                  className="beer-finder-map absolute inset-0 z-0"
                  aria-label="Beer finder map showing wholesale locations"
                />

                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.12),transparent_24%,transparent_76%,rgba(255,255,255,0.1))]" />

                <div className="pointer-events-none absolute left-4 top-4 z-[950] sm:left-5 sm:top-5">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/78 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-black/62 shadow-[0_12px_24px_rgba(15,23,42,0.10)] backdrop-blur-sm [text-shadow:0_1px_10px_rgba(255,255,255,0.9)]">
                    <span className="relative flex h-2 w-2" aria-hidden="true">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    RECENT LOCATIONS
                  </div>
                </div>

                {showMapZoomHint ? (
                  <div className="pointer-events-none absolute inset-0 z-[960] flex items-center justify-center bg-[linear-gradient(180deg,rgba(15,23,42,0.34),rgba(15,23,42,0.48))] px-6 backdrop-blur-[1.5px]">
                    <div className="w-full max-w-[28rem] rounded-[30px] border border-white/12 bg-[#111111]/92 px-6 py-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.42)] sm:px-8 sm:py-7">
                      <div className="flex flex-wrap items-center justify-center gap-3 text-center">
                        <span className="font-heading text-[1.9rem] leading-none tracking-wide text-white sm:text-[2.15rem]">
                          Hold
                        </span>
                        <span className="inline-flex min-w-[3.1rem] items-center justify-center rounded-[14px] border border-white/14 bg-white/7 px-3 py-2 text-lg leading-none text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:min-w-[3.5rem] sm:text-xl">
                          {useAppleCommandIcon ? "⌘" : "Ctrl"}
                        </span>
                        <span className="text-xl leading-none text-white/72">+</span>
                        <span className="font-heading text-[1.9rem] leading-none tracking-wide text-white sm:text-[2.15rem]">
                          Scroll
                        </span>
                      </div>
                      <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-white/58 sm:text-[13px]">
                        to zoom the map
                      </p>
                    </div>
                  </div>
                ) : null}

                {mapStatusMessage ? (
                  <div className="pointer-events-none absolute inset-x-4 bottom-4 z-[950] sm:inset-x-6 sm:bottom-6">
                    <div className="max-w-[320px] text-sm font-semibold text-black/60 [text-shadow:0_1px_10px_rgba(255,255,255,0.9)]">
                      {mapStatusMessage}
                    </div>
                  </div>
                ) : null}

                <div className="absolute bottom-4 right-4 z-[950] pointer-events-auto sm:bottom-6 sm:right-6">
                  <div
                    className="overflow-hidden rounded-[18px] border border-black/10 bg-white/78 shadow-[0_12px_28px_rgba(15,23,42,0.18)] backdrop-blur-sm"
                    style={
                      {
                        "--beer-finder-zoom-size": "clamp(40px, 4.2vw, 52px)",
                      } as CSSProperties
                    }
                  >
                    <button
                      type="button"
                      onClick={() => handleZoom("in")}
                      aria-label="Zoom in"
                      className="flex h-[var(--beer-finder-zoom-size)] w-[var(--beer-finder-zoom-size)] items-center justify-center text-black/70 transition hover:bg-black/5 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-abco-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-[40%] w-[40%]"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M10 4.75v10.5M4.75 10h10.5"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                    <div className="h-px w-full bg-black/10" />
                    <button
                      type="button"
                      onClick={() => handleZoom("out")}
                      aria-label="Zoom out"
                      className="flex h-[var(--beer-finder-zoom-size)] w-[var(--beer-finder-zoom-size)] items-center justify-center text-black/70 transition hover:bg-black/5 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-abco-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-[40%] w-[40%]"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          d="M4.75 10h10.5"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
	              </section>
	            </div>

            <aside className="relative flex min-h-[420px] flex-col overflow-hidden rounded-[24px] border border-black/10 bg-white lg:h-full lg:min-h-0 lg:rounded-none lg:border-0 lg:bg-transparent">
              <div className="shrink-0 border-b border-black/10 px-6 py-3 sm:px-8 sm:py-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <h1 className="font-heading text-4xl leading-none text-black sm:text-5xl">Find Our Beer</h1>
	                    <button
	                      ref={filterButtonRef}
	                      type="button"
	                      onClick={handleToggleFilterMenu}
	                      aria-expanded={isFilterMenuOpen}
	                      aria-controls="beer-finder-filter-menu"
	                      className={`ml-auto inline-flex h-10 w-auto shrink-0 items-center justify-center gap-2 rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.18em] leading-none transition ${
	                        hasActiveFilters
	                          ? "border-[#0f172a] bg-[#0f172a] text-white hover:opacity-90"
                          : "border-black/10 bg-white text-black/70 hover:border-black/20 hover:text-black"
                      }`}
                    >
                      <span>Filter</span>
                      {hasActiveFilters ? (
                        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-white/18 px-1.5 py-1 text-[10px] leading-none text-white">
                          {activeFilterCount}
                        </span>
                      ) : null}
                    </button>
                  </div>

                  <div className="-mt-1 flex flex-col gap-3 sm:flex-row sm:items-start">
                    <form
                      onSubmit={handleLocationSearchSubmit}
                      className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center"
                    >
                      <label className="relative w-full min-w-0 flex-1">
                        <span className="sr-only">Search by ZIP code</span>
                        <input
                          type="search"
                          inputMode="numeric"
                          maxLength={5}
                          value={locationSearch}
                          onChange={(event) => {
                            setLocationSearch(event.target.value.replace(/\D+/g, "").slice(0, 5))
                            setSearchValidationError(null)
                          }}
                          placeholder="ZIP code"
                          className="h-10 w-full rounded-full border border-black/10 bg-white px-4 text-xs font-medium uppercase tracking-[0.18em] leading-none text-black outline-none transition placeholder:text-black/35 focus:border-black/25"
                        />
                      </label>
                      <button
                        type="submit"
                        className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-[#0f172a] bg-[#0f172a] px-4 text-xs font-semibold uppercase tracking-[0.18em] leading-none text-white transition hover:opacity-90"
                      >
                        Search
                      </button>
                    </form>
                    <div className="flex flex-col items-center gap-3 sm:shrink-0">
                      <button
                        type="button"
                        onClick={currentLocation ? handleStopUsingCurrentLocation : handleUseCurrentLocation}
                        disabled={isLocatingCurrentLocation}
                        className={`inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white px-4 text-xs font-semibold uppercase tracking-[0.18em] leading-none text-black/70 transition hover:border-black/20 hover:text-black ${
                          isLocatingCurrentLocation ? "cursor-wait opacity-70" : ""
                        }`}
                      >
                        {isLocatingCurrentLocation
                          ? "Locating..."
                          : currentLocation
                            ? "Stop using current location"
                            : "Use current location"}
                      </button>
                    </div>
                  </div>
                </div>
	                {hasActiveFilters ||
	                submittedLocationSearch ||
	                mapSearchCenter ||
	                  (currentLocation && !submittedLocationSearch) ||
	                  searchValidationError ||
	                  currentLocationError ? (
	                  <div className="mt-4 flex flex-col gap-3">
	                    {hasActiveFilters ? (
	                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/45">
	                        Showing locations matching the selected filters.
	                      </p>
	                    ) : null}
                    {submittedLocationSearch ? (
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/45">
                        {isSearchLookupPending
                          ? `Looking up ZIP code ${submittedLocationSearch}`
                          : activeSearchLocation
                            ? `List sorted by distance from ZIP code ${submittedLocationSearch}`
                            : `Unable to locate ZIP code ${submittedLocationSearch}`}
                      </p>
                    ) : null}
                    {!submittedLocationSearch && mapSearchCenter ? (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/42">
                          List sorted by distance from map area
                        </p>
                        <button
                          type="button"
                          onClick={() => setMapSearchCenter(null)}
                          className="inline-flex h-8 items-center justify-center rounded-full border border-black/10 bg-white px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/70 transition hover:border-black/20 hover:text-black active:scale-[0.98]"
                        >
                          Clear
                        </button>
                      </div>
                    ) : null}
                    {currentLocation && !submittedLocationSearch && !mapSearchCenter ? (
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/42">
                        Using current location to sort nearby spots
                      </p>
                    ) : null}
	                    {hasActiveFilters ? (
	                      <div className="flex flex-wrap items-center gap-2">
	                        {selectedVenueFilterOptions.map((option) => (
	                          <button
	                            key={option.id}
	                            type="button"
	                            onClick={() => toggleVenueFilter(option.id)}
	                            className="group inline-flex h-7 items-center gap-1.5 rounded-full border border-abco-blue/40 bg-abco-blue/12 px-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-abco-blue transition hover:border-abco-blue/55 hover:bg-abco-blue/18 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-abco-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
	                            aria-label={`Remove ${option.label}`}
	                          >
	                            {option.id === "grab-and-go" ? (
	                              <CarryoutBagIcon className="h-3.5 w-3.5" />
	                            ) : (
	                              <BeerGlassIcon className="h-3.5 w-3.5" />
	                            )}
	                            <span>{option.label}</span>
	                            <span
	                              aria-hidden="true"
	                              className="inline-flex h-4 w-4 items-center justify-center rounded-full text-abco-blue/80 transition group-hover:bg-abco-blue/20 group-hover:text-abco-blue"
	                            >
	                              ×
	                            </span>
	                          </button>
	                        ))}
	                        {selectedBeerFilters.map((beerName) => (
	                          <button
	                            key={beerName}
	                            type="button"
	                            onClick={() => toggleBeerFilter(beerName)}
	                            className="group inline-flex h-7 items-center gap-0 rounded-full border border-abco-blue/40 bg-abco-blue/12 px-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-abco-blue transition hover:bg-abco-blue/18 hover:border-abco-blue/55 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-abco-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
	                            aria-label={`Remove ${beerName}`}
	                          >
	                            <span>{beerName}</span>
	                            <span
	                              aria-hidden="true"
	                              className="inline-flex h-4 w-4 items-center justify-center rounded-full text-abco-blue/80 transition group-hover:bg-abco-blue/20 group-hover:text-abco-blue"
	                            >
	                              ×
	                            </span>
	                          </button>
	                        ))}
	                        <button
	                          type="button"
	                          onClick={handleClearAllFilters}
	                          className="inline-flex h-7 items-center justify-center rounded-full border border-[#0f172a] bg-[#0f172a] px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-abco-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
	                        >
	                          Clear all
	                        </button>
	                      </div>
	                    ) : null}
	                    {searchValidationError ? <p className="text-sm text-[#8b3a2f]">{searchValidationError}</p> : null}
	                    {currentLocationError ? <p className="text-sm text-[#8b3a2f]">{currentLocationError}</p> : null}
	                  </div>
	                ) : null}
              </div>

              {isFilterMenuOpen ? (
                <div className="absolute inset-0 z-30 bg-white">
                  <div ref={filterMenuRef} id="beer-finder-filter-menu" className="flex h-full flex-col">
                    <div className="border-b border-black/10 px-6 py-4 sm:px-8 sm:py-5">
	                      <div className="flex flex-col gap-3">
	                        <div className="flex items-center justify-between gap-3">
	                          <h1 className="font-heading text-4xl leading-none text-black sm:text-5xl">
	                            Filter Beer Finder
	                          </h1>
	                          <button
	                            type="button"
	                            onClick={handleCloseFilterMenu}
	                            className="ml-auto inline-flex h-10 w-auto shrink-0 items-center justify-center gap-2 rounded-full border px-4 text-xs font-semibold uppercase tracking-[0.18em] leading-none transition border-black/10 bg-white text-black/70 hover:border-black/20 hover:text-black"
	                          >
	                            <span>Close</span>
	                          </button>
                        </div>

			                        <div className="-mt-1 flex flex-col gap-3">
		                          <div className="flex w-full items-center gap-2">
		                            <form onSubmit={handleBeerFilterSearchSubmit} className="flex min-w-0 flex-1 items-center gap-2">
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
		                              type="submit"
		                              className="inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-[#0f172a] bg-[#0f172a] px-4 text-xs font-semibold uppercase tracking-[0.18em] leading-none text-white transition hover:opacity-90"
		                            >
		                              Search
		                            </button>
		                            </form>
				                            <button
				                              type="button"
				                              onClick={handleClearBeerFilterSearch}
				                              disabled={!beerFilterSearch && !hasActiveFilters}
				                              className={`ml-auto inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white px-4 text-xs font-semibold uppercase tracking-[0.18em] leading-none text-black/70 transition hover:border-black/20 hover:text-black ${
				                                !beerFilterSearch && !hasActiveFilters ? "cursor-not-allowed opacity-50" : ""
				                              }`}
				                            >
				                              Clear all
			                            </button>
			                          </div>
			                        </div>
			                        <div className="grid gap-2 sm:grid-cols-2">
			                          {beerFinderVenueFilterOptions.map((option) => {
			                            const isChecked = selectedVenueFilterSet.has(option.id)
			                            const Icon = option.id === "grab-and-go" ? CarryoutBagIcon : BeerGlassIcon

			                            return (
			                              <button
			                                key={option.id}
			                                type="button"
			                                onClick={() => toggleVenueFilter(option.id)}
			                                aria-pressed={isChecked}
			                                className={`group relative flex items-center gap-3 rounded-[18px] border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f172a]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
			                                  isChecked
			                                    ? "border-[#0f172a] bg-[#0f172a] text-white shadow-[0_12px_24px_rgba(15,23,42,0.14)]"
			                                    : "border-black/10 bg-white/20 text-black hover:bg-white/45"
			                                }`}
			                              >
			                                <span
			                                  className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] border transition ${
			                                    isChecked
			                                      ? "border-white/14 bg-white/10 text-white"
			                                      : "border-black/10 bg-white/70 text-black/80"
			                                  }`}
			                                >
			                                  <Icon className="h-4.5 w-4.5" />
			                                </span>
			                                <span className="min-w-0 text-sm font-semibold leading-tight">
			                                  {option.label}
			                                </span>
			                                <span
			                                  className={`ml-auto inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-black transition ${
			                                    isChecked
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
		                      </div>
		                    </div>
                    <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 sm:px-5 sm:pt-3">
	                        {beerFilterOptions.length === 0 ? (
	                        <div className="flex h-full min-h-[220px] items-center justify-center rounded-[24px] border border-dashed border-black/10 bg-black/[0.02] px-6 text-center">
                          <div>
                            <p className="font-heading text-2xl text-black">No beers found</p>
                            <p className="mt-3 text-sm leading-6 text-black/60">
                              No beers are available to filter right now.
                            </p>
                          </div>
                        </div>
	                      ) : searchableBeerFilterOptions.length === 0 ? (
	                        <div className="flex h-full min-h-[220px] items-center justify-center rounded-[24px] border border-dashed border-black/10 bg-black/[0.02] px-6 text-center">
	                          <div>
	                            <p className="font-heading text-2xl text-black">No beers found</p>
	                            <p className="mt-3 text-sm leading-6 text-black/60">
	                              Try a different beer name or clear the search field.
	                            </p>
	                          </div>
	                        </div>
	                      ) : (
	                        <div className="-mx-4 -my-4 overflow-hidden border border-black/10 bg-white/60 sm:-mx-5">
	                          <div className="grid grid-cols-3 gap-0 sm:grid-cols-4">
	                            {searchableBeerFilterOptions.map((beerOption) => {
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
		                                      sizes="(max-width: 640px) 33vw, 25vw"
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
              ) : null}

              <div className="max-h-[500px] overflow-y-auto overscroll-contain px-4 pt-2 pb-4 sm:max-h-[550px] sm:px-5 sm:pt-3 lg:min-h-0 lg:flex-1 lg:max-h-none">
                {displayedLocations.length === 0 ? (
                  <div className="flex h-full min-h-[220px] items-center justify-center rounded-[24px] border border-dashed border-black/12 bg-black/[0.02] px-6 text-center">
                    <div>
	                      <p className="font-heading text-2xl text-black">
	                        {isSearchLookupPending
	                          ? "Searching nearby locations"
	                          : hasActiveFilters
	                            ? "No matches yet"
	                            : "No matching locations"}
	                      </p>
	                      <p className="mt-3 text-sm leading-6 text-black/62">
	                        {isSearchLookupPending
	                          ? "Checking the map for nearby spots now."
	                          : hasActiveFilters
	                            ? "Try another beer, toggle grab and go or stay and enjoy, or clear the current selection."
	                            : "Try a different ZIP code."}
	                      </p>
	                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
	                    {displayedLocations.map((location) => {
	                      const isSelected = location.customerId === selectedLocation?.customerId
	                      const isMapped = hasCoordinates(location)
	                      const matchingBeers = location.beers.filter(doesLocationBeerMatchSelectedFilters)
	                      const beerCountLabel = hasBeerFilters
	                        ? formatBeerMatchLabel(matchingBeers.length)
                        : formatBeerCountLabel(location.beers.length)
                      const distanceLabel =
                        isMapped && locationDistances ? formatDistance(locationDistances.get(location.customerId) ?? 0) : null
                      const distanceDisplay = distanceLabel ?? "Search for Distance"

                      return (
                        <div
                          key={location.customerId}
                          id={`beer-finder-location-card-${location.customerId}`}
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            setSelectedLocationId(isSelected ? null : location.customerId)
                            if (!isSelected && isMapped) {
                              focusMapAroundLocation({
                                latitude: location.latitude,
                                longitude: location.longitude,
                              })
                            }
                          }}
                          onKeyDown={(event) => {
                            if (event.target !== event.currentTarget) {
                              return
                            }

                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault()
                              setSelectedLocationId(isSelected ? null : location.customerId)
                              if (!isSelected && isMapped) {
                                focusMapAroundLocation({
                                  latitude: location.latitude,
                                  longitude: location.longitude,
                                })
                              }
                            }
                          }}
                          aria-expanded={isSelected}
                          aria-controls={`beer-finder-location-${location.customerId}`}
                          className={`w-full cursor-pointer rounded-[24px] border px-5 py-5 text-left transition ${
                            isSelected
                              ? "border-black bg-[#0f172a] text-white shadow-[0_18px_36px_rgba(15,23,42,0.2)]"
                              : "border-black/10 bg-white/75 text-black hover:border-black/20 hover:bg-white"
                          }`}
                        >
	                          <div className="flex w-full items-center justify-between gap-4 text-left">
	                            <div className="min-w-0 flex-1">
	                              <h2 className="font-heading text-2xl leading-tight">{location.name}</h2>
	                              {hasBeerFilters ? (
	                                <p
	                                  className={`mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] ${
	                                    isSelected ? "text-white/68" : "text-black/46"
	                                  }`}
	                                >
	                                  Matching beers: {matchingBeers.join(", ")}
	                                </p>
	                              ) : null}
	                              <div className="mt-3">
	                                <a
                                  href={buildDirectionsUrl(location)}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(event) => event.stopPropagation()}
                                  className={`inline-flex items-center justify-center rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                                    isSelected
                                      ? "border border-white/10 bg-white text-black hover:opacity-90"
                                      : "bg-[#0f172a] text-white hover:opacity-90"
                                  }`}
                                >
                                  Directions
                                </a>
                              </div>
                            </div>
                            <div className="shrink-0 self-center text-right flex flex-col items-end">
                              <div
                                className={`whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] ${
                                  isSelected ? "text-white/78" : "text-black/45"
                                }`}
                              >
                                {beerCountLabel}
                              </div>
                              <p
                                className={`mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                                  isSelected ? "text-white/62" : "text-black/48"
                                }`}
                              >
                                {distanceDisplay}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex justify-center">
                            <p
                              className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
                                isSelected ? "text-white/62" : "text-black/42"
                              }`}
                            >
                              {isSelected ? "Click to collapse" : "Click for more info"}
                            </p>
                          </div>

                          {isSelected ? (
                            <div
                              id={`beer-finder-location-${location.customerId}`}
                              className="mt-5 border-t border-white/12 pt-5"
                            >
                              <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                                    Address
                                  </p>
                                  <p className="mt-2 text-sm leading-6 text-white/86">
                                    {location.address ?? "Address unavailable"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                                    Phone
                                  </p>
                                  <p className="mt-2 text-sm leading-6 text-white/86">Unavailable in current data</p>
                                </div>
                              </div>

                              <div className="mt-4">
                                <div className="flex flex-wrap items-baseline justify-between gap-3">
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                                    CURRENT BEERS
                                  </p>
                                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                                    LAST SEEN {formatDate(location.lastSeenDate)}
                                  </p>
                                </div>
                                <div className="mt-3 max-h-[84px] overflow-y-auto pr-1">
                                  <p className="text-xs font-semibold uppercase tracking-[0.14em] leading-6 text-white/86">
                                    {location.beers.join(", ") || "Recent beer list unavailable"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}

export default function BeerFinderExplorer(props: BeerFinderExplorerProps) {
  const [isDesktopViewport, setIsDesktopViewport] = useState(false)
  const searchParams = useSearchParams()
  const deepLinkedBeerParams = searchParams.getAll("beer").map((value) => value.trim()).filter(Boolean)
  const deepLinkedZipParam = searchParams.get("zip")

  const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

  useIsomorphicLayoutEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)")

    const updateViewportMatch = () => {
      setIsDesktopViewport(mediaQuery.matches)
    }

    updateViewportMatch()
    mediaQuery.addEventListener("change", updateViewportMatch)

    return () => {
      mediaQuery.removeEventListener("change", updateViewportMatch)
    }
  }, [])

  const deepLinkedBeerNames = useMemo(() => {
    if (deepLinkedBeerParams.length === 0) {
      return null
    }

    const resolved: string[] = []
    const seen = new Set<string>()

    for (const rawBeer of deepLinkedBeerParams) {
      const fromId = mockBeers.find((beer) => beer.id === rawBeer)
      const name = fromId?.name ?? resolveBeerCatalogMatch(rawBeer)?.name ?? rawBeer

      if (!name || seen.has(name)) {
        continue
      }

      resolved.push(name)
      seen.add(name)
    }

    return resolved
  }, [deepLinkedBeerParams])

  const deepLinkedZip = useMemo(() => {
    if (!deepLinkedZipParam) {
      return null
    }

    const trimmedZip = deepLinkedZipParam.trim()
    return isCompleteZipCode(trimmedZip) ? trimmedZip : null
  }, [deepLinkedZipParam])

  const effectiveInitialSelectedBeers = deepLinkedBeerNames ?? props.initialSelectedBeers
  const effectiveInitialZip = deepLinkedZip ?? props.initialZip
  const remountKey = `${effectiveInitialZip ?? "nozip"}|${effectiveInitialSelectedBeers.join("\u0000") || "all"}`

  if (!isDesktopViewport) {
    return null
  }

  return (
    <BeerFinderExplorerInner
      key={remountKey}
      {...props}
      initialSelectedBeers={effectiveInitialSelectedBeers}
      initialZip={effectiveInitialZip}
    />
  )
}
