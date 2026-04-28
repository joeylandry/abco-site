import Image from "next/image"

type SectionHeaderProps = {
  title: string
  mobileTitle?: string
  eyebrow?: string
  showBottomBorder?: boolean
  titleClassName?: string
  variant:
    | "beer"
    | "visit"
    | "events"
    | "shop"
    | "about"
    | "contact"
    | "jobs"
}

const variantStyles = {
  beer: "bg-black/10 text-black",
  visit: "bg-black/10 text-black",
  events: "bg-black/10 text-black",
  shop: "bg-black/10 text-black",
  about: "bg-black/10 text-black",
  contact: "bg-black/10 text-black",
  jobs: "bg-black/10 text-black",
}

const variantImages = {
  beer: "/headers/juicy_gf.png",
  visit: "/headers/herring_run.png",
  events: "/headers/marleys_ghost.png",
  shop: "/headers/trafford_ale.png",
  about: "/headers/menotomator.png",
  contact: "/headers/oval_frame.png",
  jobs: "/headers/herring_run.png",
}

const variantImagePosition = {
  beer: "center center",
  visit: "center center",
  events: "center center",
  shop: "center center",
  about: "center 100%",
  contact: "center center",
  jobs: "center center",
} satisfies Record<SectionHeaderProps["variant"], string>

export default function SectionHeader({
  title,
  mobileTitle,
  eyebrow,
  showBottomBorder = true,
  titleClassName,
  variant,
}: SectionHeaderProps) {
  return (
    <section
      className={`${variantStyles[variant]} relative w-full overflow-hidden px-6 py-4 md:py-5 ${
        showBottomBorder ? "border-b border-black/10" : ""
      }`}
    >
      <Image
        src={variantImages[variant]}
        alt=""
        fill
        sizes="100vw"
        className="pointer-events-none absolute inset-0 object-cover opacity-88"
        style={{ objectPosition: variantImagePosition[variant] }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/18 via-white/8 to-black/12" />
      <div className="pointer-events-none absolute inset-0 bg-black/8" />

      <div className="pointer-events-none absolute top-0 left-0 h-1 w-full bg-black/10" />

      <div className="relative max-w-6xl mx-auto">
        {eyebrow && (
          <p className="uppercase tracking-[0.25em] text-xs md:text-sm font-sans font-semibold opacity-80">
            {eyebrow}
          </p>
        )}

        <h1
          className={`mt-1 font-heading text-[clamp(4.2rem,22vw,6.75rem)] leading-[0.8] tracking-[-0.1em] text-black ${
            titleClassName ?? ""
          }`}
        >
          {mobileTitle ? (
            <>
              <span className="md:hidden">{mobileTitle}</span>
              <span className="hidden md:inline">{title}</span>
            </>
          ) : (
            title
          )}
        </h1>
      </div>
    </section>
  )
}
