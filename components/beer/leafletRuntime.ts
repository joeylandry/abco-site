type LeafletLatLng = [number, number]
type LeafletLatLngObject = {
  lat: number
  lng: number
}
type LeafletLatLngBounds = [[number, number], [number, number]]

type LeafletMapOptions = {
  zoomControl: boolean
  attributionControl: boolean
  scrollWheelZoom?: boolean
  dragging?: boolean
  doubleClickZoom?: boolean | string
  touchZoom?: boolean
  boxZoom?: boolean
  keyboard?: boolean
  zoomSnap?: number
  zoomDelta?: number
  wheelPxPerZoomLevel?: number
  wheelDebounceTime?: number
  minZoom?: number
  maxZoom?: number
  maxBounds?: LeafletLatLngBounds
  maxBoundsViscosity?: number
  inertia?: boolean
  preferCanvas?: boolean
}

export type LeafletMap = {
  on: (eventName: string, handler: () => void) => LeafletMap
  off: (eventName: string, handler: () => void) => LeafletMap
  setView: (latLng: LeafletLatLng, zoom: number, options?: { animate?: boolean }) => LeafletMap
  flyTo: (
    latLng: LeafletLatLng | LeafletLatLngObject,
    zoom: number,
    options?: {
      animate?: boolean
      duration?: number
      easeLinearity?: number
    }
  ) => LeafletMap
  flyToBounds: (
    bounds: LeafletLatLng[],
    options: {
      padding: [number, number]
      maxZoom?: number
      duration?: number
      easeLinearity?: number
    }
  ) => void
  fitBounds: (
    bounds: LeafletLatLng[],
    options: {
      padding: [number, number]
      animate?: boolean
      maxZoom?: number
    }
  ) => void
  getCenter: () => LeafletLatLngObject
  getZoom: () => number
  remove: () => void
  invalidateSize: () => void
}

export type LeafletLayerGroup = {
  addTo: (map: LeafletMap) => LeafletLayerGroup
  clearLayers: () => void
  addLayer: (layer: LeafletMarker) => void
}

export type LeafletMarker = {
  on: (eventName: string, handler: () => void) => void
  bindPopup: (html: string) => void
  bindTooltip: (
    html: string,
    options?: {
      direction?: "top" | "bottom" | "left" | "right" | "center" | "auto"
      offset?: [number, number]
      opacity?: number
      className?: string
      sticky?: boolean
    }
  ) => void
  setIcon: (icon: unknown) => void
  setZIndexOffset: (offset: number) => void
}

export type LeafletRuntime = {
  map: (element: HTMLDivElement, options: LeafletMapOptions) => LeafletMap
  tileLayer: (
    url: string,
    options: {
      maxZoom: number
      detectRetina?: boolean
    }
  ) => {
    addTo: (map: LeafletMap) => void
  }
  layerGroup: () => LeafletLayerGroup
  marker: (
    latLng: LeafletLatLng,
    options: {
      icon: unknown
    }
  ) => LeafletMarker
  divIcon: (options: {
    className: string
    html: string
    iconSize: [number, number]
    iconAnchor: [number, number]
  }) => unknown
}

type NullableCoordinates = {
  latitude: number | null
  longitude: number | null
}

export type WithCoordinates<T extends NullableCoordinates> = T & {
  latitude: number
  longitude: number
}

export function getLeaflet() {
  if (typeof window === "undefined") {
    return null
  }

  return (window as Window & { L?: LeafletRuntime }).L ?? null
}

export function hasCoordinates<T extends NullableCoordinates>(value: T): value is WithCoordinates<T> {
  return (
    value.latitude !== null &&
    value.longitude !== null &&
    Number.isFinite(value.latitude) &&
    Number.isFinite(value.longitude)
  )
}
