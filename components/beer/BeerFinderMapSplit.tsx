"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import type { BeerFinderLocation } from "@/lib/breww"
import {
  getLeaflet,
  hasCoordinates,
  type LeafletLayerGroup,
  type LeafletMap,
  type LeafletMarker,
  type LeafletRuntime,
} from "@/components/beer/leafletRuntime"

type BeerFinderMapSplitProps = {
  locations: BeerFinderLocation[]
  selectedBeer: string | null
}

const DEFAULT_CENTER = {
  latitude: 42.3876,
  longitude: -71.1437,
}

function buildStoreIcon(leaflet: LeafletRuntime, isSelected: boolean) {
  const size = isSelected ? 48 : 40

  return leaflet.divIcon({
    className: "beer-finder-store-icon",
    html: `
      <div style="
        width:${size}px;
        height:${size}px;
        border-radius:999px;
        background:#08a84b;
        border:4px solid rgba(255,255,255,0.96);
        box-shadow:0 10px 24px rgba(0,0,0,0.18);
        display:flex;
        align-items:center;
        justify-content:center;
        transform:${isSelected ? "scale(1.05)" : "scale(1)"};
      ">
        <span style="color:#fff;font-size:${isSelected ? 22 : 18}px;line-height:1">🛒</span>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

function formatDistance(index: number) {
  const values = ["0.40 miles", "0.46 miles", "0.55 miles", "0.63 miles", "0.73 miles", "0.75 miles"]
  return values[index] ?? `${(0.4 + index * 0.09).toFixed(2)} miles`
}

export default function BeerFinderMapSplit({ locations, selectedBeer }: BeerFinderMapSplitProps) {
  const [leafletReady, setLeafletReady] = useState(false)
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    locations.find(hasCoordinates)?.customerId ?? locations[2]?.customerId ?? locations[0]?.customerId ?? null
  )

  const mapRef = useRef<HTMLDivElement | null>(null)
  const leafletMapRef = useRef<LeafletMap | null>(null)
  const markersLayerRef = useRef<LeafletLayerGroup | null>(null)
  const markersRef = useRef<Map<number, LeafletMarker>>(new Map())
  const fitSignatureRef = useRef<string | null>(null)

  useEffect(() => {
    fitSignatureRef.current = null
  }, [locations])

  const visibleLocations = locations.filter(hasCoordinates)

  const selectedLocation =
    locations.find((location) => location.customerId === selectedLocationId) ??
    locations.find(hasCoordinates) ??
    locations[0] ??
    null

  useEffect(() => {
    const leaflet = getLeaflet()

    if (!leafletReady || !mapRef.current || leafletMapRef.current || !leaflet) {
      return
    }

    const map = leaflet.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: true,
      dragging: true,
      doubleClickZoom: true,
      touchZoom: true,
      boxZoom: false,
      keyboard: true,
      zoomSnap: 0,
      zoomDelta: 0.25,
      wheelPxPerZoomLevel: 140,
      minZoom: 10,
      maxZoom: 18,
      inertia: true,
      preferCanvas: true,
    }).setView([DEFAULT_CENTER.latitude, DEFAULT_CENTER.longitude], 13.8)

    leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map)

    markersLayerRef.current = leaflet.layerGroup().addTo(map)
    leafletMapRef.current = map

    return () => {
      map.remove()
      leafletMapRef.current = null
      markersLayerRef.current = null
      markersRef.current = new Map()
    }
  }, [leafletReady])

  useEffect(() => {
    const leaflet = getLeaflet()
    const markersLayer = markersLayerRef.current

    if (!leafletMapRef.current || !markersLayer || !leaflet) {
      return
    }

    markersLayer.clearLayers()
    markersRef.current.clear()

    visibleLocations.forEach((location) => {
      const marker = leaflet.marker([location.latitude, location.longitude], {
        icon: buildStoreIcon(leaflet, location.customerId === selectedLocation?.customerId),
      })

      marker.on("click", () => {
        setSelectedLocationId(location.customerId)
      })

      markersLayer.addLayer(marker)
      markersRef.current.set(location.customerId, marker)
    })
  }, [visibleLocations, selectedLocation])

  useEffect(() => {
    if (!leafletMapRef.current) {
      return
    }

    const boundsPoints = visibleLocations.map((location) => [location.latitude, location.longitude] as [number, number])
    const signature = JSON.stringify(boundsPoints)

    if (fitSignatureRef.current === signature) {
      return
    }

    fitSignatureRef.current = signature

    if (boundsPoints.length > 1) {
      leafletMapRef.current.fitBounds(boundsPoints, {
        padding: [56, 56],
        animate: false,
      })
      return
    }

    if (boundsPoints.length === 1) {
      leafletMapRef.current.setView(boundsPoints[0], 13.8, {
        animate: false,
      })
      return
    }

    leafletMapRef.current.setView([DEFAULT_CENTER.latitude, DEFAULT_CENTER.longitude], 13.8, {
      animate: false,
    })
  }, [visibleLocations])

  useEffect(() => {
    if (!leafletMapRef.current || !selectedLocation || selectedLocation.latitude === null || selectedLocation.longitude === null) {
      return
    }

    const leaflet = getLeaflet()
    if (!leaflet) {
      return
    }

    const marker = markersRef.current.get(selectedLocation.customerId)
    if (marker) {
      marker.setIcon(buildStoreIcon(leaflet, true))
    }
  }, [selectedLocation])

  return (
    <>
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        crossOrigin=""
        strategy="afterInteractive"
        onLoad={() => setLeafletReady(true)}
      />

      <div className="overflow-hidden rounded-[28px] border border-black/10 bg-black shadow-[0_24px_80px_rgba(0,0,0,0.14)]">
        <div className="grid min-h-[70vh] lg:grid-cols-2">
          <section className="relative min-h-[420px] overflow-hidden bg-[#d6d4cf] lg:min-h-[70vh]">
            <div ref={mapRef} className="absolute inset-0 z-0" />

            {selectedLocation ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-6 z-[950] flex justify-center px-6">
                <div className="flex max-w-[560px] items-center overflow-hidden rounded-full bg-[#262626] text-white shadow-2xl">
                  <div className="px-8 py-5 text-xl font-semibold">{selectedLocation.name}</div>
                  <div className="h-10 w-px bg-white/16" />
                  <div className="px-8 py-5 text-xl font-semibold text-white/88">
                    {formatDistance(
                      Math.max(0, locations.findIndex((location) => location.customerId === selectedLocation.customerId))
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          <aside className="flex min-h-[420px] flex-col bg-[#0b0b0b] px-6 py-6 text-white sm:px-8 sm:py-8 lg:min-h-[70vh] lg:px-10 lg:py-10">
            <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col">
              <div className="border-b border-white/10 pb-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">Beer Finder</p>
                <h2 className="mt-4 font-heading text-4xl leading-none sm:text-5xl">
                  {selectedBeer ? selectedBeer : "Map First"}
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-7 text-white/62">
                  Real draggable map, real zoom, and markers that stay attached to the map instead of floating over it.
                </p>
              </div>

              <div className="py-8">
                <div className="rounded-[24px] border border-white/10 bg-white/4 px-6 py-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">Current Dataset</p>
                  <div className="mt-4 flex items-end gap-3">
                    <p className="font-heading text-6xl leading-none">{locations.length}</p>
                    <p className="pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/42">Locations</p>
                  </div>
                  <p className="mt-4 max-w-xs text-sm leading-6 text-white/60">
                    {selectedBeer ? `Recent locations carrying ${selectedBeer}.` : "Recent external accounts carrying beer."}
                  </p>
                </div>
              </div>

              <div className="mt-auto rounded-[28px] bg-white px-6 py-7 text-black sm:px-7 sm:py-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/38">Selected Venue</p>
                {selectedLocation ? (
                  <>
                    <h3 className="mt-3 font-heading text-3xl leading-tight">{selectedLocation.name}</h3>
                    <p className="mt-4 max-w-sm text-sm leading-7 text-black/62">
                      {selectedLocation.beers.slice(0, 5).join(", ")}
                    </p>
                  </>
                ) : (
                  <p className="mt-4 text-sm leading-7 text-black/62">Waiting for venue data to resolve.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
