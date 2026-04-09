import { NextResponse } from "next/server"
import { geocodeSearchQuery } from "@/lib/beerFinderCoordinates"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")?.trim() ?? ""

  if (query.length < 3) {
    return NextResponse.json({ coordinates: null }, { headers: { "Cache-Control": "no-store" } })
  }

  try {
    const result = await geocodeSearchQuery(query)

    return NextResponse.json(
      {
        coordinates: result
          ? {
              latitude: result.latitude,
              longitude: result.longitude,
            }
          : null,
      },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch {
    return NextResponse.json({ coordinates: null }, { headers: { "Cache-Control": "no-store" } })
  }
}
