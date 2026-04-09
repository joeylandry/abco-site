import { readFileSync } from "node:fs"
import path from "node:path"
import { cache } from "react"
import type { CSSProperties } from "react"

type ImageDimensions = {
  width: number
  height: number
}

const SOF_MARKERS = new Set([
  0xc0,
  0xc1,
  0xc2,
  0xc3,
  0xc5,
  0xc6,
  0xc7,
  0xc9,
  0xca,
  0xcb,
  0xcd,
  0xce,
  0xcf,
])

function readPngDimensions(buffer: Buffer): ImageDimensions | null {
  if (buffer.length < 24) {
    return null
  }

  const signature = buffer.subarray(0, 8)
  if (!signature.equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return null
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  }
}

function readJpegDimensions(buffer: Buffer): ImageDimensions | null {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null
  }

  let offset = 2

  while (offset + 1 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1
      continue
    }

    let marker = buffer[offset + 1]
    offset += 2

    while (marker === 0xff && offset < buffer.length) {
      marker = buffer[offset]
      offset += 1
    }

    if (marker === 0xd9 || marker === 0xda) {
      break
    }

    if (offset + 1 >= buffer.length) {
      break
    }

    const segmentLength = buffer.readUInt16BE(offset)
    if (segmentLength < 2) {
      break
    }

    if (SOF_MARKERS.has(marker) && offset + 5 < buffer.length) {
      return {
        height: buffer.readUInt16BE(offset + 3),
        width: buffer.readUInt16BE(offset + 5),
      }
    }

    offset += segmentLength
  }

  return null
}

function readImageDimensions(filePath: string): ImageDimensions | null {
  const buffer = readFileSync(filePath)
  const extension = path.extname(filePath).toLowerCase()

  if (extension === ".png") {
    return readPngDimensions(buffer)
  }

  if (extension === ".jpg" || extension === ".jpeg") {
    return readJpegDimensions(buffer)
  }

  return null
}

export const getPublicImageDimensions = cache((src: string): ImageDimensions | null => {
  const filePath = path.resolve(process.cwd(), "public", src.replace(/^\/+/, ""))

  try {
    return readImageDimensions(filePath)
  } catch {
    return null
  }
})

export function getPublicImageAspectRatioStyle(src: string): CSSProperties | undefined {
  const dimensions = getPublicImageDimensions(src)

  if (!dimensions) {
    return undefined
  }

  return {
    aspectRatio: `${dimensions.width} / ${dimensions.height}`,
  }
}
