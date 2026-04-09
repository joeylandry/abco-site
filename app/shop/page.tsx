import ShopHeader from "@/components/page-headers/ShopHeader"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop",
  description: "Shop ABCo merch and brewery gear.",
}

export default function ShopPage() {
  return (
    <>
      <ShopHeader />

      <div className="max-w-6xl mx-auto py-20 px-6">
        {/* Content */}
      </div>
    </>
  )
}
