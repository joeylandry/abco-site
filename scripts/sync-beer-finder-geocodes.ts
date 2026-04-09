import { existsSync, readFileSync } from "node:fs"
import path from "node:path"

import { getBeerFinderData } from "../lib/breww.ts"

function loadEnvFile(fileName: string) {
  const filePath = path.join(process.cwd(), fileName)

  if (!existsSync(filePath)) {
    return
  }

  const fileContents = readFileSync(filePath, "utf8")

  for (const rawLine of fileContents.split(/\r?\n/)) {
    const line = rawLine.trim()

    if (!line || line.startsWith("#")) {
      continue
    }

    const separatorIndex = line.indexOf("=")

    if (separatorIndex === -1) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    let value = line.slice(separatorIndex + 1).trim()

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnvFile(".env.local")
loadEnvFile(".env")

const data = await getBeerFinderData({
  maxCoordinateLookups: Number.POSITIVE_INFINITY,
})

if (data.status !== "ready") {
  console.error("Breww data is unavailable. Check BREWW_API_KEY before syncing map coordinates.")
  process.exit(1)
}

const mappedLocations = data.locations.filter((location) => location.latitude !== null && location.longitude !== null)
const unmappedLocations = data.locations.filter((location) => location.latitude === null || location.longitude === null)

console.log(`Mapped ${mappedLocations.length} of ${data.locations.length} beer finder locations.`)

if (unmappedLocations.length > 0) {
  console.log("\nLocations still missing coordinates:")

  for (const location of unmappedLocations) {
    console.log(`- ${location.name} :: ${location.address ?? "Address unavailable"}`)
  }

  process.exitCode = 1
}
