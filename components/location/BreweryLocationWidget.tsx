const BREWERY = {
  name: "ABCo",
  addressLine1: "15 Ryder St",
  addressLine2: "Arlington, MA 02476",
  latitude: 42.4154,
  longitude: -71.1526,
}

const EMBED_QUERY = encodeURIComponent(`${BREWERY.latitude},${BREWERY.longitude} (${BREWERY.name})`)
const GOOGLE_EMBED_URL = `https://maps.google.com/maps?q=${EMBED_QUERY}&z=15&output=embed`

type BreweryLocationWidgetProps = {
  compact?: boolean
}

export default function BreweryLocationWidget({ compact = false }: BreweryLocationWidgetProps) {
  const shellClassName = compact
    ? "rounded-[2rem] border border-black/10 bg-white shadow-sm"
    : "rounded-[2.25rem] border border-black/10 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.12)]"
  const mapHeightClassName = compact ? "h-[320px] sm:h-[360px]" : "h-[clamp(460px,72vh,880px)]"
  const sectionClassName = compact ? "w-full" : "px-6 py-10 md:py-14"

  return (
    <section className={sectionClassName}>
      <div className={compact ? "w-full" : "mx-auto w-full max-w-[1600px]"}>
        <div className={`${shellClassName} overflow-hidden`}>
          <div className={`relative w-full overflow-hidden bg-[#dfe6ee] ${mapHeightClassName}`}>
            <iframe
              title={`Map showing ${BREWERY.name}`}
              src={GOOGLE_EMBED_URL}
              className="absolute inset-0 h-full w-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
