import { beerCardColors } from "@/lib/beerPalette"

function hexToRgb(hex: string) {
  const normalized = hex.trim().replace("#", "")

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return null
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

function mixHex(baseHex: string, targetHex: string, weight: number) {
  const base = hexToRgb(baseHex)
  const target = hexToRgb(targetHex)

  if (!base || !target) {
    return baseHex
  }

  const mixChannel = (baseChannel: number, targetChannel: number) =>
    Math.round(baseChannel + (targetChannel - baseChannel) * weight)

  return `#${[mixChannel(base.r, target.r), mixChannel(base.g, target.g), mixChannel(base.b, target.b)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`
}

function getRelativeLuminance(hex: string) {
  const rgb = hexToRgb(hex)

  if (!rgb) {
    return 1
  }

  const toLinear = (channel: number) => {
    const normalized = channel / 255
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
  }

  return 0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b)
}

function getReadableTextColor(backgroundHex: string) {
  return getRelativeLuminance(backgroundHex) < 0.36 ? "#FFFFFF" : "#161616"
}

function getAccentTextColor(accentColor: string) {
  if (accentColor.toUpperCase() === beerCardColors["trafford-ale"]?.toUpperCase()) {
    return "#161616"
  }

  return getReadableTextColor(accentColor)
}

export const eventAccentSequence = [
  beerCardColors["spy-p-a"],
  beerCardColors["trafford-ale"],
  beerCardColors.jedermann,
  beerCardColors["my-juicy-gf"],
  beerCardColors["money-comes-and-goes"],
  beerCardColors.presita,
  beerCardColors["time-only-goes"],
  beerCardColors.menotomator,
].filter((color): color is string => Boolean(color))

export type EventCardTheme = {
  accentColor: string
  accentTextColor: string
  accentMutedTextColor: string
  railBorderColor: string
}

export function getEventCardTheme(accentIndex = 0): EventCardTheme {
  const accentColor =
    eventAccentSequence[((accentIndex % eventAccentSequence.length) + eventAccentSequence.length) % eventAccentSequence.length] ??
    "#B2D6D2"
  const accentTextColor = getAccentTextColor(accentColor)

  return {
    accentColor,
    accentTextColor,
    accentMutedTextColor: mixHex(
      accentTextColor,
      accentColor,
      accentTextColor === "#FFFFFF" ? 0.32 : 0.42
    ),
    railBorderColor: mixHex(accentColor, accentTextColor, accentTextColor === "#FFFFFF" ? 0.18 : 0.12),
  }
}
