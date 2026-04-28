import { hydrateBeerFinderLocations } from "./beerFinderCoordinates.ts"

type BrewwPaginatedResponse<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

type BrewwCustomerType = {
  id: number
  type_name: string
}

type BrewwDrink = {
  id: number
  name: string
  obsolete: boolean
  style: string | null
  alcohol_percentage: number | null
}

type BrewwOrderLine = {
  product_name: string
  quantity_dispatched: number
  quantity: number
}

type BrewwAddress = {
  first_line: string | null
  second_line: string | null
  city: string | null
  region: string | null
  postal_code: string | null
  country: string | null
}

type BrewwOrder = {
  id: number
  issue_date: string
  customer: {
    id: number
    name: string
    type: number | null
  }
  delivery_address: BrewwAddress
  billing_address: BrewwAddress
  fulfillment: {
    date_scheduled: string | null
    type: string | null
    completed: boolean
    dispatched: boolean
  } | null
  order_lines: BrewwOrderLine[]
}

export type BeerFinderLocation = {
  customerId: number
  name: string
  customerType: string | null
  address: string | null
  lastSeenDate: string
  beers: string[]
  totalUnits: number
  latitude: number | null
  longitude: number | null
}

export type BeerFinderData =
  | {
      status: "missing-config"
    }
  | {
      status: "ready"
      locations: BeerFinderLocation[]
      beerNames: string[]
      generatedAt: string
      lookbackDays: number
    }

const BREWW_API_BASE_URL = "https://breww.com/api"
const BREWW_REVALIDATE_SECONDS = 60 * 60
const DEFAULT_LOOKBACK_DAYS = 30
const DEFAULT_PAGE_SIZE = 100
const MAX_ORDER_PAGES = 8

const EXCLUDED_CUSTOMER_TYPES = new Set(["Employee", "Individual", "Integration", "Internal Transfer"])
const EXCLUDED_CUSTOMER_NAME_PATTERNS = [/^internal\b/i, /^square\b/i]

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "")
}

function normalizeProductBaseName(productName: string) {
  return productName.split(" - ")[0]?.trim() ?? productName.trim()
}

function formatAddress(address: BrewwAddress) {
  const parts = [
    address.first_line,
    address.second_line,
    address.city,
    address.region,
    address.postal_code,
    !address.region ? address.country : null,
  ].filter(Boolean)

  return parts.length > 0 ? parts.join(", ") : null
}

function mergeAddress(primary: BrewwAddress, fallback: BrewwAddress): BrewwAddress {
  return {
    first_line: primary.first_line ?? fallback.first_line,
    second_line: primary.second_line ?? fallback.second_line,
    city: primary.city ?? fallback.city,
    region: primary.region ?? fallback.region,
    postal_code: primary.postal_code ?? fallback.postal_code,
    country: primary.country ?? fallback.country,
  }
}

function resolveBestAddress(deliveryAddress: BrewwAddress, billingAddress: BrewwAddress) {
  return formatAddress(mergeAddress(deliveryAddress, billingAddress)) ?? formatAddress(mergeAddress(billingAddress, deliveryAddress))
}

function getOrderDate(order: BrewwOrder) {
  return order.fulfillment?.date_scheduled ?? order.issue_date
}

function isExternalCustomer(customerName: string, customerType: string | null) {
  if (customerType && EXCLUDED_CUSTOMER_TYPES.has(customerType)) {
    return false
  }

  return !EXCLUDED_CUSTOMER_NAME_PATTERNS.some((pattern) => pattern.test(customerName))
}

function resolveDrinkName(productName: string, drinks: BrewwDrink[]) {
  const normalizedProduct = normalizeText(normalizeProductBaseName(productName))

  if (!normalizedProduct) {
    return null
  }

  for (const drink of drinks) {
    const normalizedDrink = normalizeText(drink.name)

    if (!normalizedDrink) {
      continue
    }

    if (normalizedProduct.includes(normalizedDrink) || normalizedDrink.includes(normalizedProduct)) {
      return drink.name
    }
  }

  return null
}

