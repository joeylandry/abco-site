import { notFound } from "next/navigation"
import type { Metadata } from "next"
import BeerDetailView from "@/components/beer/BeerDetailView"
import { getBeerById, getRelatedBeers, mockBeers } from "@/app/beer/mockBeers"

type BeerDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

export async function generateStaticParams() {
  return mockBeers.map((beer) => ({
    id: beer.id,
  }))
}

export async function generateMetadata({
  params,
}: BeerDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const beer = getBeerById(id)

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
  const beer = getBeerById(id)

  if (!beer) {
    notFound()
  }

  const relatedBeers = getRelatedBeers(beer.id, 8)
  return <BeerDetailView beer={beer} relatedBeers={relatedBeers} />
}
