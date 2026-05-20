import { notFound } from "next/navigation"
import type { Metadata } from "next"
import BeerDetailView from "@/components/beer/BeerDetailView"
import { getRelatedBeers } from "@/app/beer/mockBeers"
import { getSanityBeerBySlug } from "@/lib/sanityBeers"

export const dynamic = "force-dynamic"

type BeerDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params,
}: BeerDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const beer = await getSanityBeerBySlug(id)

  if (!beer) {
    return {
      title: "Beer Not Found",
    }
  }

  return {
    title: beer.name,
    description: beer.shortDescription,
  }
}

export default async function BeerDetailPage({ params }: BeerDetailPageProps) {
  const { id } = await params
  const beer = await getSanityBeerBySlug(id)

  if (!beer) {
    notFound()
  }

  const relatedBeers = getRelatedBeers(beer.id, 8)
  return <BeerDetailView beer={beer} relatedBeers={relatedBeers} />
}
