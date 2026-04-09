import type { Metadata } from "next"
import BeerCatalog from "@/components/beer/BeerCatalog"
import MobileBeerCatalog from "@/components/beer/MobileBeerCatalog"
import BeerHeader from "@/components/page-headers/BeerHeader"
import MobileBeerHeader from "@/components/page-headers/MobileBeerHeader"

export const metadata: Metadata = {
  title: "Beer",
  description: "Explore ABCo beers on tap and seasonal releases.",
}

export default function BeerPage() {
  return (
    <>
      <div className="hidden md:block">
        <BeerHeader />
      </div>

      <div className="md:hidden">
        <MobileBeerHeader />
      </div>

      <div className="hidden md:block">
        <BeerCatalog />
      </div>

      <MobileBeerCatalog />
    </>
  )
}
