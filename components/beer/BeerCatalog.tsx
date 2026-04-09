"use client"

import { useMemo, useState } from "react"
import BeerCard, { type BeerAvailability } from "@/components/beer/BeerCard"
import { getBeerAttributeOptions, mockBeers } from "@/app/beer/mockBeers"
import StyledSelect from "@/components/ui/StyledSelect"

const availabilityOptions: Array<{ value: "all" | BeerAvailability; label: string }> = [
  { value: "all", label: "All beers" },
  { value: "yearRound", label: "Year round" },
  { value: "seasonal", label: "Seasonal" },
  { value: "rotating", label: "Rotating" },
]

export default function BeerCatalog() {
  const [availability, setAvailability] = useState<"all" | BeerAvailability>("all")
  const [selectedTag, setSelectedTag] = useState("all")

  const tagOptions = useMemo(() => {
    const uniqueTags = getBeerAttributeOptions()

    return [
      { value: "all", label: "All attributes" },
      ...uniqueTags.map((tag) => ({
        value: tag,
        label: tag.charAt(0).toUpperCase() + tag.slice(1),
      })),
    ]
  }, [])

  const filteredBeers = useMemo(
    () =>
      mockBeers.filter((beer) => {
        const matchesAvailability = availability === "all" || beer.availability === availability
        const matchesTag = selectedTag === "all" || (beer.tags ?? []).includes(selectedTag)

        return matchesAvailability && matchesTag
      }),
    [availability, selectedTag]
  )

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:py-10">
      <div className="grid gap-y-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-x-6">
        <div>
          <h2 className="font-heading text-3xl text-foreground sm:text-4xl">
            Explore Our Beers
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-foreground/75 sm:text-base">
            Crisp lagers, hop-forward IPAs, and rotating small-batch pours for every kind of pint.
          </p>
        </div>

        <div className="sticky top-[5.5rem] z-40 max-w-full lg:justify-self-end">
          <div className="flex max-w-full flex-col gap-2 border border-black/10 bg-white/92 px-4 py-3 shadow-sm backdrop-blur sm:rounded-full sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <div className="flex items-center gap-2">
              <label htmlFor="beer-general-filter" className="text-xs font-semibold tracking-wide text-black/70">
                General filter
              </label>
              <StyledSelect
                id="beer-general-filter"
                value={availability}
                onChange={(value) => setAvailability(value as "all" | BeerAvailability)}
                options={availabilityOptions}
                selectClassName="min-w-[94px] px-1 py-0 pr-4 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="beer-attribute-filter" className="text-xs font-semibold tracking-wide text-black/70">
                Attribute filter
              </label>
              <StyledSelect
                id="beer-attribute-filter"
                value={selectedTag}
                onChange={setSelectedTag}
                options={tagOptions}
                selectClassName="min-w-[94px] px-1 py-0 pr-4 text-xs"
              />
            </div>

            {selectedTag !== "all" ? (
              <button
                type="button"
                onClick={() => setSelectedTag("all")}
                className="rounded-full border border-black/15 bg-surface px-2.5 py-1.5 text-xs font-semibold tracking-wide text-black/80 uppercase transition-all duration-200 hover:-translate-y-0.5 hover:border-black/30"
              >
                Clear attribute filter
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4 lg:gap-5">
          {filteredBeers.map((beer) => (
            <div key={beer.id} className="mx-auto w-full max-w-[280px] lg:max-w-[260px]">
              <BeerCard beer={beer} />
            </div>
          ))}
        </div>

        {filteredBeers.length === 0 ? (
          <p className="text-sm text-black/70">
            No beers match that filter combo. Change a dropdown or clear the attribute filter.
          </p>
        ) : null}
      </div>
    </div>
  )
}
