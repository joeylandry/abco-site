import Link from "next/link"
import { mockBeers } from "@/app/beer/mockBeers"
import MobileBeerCard from "@/components/beer/MobileBeerCard"

const teaserBeers = mockBeers.slice(0, 6)

type HomeMobileBeerTeaserProps = {
  variant?: "home" | "related"
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current stroke-[1.8]"
    >
      <path d="M5 12h13" />
      <path d="M13 6l5 6-5 6" />
    </svg>
  )
}

export default function HomeMobileBeerTeaser({ variant = "home" }: HomeMobileBeerTeaserProps) {
  if (teaserBeers.length === 0) {
    return null
  }

  return (
    <section className="bg-background py-6 md:hidden">
      <div className="w-full">
        <div className="mb-4 px-3">
          {variant === "home" ? (
            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-[clamp(4.2rem,22vw,6.75rem)] uppercase leading-[0.8] tracking-[-0.1em] text-black">
                OUR
              </h2>
              <h2 className="font-heading text-[clamp(4.2rem,22vw,6.75rem)] uppercase leading-[0.8] tracking-[-0.1em] text-black">
                BEERS
              </h2>
            </div>
          ) : (
            <h2 className="max-w-[72%] font-heading text-[clamp(4.2rem,22vw,6.75rem)] uppercase leading-[0.8] tracking-[-0.1em] text-black">
              <span className="flex flex-col gap-5">
                <span className="block whitespace-nowrap">YOU MAY</span>
                <span className="block">ALSO</span>
                <span className="block">LIKE...</span>
              </span>
            </h2>
          )}
        </div>

        <div className="grid grid-cols-2 gap-0">
          {teaserBeers.map((beer) => (
            <MobileBeerCard key={beer.id} beer={beer} interactive />
          ))}
        </div>

        <div className="mt-5 flex justify-center px-3">
          <Link
            href="/beer"
            className="inline-flex items-center gap-2 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-foreground/80 transition hover:text-foreground"
          >
            <span>View All Beers</span>
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  )
}
