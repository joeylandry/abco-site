import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

type CoordinateLocation = {
  customerId: number
  name: string
  address: string | null
}

type CoordinateProvider = "override" | "census" | "nominatim"

type CoordinateEntry = {
  customerId: number
  name: string
  address: string | null
  latitude: number
  longitude: number
  matchedAddress: string | null
  provider: CoordinateProvider
  query: string | null
  updatedAt: string
}

type CoordinateCacheFile = {
  version: 1
  updatedAt: string | null
  entries: Record<string, CoordinateEntry>
}

type CoordinateOverride = {
  latitude: number
  longitude: number
  note?: string
}

type CoordinateOverrideFile = {
  customers: Record<string, CoordinateOverride>
  addresses: Record<string, CoordinateOverride>
}

type HydrateOptions = {
  maxNewLookups?: number
}

type ResolvedCoordinates = {
  latitude: number
  longitude: number
  matchedAddress: string | null
  provider: Exclude<CoordinateProvider, "override">
  query: string
}

const DATA_DIRECTORY = path.join(process.cwd(), "data")
const CACHE_FILE_PATH = path.join(DATA_DIRECTORY, "beer-finder-geocode-cache.json")
const OVERRIDES_FILE_PATH = path.join(DATA_DIRECTORY, "beer-finder-geocode-overrides.json")
const DEFAULT_MAX_NEW_LOOKUPS = 12

const EMPTY_CACHE_FILE: CoordinateCacheFile = {
  version: 1,
  updatedAt: null,
  entries: {},
}

const EMPTY_OVERRIDE_FILE: CoordinateOverrideFile = {
  customers: {},
  addresses: {},
}

let runtimeEntries: Record<string, CoordinateEntry> = {}

function normalizeLookupValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function buildCacheKey(location: CoordinateLocation) {
  return `${location.customerId}:${normalizeLookupValue(location.address ?? location.name)}`
}

function buildAddressKey(address: string | null) {
  return address ? normalizeLookupValue(address) : null
}

function stripUnitDetails(address: string) {
  return address
    .replace(/\b(?:unit|suite|ste|apt|apartment|floor|fl)\s+[\w-]+\b/gi, "")
    .replace(/\s+#\s*[\w-]+\b/gi, "")
    .replace(/\s+,/g, ",")
    .replace(/,\s*,+/g, ",")
    .replace(/\s{2,}/g, " ")
    .replace(/,\s*$/g, "")
    .trim()
}

function buildQueryCandidates(location: CoordinateLocation) {
  const candidates = new Set<string>()

  const push = (value: string | null | undefined) => {
    if (!value) {
      return
    }

    const trimmed = value.trim()

    if (trimmed) {
      candidates.add(trimmed)
    }
  }

  push(location.address)

  if (location.address) {
    const strippedAddress = stripUnitDetails(location.address)

    push(strippedAddress)
    push(`${location.address}, United States`)
    push(`${strippedAddress}, United States`)
    push(`${location.address}, Massachusetts, United States`)
    push(`${strippedAddress}, Massachusetts, United States`)
    push(`${location.name}, ${location.address}`)
    push(`${location.name}, ${strippedAddress}`)
  }

  push(`${location.name}, Massachusetts`)

  return Array.from(candidates)
}

async function readJsonFile<T>(filePath: string, fallback: T) {
  try {
    const raw = await readFile(filePath, "utf8")
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

async function readCoordinateCache() {
  const fileCache = await readJsonFile(CACHE_FILE_PATH, EMPTY_CACHE_FILE)

  return {
    ...fileCache,
    entries: {
      ...fileCache.entries,
      ...runtimeEntries,
    },
  }
}

async function readCoordinateOverrides() {
  return readJsonFile(OVERRIDES_FILE_PATH, EMPTY_OVERRIDE_FILE)
}

async function persistCoordinateCache(entries: Record<string, CoordinateEntry>) {
  runtimeEntries = entries

  const nextCacheFile: CoordinateCacheFile = {
    version: 1,
    updatedAt: new Date().toISOString(),
    entries,
  }

  try {
    await mkdir(DATA_DIRECTORY, { recursive: true })
    await writeFile(CACHE_FILE_PATH, `${JSON.stringify(nextCacheFile, null, 2)}\n`, "utf8")
  } catch {
    // Keep runtime cache warm even if the host filesystem is read-only.
  }
}

function resolveOverride(location: CoordinateLocation, overrides: CoordinateOverrideFile) {
  const customerOverride = overrides.customers[String(location.customerId)]

  if (customerOverride) {
    return customerOverride
  }

  const addressKey = buildAddressKey(location.address)

  return addressKey ? overrides.addresses[addressKey] ?? null : null
}

async function geocodeWithCensus(query: string): Promise<ResolvedCoordinates | null> {
  const url = new URL("https://geocoding.geo.census.gov/geocoder/locations/onelineaddress")
  url.searchParams.set("address", query)
  url.searchParams.set("benchmark", "Public_AR_Current")
  url.searchParams.set("format", "json")

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "ArlingtonBeerCoSite/1.0",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    return null
  }

  const payload = (await response.json()) as {
    result?: {
      addressMatches?: Array<{
        matchedAddress?: string
        coordinates?: {
          x?: number
          y?: number
        }
      }>
    }
  }

  const match = payload.result?.addressMatches?.[0]
  const longitude = match?.coordinates?.x
  const latitude = match?.coordinates?.y

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return null
  }

  return {
    latitude,
    longitude,
    matchedAddress: match?.matchedAddress ?? null,
    provider: "census",
    query,
  }
}

async function geocodeWithNominatim(query: string): Promise<ResolvedCoordinates | null> {
  const url = new URL("https://nominatim.openstreetmap.org/search")
  url.searchParams.set("format", "jsonv2")
  url.searchParams.set("limit", "1")
  url.searchParams.set("countrycodes", "us")
  url.searchParams.set("q", query)

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "ArlingtonBeerCoSite/1.0",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    return null
  }

  const payload = (await response.json()) as Array<{
    lat?: string
    lon?: string
    display_name?: string
  }>

  const match = payload[0]
  const latitude = match?.lat ? Number(match.lat) : Number.NaN
  const longitude = match?.lon ? Number(match.lon) : Number.NaN

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  return {
    latitude,
    longitude,
    matchedAddress: match?.display_name ?? null,
    provider: "nominatim",
    query,
  }
}

