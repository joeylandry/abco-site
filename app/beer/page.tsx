import type { Metadata } from "next"
import BeerCatalog from "@/components/beer/BeerCatalog"
import MobileBeerCatalog from "@/components/beer/MobileBeerCatalog"
import BeerHeader from "@/components/page-headers/BeerHeader"
import MobileBeerHeader from "@/components/page-headers/MobileBeerHeader"
import { getSanityBeers } from "@/lib/sanityBeers"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Beer",
  description: "Explore ABCo beers on tap and seasonal releases.",
}

export default async function BeerPage() {
  const beers = await getSanityBeers()

  return (
    <>
      <div className="hidden md:block">
        <BeerHeader />
      </div>

      <div className="md:hidden">
        <MobileBeerHeader />
      </div>

      <div className="hidden md:block">
        <BeerCatalog beers={beers} />
      </div>

      <MobileBeerCatalog beers={beers} />
    </>
  )
}
