"use client"

import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { useRouter } from "next/navigation"

type BeerFinderBeerSearchProps = {
  beers: Array<{
    id: string
    name: string
  }>
  className?: string
}

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "")
}

const ZIP_CODE_PATTERN = /^\d{5}$/
const MAX_VISIBLE_BEER_SUGGESTIONS = 8

function isCompleteZipCode(value: string) {
  return ZIP_CODE_PATTERN.test(value.trim())
}

export default function BeerFinderBeerSearch({ beers, className }: BeerFinderBeerSearchProps) {
  const router = useRouter()
  const [zipCode, setZipCode] = useState("")
  const [query, setQuery] = useState("")
  const [selectedBeerIds, setSelectedBeerIds] = useState<string[]>([])
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const [highlightedSuggestionIndex, setHighlightedSuggestionIndex] = useState(0)
  const searchFieldRef = useRef<HTMLDivElement | null>(null)

  const beersByNormalizedName = useMemo(() => {
    return new Map(beers.map((beer) => [normalizeText(beer.name), beer]))
  }, [beers])

  const beersById = useMemo(() => new Map(beers.map((beer) => [beer.id, beer])), [beers])
  const selectedBeerIdSet = useMemo(() => new Set(selectedBeerIds), [selectedBeerIds])

  const normalizedQuery = normalizeText(query)
  const matchingBeer = normalizedQuery ? beersByNormalizedName.get(normalizedQuery) ?? null : null
  const availableBeers = useMemo(
    () => beers.filter((beer) => !selectedBeerIdSet.has(beer.id)),
    [beers, selectedBeerIdSet]
  )
  const filteredBeers = useMemo(() => {
    const searchableBeers = normalizedQuery
      ? availableBeers.filter((beer) => normalizeText(beer.name).includes(normalizedQuery))
      : availableBeers

    return searchableBeers.slice(0, MAX_VISIBLE_BEER_SUGGESTIONS)
  }, [availableBeers, normalizedQuery])

  const trimmedZipCode = zipCode.trim()
  const hasZipCode = trimmedZipCode.length > 0
  const zipCodeIsValid = !hasZipCode || isCompleteZipCode(trimmedZipCode)

  const missingSearch = hasSubmitted && !hasZipCode && selectedBeerIds.length === 0
  const showZipError = hasSubmitted && hasZipCode && !zipCodeIsValid
  const showBeerError = hasSubmitted && query.trim().length > 0 && !matchingBeer
  const canSubmit = zipCodeIsValid && (hasZipCode || selectedBeerIds.length > 0)
  const shouldShowSuggestions = isSuggestionsOpen && filteredBeers.length > 0

  useEffect(() => {
    if (!isSuggestionsOpen) {
      return
    }

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null

      if (searchFieldRef.current?.contains(target)) {
        return
      }

      setIsSuggestionsOpen(false)
      setHighlightedSuggestionIndex(0)
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("touchstart", handlePointerDown)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("touchstart", handlePointerDown)
    }
  }, [isSuggestionsOpen])

  function addBeerToSearch(beerId: string) {
    setSelectedBeerIds((currentIds) => (currentIds.includes(beerId) ? currentIds : [...currentIds, beerId]))
    setQuery("")
    setIsSuggestionsOpen(false)
    setHighlightedSuggestionIndex(0)
    setHasSubmitted(false)
  }

  function handleBeerSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault()

      if (filteredBeers.length === 0) {
        return
      }

      setIsSuggestionsOpen(true)
      setHighlightedSuggestionIndex((currentIndex) => (currentIndex + 1) % filteredBeers.length)
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()

      if (filteredBeers.length === 0) {
        return
      }

      setIsSuggestionsOpen(true)
      setHighlightedSuggestionIndex((currentIndex) =>
        currentIndex === 0 ? filteredBeers.length - 1 : currentIndex - 1
      )
      return
    }

    if (event.key === "Escape") {
      setIsSuggestionsOpen(false)
      setHighlightedSuggestionIndex(0)
      return
    }

    if (event.key !== "Enter") {
      return
    }

    if (!query.trim()) {
      return
    }

    const highlightedBeer = filteredBeers[highlightedSuggestionIndex]
    const resolvedBeer = highlightedBeer ?? matchingBeer

    if (!resolvedBeer) {
      return
    }

    event.preventDefault()
    addBeerToSearch(resolvedBeer.id)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setHasSubmitted(true)

    if (!zipCodeIsValid || (!hasZipCode && selectedBeerIds.length === 0)) {
      return
    }

    const params = new URLSearchParams()

    if (hasZipCode) {
      params.set("zip", trimmedZipCode)
    }

    for (const beerId of selectedBeerIds) {
      params.append("beer", beerId)
    }

    const queryString = params.toString()
    router.push(queryString ? `/beer-finder?${queryString}` : "/beer-finder")
  }

  return (
    <form onSubmit={handleSubmit} className={["space-y-3", className].filter(Boolean).join(" ")} noValidate>
      <label className="block">
        <span className="sr-only">Search by ZIP code</span>
        <input
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          value={zipCode}
          onChange={(event) => {
            setZipCode(event.target.value)
            setHasSubmitted(false)
          }}
          placeholder="ZIP code"
          className="h-11 w-full rounded-full border border-black/10 bg-white px-5 text-xs font-semibold uppercase tracking-[0.18em] text-black/80 outline-none transition placeholder:text-black/35 focus:border-black/25"
          aria-invalid={showZipError}
          aria-describedby={showZipError ? "beer-finder-zip-search-error" : undefined}
        />
      </label>

      <label className="block">
        <span className="sr-only">Search for beers</span>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="min-w-0 flex-1">
            <div ref={searchFieldRef} className="relative">
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setIsSuggestionsOpen(true)
                  setHighlightedSuggestionIndex(0)
                  setHasSubmitted(false)
                }}
                onFocus={() => {
                  if (availableBeers.length > 0) {
                    setIsSuggestionsOpen(true)
                  }
                }}
                onClick={() => {
                  if (availableBeers.length > 0) {
                    setIsSuggestionsOpen(true)
                  }
                }}
                onKeyDown={handleBeerSearchKeyDown}
                placeholder="Search beers..."
                role="combobox"
                aria-haspopup="listbox"
                className="h-11 w-full rounded-full border border-black/10 bg-white px-5 text-xs font-semibold uppercase tracking-[0.18em] text-black/80 outline-none transition placeholder:text-black/35 focus:border-black/25"
                aria-invalid={showBeerError}
                aria-expanded={shouldShowSuggestions}
                aria-controls={shouldShowSuggestions ? "beer-finder-beer-search-options" : undefined}
                aria-autocomplete="list"
                aria-describedby={
                  showBeerError ? "beer-finder-beer-search-error" : missingSearch ? "beer-finder-missing-search-error" : undefined
                }
              />

              {shouldShowSuggestions ? (
                <div
                  id="beer-finder-beer-search-options"
                  role="listbox"
                  className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-[20px] border border-black/10 bg-white py-2 shadow-[0_16px_36px_rgba(15,23,42,0.12)]"
                >
                  {filteredBeers.map((beer, index) => {
                    const isHighlighted = index === highlightedSuggestionIndex

                    return (
                      <button
                        key={beer.id}
                        type="button"
                        role="option"
                        aria-selected={isHighlighted}
                        onMouseDown={(event) => {
                          event.preventDefault()
                          addBeerToSearch(beer.id)
                        }}
                        className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.16em] transition ${
                          isHighlighted ? "bg-black/[0.05] text-black" : "text-black/70 hover:bg-black/[0.03] hover:text-black"
                        }`}
                      >
                        <span>{beer.name}</span>
                        <span className="text-[10px] tracking-[0.18em] text-black/40">Add</span>
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </div>

            {selectedBeerIds.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedBeerIds.map((beerId) => {
                  const beer = beersById.get(beerId)
                  if (!beer) {
                    return null
                  }

                  return (
                    <span
                      key={beerId}
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/70"
                    >
                      {beer.name}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBeerIds((currentIds) => currentIds.filter((id) => id !== beerId))
                          setHasSubmitted(false)
                        }}
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-black/60 transition hover:bg-black/10 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-abco-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        aria-label={`Remove ${beer.name}`}
                      >
                        ×
                      </button>
                    </span>
                  )
                })}
              </div>
            ) : null}
          </div>

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-full border border-[#0f172a] bg-[#0f172a] px-6 text-xs font-semibold uppercase tracking-[0.18em] leading-none text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)] transition hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-abco-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canSubmit}
          >
            Search
          </button>
        </div>
      </label>

      {missingSearch ? (
        <p id="beer-finder-missing-search-error" className="text-xs font-semibold text-black/55">
          Enter a ZIP code or add at least one beer to search in Beer Finder.
        </p>
      ) : null}

      {showZipError ? (
        <p id="beer-finder-zip-search-error" className="text-xs font-semibold text-black/55">
          Enter a full 5-digit ZIP code.
        </p>
      ) : null}

      {showBeerError ? (
        <p id="beer-finder-beer-search-error" className="text-xs font-semibold text-black/55">
          Choose a beer from the list to add it to your search.
        </p>
      ) : null}
    </form>
  )
}