async function fetchBreww<T>(path: string) {
  const apiKey = process.env.BREWW_API_KEY

  if (!apiKey) {
    return null
  }

  const response = await fetch(`${BREWW_API_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    next: {
      revalidate: BREWW_REVALIDATE_SECONDS,
    },
  })

  if (!response.ok) {
    throw new Error(`Breww request failed for ${path}: ${response.status}`)
  }

  return (await response.json()) as T
}

async function fetchDrinks() {
  const response = await fetchBreww<BrewwPaginatedResponse<BrewwDrink>>(`/drinks/?page_size=${DEFAULT_PAGE_SIZE}`)
  return response?.results ?? []
}

async function fetchCustomerTypes() {
  const response = await fetchBreww<BrewwPaginatedResponse<BrewwCustomerType>>(
    `/customer-types/?page_size=${DEFAULT_PAGE_SIZE}`
  )
  return response?.results ?? []
}

async function fetchRecentOrders(lookbackDays: number) {
  const cutoffDate = new Date()
  cutoffDate.setUTCDate(cutoffDate.getUTCDate() - lookbackDays)

  const orders: BrewwOrder[] = []

  for (let page = 1; page <= MAX_ORDER_PAGES; page += 1) {
    const response = await fetchBreww<BrewwPaginatedResponse<BrewwOrder>>(
      `/orders/?page=${page}&page_size=${DEFAULT_PAGE_SIZE}`
    )

    if (!response) {
      return []
    }

    orders.push(...response.results)

    const oldestOrderOnPage = response.results.at(-1)

    if (!oldestOrderOnPage || new Date(getOrderDate(oldestOrderOnPage)) < cutoffDate || !response.next) {
      break
    }
  }

  return orders.filter((order) => new Date(getOrderDate(order)) >= cutoffDate)
}

export async function getBeerFinderData(options: { maxCoordinateLookups?: number } = {}): Promise<BeerFinderData> {
  if (!process.env.BREWW_API_KEY) {
    return {
      status: "missing-config",
    }
  }

  try {
    const [drinks, customerTypes, orders] = await Promise.all([
      fetchDrinks(),
      fetchCustomerTypes(),
      fetchRecentOrders(DEFAULT_LOOKBACK_DAYS),
    ])

    const activeDrinks = drinks
      .filter((drink) => !drink.obsolete)
      .sort((left, right) => normalizeText(right.name).length - normalizeText(left.name).length)

    const customerTypeNames = new Map(customerTypes.map((customerType) => [customerType.id, customerType.type_name]))
    const venueMap = new Map<number, BeerFinderLocation>()

    for (const order of orders) {
      const customerType = order.customer.type ? customerTypeNames.get(order.customer.type) ?? null : null

      if (!isExternalCustomer(order.customer.name, customerType)) {
        continue
      }

      const beerCounts = new Map<string, number>()

      for (const line of order.order_lines) {
        const drinkName = resolveDrinkName(line.product_name, activeDrinks)

        if (!drinkName) {
          continue
        }

        const quantity = line.quantity_dispatched || line.quantity || 0
        beerCounts.set(drinkName, (beerCounts.get(drinkName) ?? 0) + quantity)
      }

      if (beerCounts.size === 0) {
        continue
      }

      const orderDate = getOrderDate(order)
      const venue = venueMap.get(order.customer.id)
      const address = resolveBestAddress(order.delivery_address, order.billing_address)

      if (!venue) {
        venueMap.set(order.customer.id, {
          customerId: order.customer.id,
          name: order.customer.name,
          customerType,
          address,
          lastSeenDate: orderDate,
          beers: Array.from(beerCounts.keys()).sort(),
          totalUnits: Array.from(beerCounts.values()).reduce((sum, count) => sum + count, 0),
          latitude: null,
          longitude: null,
        })
        continue
      }

      if (new Date(orderDate) > new Date(venue.lastSeenDate)) {
        venue.lastSeenDate = orderDate
        venue.address = address ?? venue.address
      }

      venue.totalUnits += Array.from(beerCounts.values()).reduce((sum, count) => sum + count, 0)
      venue.beers = Array.from(new Set([...venue.beers, ...beerCounts.keys()])).sort()
    }

    const sortedLocations = Array.from(venueMap.values()).sort((left, right) => {
      const dateComparison = new Date(right.lastSeenDate).getTime() - new Date(left.lastSeenDate).getTime()

      if (dateComparison !== 0) {
        return dateComparison
      }

      return left.name.localeCompare(right.name)
    })

    const locations = await hydrateBeerFinderLocations(sortedLocations, {
      maxNewLookups: options.maxCoordinateLookups,
    })

    return {
      status: "ready",
      locations,
      beerNames: Array.from(new Set(locations.flatMap((location) => location.beers))).sort(),
      generatedAt: new Date().toISOString(),
      lookbackDays: DEFAULT_LOOKBACK_DAYS,
    }
  } catch {
    return {
      status: "ready",
      locations: [],
      beerNames: [],
      generatedAt: new Date().toISOString(),
      lookbackDays: DEFAULT_LOOKBACK_DAYS,
    }
  }
}