async function geocodeLocation(location: CoordinateLocation) {
  const queries = buildQueryCandidates(location)

  for (const query of queries) {
    const censusResult = await geocodeWithCensus(query)

    if (censusResult) {
      return censusResult
    }
  }

  for (const query of queries) {
    const nominatimResult = await geocodeWithNominatim(query)

    if (nominatimResult) {
      return nominatimResult
    }
  }

  return null
}

export async function geocodeSearchQuery(query: string): Promise<ResolvedCoordinates | null> {
  const trimmedQuery = query.trim()

  if (!trimmedQuery) {
    return null
  }

  const censusResult = await geocodeWithCensus(trimmedQuery)

  if (censusResult) {
    return censusResult
  }

  return geocodeWithNominatim(trimmedQuery)
}

export async function hydrateBeerFinderLocations<T extends CoordinateLocation>(
  locations: T[],
  options: HydrateOptions = {}
): Promise<Array<T & { latitude: number | null; longitude: number | null }>> {
  const maxNewLookups = options.maxNewLookups ?? DEFAULT_MAX_NEW_LOOKUPS
  const [cacheFile, overrides] = await Promise.all([readCoordinateCache(), readCoordinateOverrides()])
  const nextEntries = { ...cacheFile.entries }
  const hydratedLocations: Array<T & { latitude: number | null; longitude: number | null }> = []
  let lookupsRemaining = maxNewLookups
  let cacheChanged = false

  for (const location of locations) {
    const override = resolveOverride(location, overrides)

    if (override) {
      hydratedLocations.push({
        ...location,
        latitude: override.latitude,
        longitude: override.longitude,
      })
      continue
    }

    const cacheKey = buildCacheKey(location)
    const cachedEntry = nextEntries[cacheKey]

    if (cachedEntry) {
      hydratedLocations.push({
        ...location,
        latitude: cachedEntry.latitude,
        longitude: cachedEntry.longitude,
      })
      continue
    }

    if (!location.address || lookupsRemaining <= 0) {
      hydratedLocations.push({
        ...location,
        latitude: null,
        longitude: null,
      })
      continue
    }

    const geocodedCoordinates = await geocodeLocation(location)

    if (!geocodedCoordinates) {
      hydratedLocations.push({
        ...location,
        latitude: null,
        longitude: null,
      })
      continue
    }

    nextEntries[cacheKey] = {
      customerId: location.customerId,
      name: location.name,
      address: location.address,
      latitude: geocodedCoordinates.latitude,
      longitude: geocodedCoordinates.longitude,
      matchedAddress: geocodedCoordinates.matchedAddress,
      provider: geocodedCoordinates.provider,
      query: geocodedCoordinates.query,
      updatedAt: new Date().toISOString(),
    }

    hydratedLocations.push({
      ...location,
      latitude: geocodedCoordinates.latitude,
      longitude: geocodedCoordinates.longitude,
    })

    cacheChanged = true
    lookupsRemaining -= 1
  }

  if (cacheChanged) {
    await persistCoordinateCache(nextEntries)
  }

  return hydratedLocations
}
