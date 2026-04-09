import type { NextRequest } from "next/server"

const SUBDOMAINS = ["a", "b", "c", "d"] as const

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      z: string
      x: string
      y: string
    }>
  }
) {
  const { z, x, y } = await context.params
  const subdomain = SUBDOMAINS[(Number(x) + Number(y)) % SUBDOMAINS.length] ?? "a"
  const retinaSuffix = request.nextUrl.searchParams.get("r") === "@2x" ? "@2x" : ""
  const tileUrl = `https://${subdomain}.basemaps.cartocdn.com/light_all/${z}/${x}/${y}${retinaSuffix}.png`

  const response = await fetch(tileUrl, {
    headers: {
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "User-Agent": "ArlingtonBeerCoSite/1.0",
    },
    next: {
      revalidate: 60 * 60 * 24,
    },
  })

  if (!response.ok || !response.body) {
    return new Response("Tile unavailable", {
      status: response.status || 502,
    })
  }

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      "Content-Type": response.headers.get("content-type") ?? "image/png",
    },
  })
}
