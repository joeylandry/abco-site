"use client"

import { createPortal } from "react-dom"
import { useEffect, useMemo, useRef, useState } from "react"
import type { Beer } from "@/components/beer/BeerCard"
import MobileBeerCard from "@/components/beer/MobileBeerCard"
import { beerMatchesFilterSelections } from "@/app/beer/mockBeers"
import { useSwipeToCloseDrawer } from "@/components/layout/useSwipeToCloseDrawer"
import MobileDrawerHeader from "@/components/layout/MobileDrawerHeader"
import {
  countBeerFilterSelections,
  createEmptyBeerFilterSelections,
  toggleBeerFilterSelection,
  type BeerFilterGroup,
  type BeerFilterGroupKey,
  type BeerFilterSelections,
} from "@/studio/schemaTypes/shared/beerAttributes"

function FilterIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 7.5h15" />
      <path d="M7.5 12h9" />
      <path d="M10.5 16.5h3" />
    </svg>
  )
}

type MobileBeerCatalogProps = {
  beers: Beer[]
  beerFilterGroups: BeerFilterGroup[]
}

export default function MobileBeerCatalog({ beers, beerFilterGroups }: MobileBeerCatalogProps) {
  const [selectedFilters, setSelectedFilters] = useState<BeerFilterSelections>(
    createEmptyBeerFilterSelections,
  )
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDrawerRendered, setIsDrawerRendered] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const openTimerRef = useRef<number | null>(null)
  const closeTimerRef = useRef<number | null>(null)
  const scrollYRef = useRef(0)
  const previousBodyStyleRef = useRef<{
    position: string
    top: string
    width: string
    overflow: string
    touchAction: string
  } | null>(null)

  const filteredBeers = useMemo(
    () => beers.filter((beer) => beerMatchesFilterSelections(beer, selectedFilters)),
    [beers, selectedFilters]
  )

  const activeFilterCount = countBeerFilterSelections(selectedFilters)
  const hasActiveFilters = activeFilterCount > 0

  useEffect(() => {
    if (!isDrawerRendered) {
      return
    }

    const bodyStyle = document.body.style
    const htmlStyle = document.documentElement.style
    const scrollY = window.scrollY
    const openedLocation = `${window.location.pathname}${window.location.search}`

    scrollYRef.current = scrollY
    previousBodyStyleRef.current = {
      position: bodyStyle.position,
      top: bodyStyle.top,
      width: bodyStyle.width,
      overflow: bodyStyle.overflow,
      touchAction: bodyStyle.touchAction,
    }

    bodyStyle.position = "fixed"
    bodyStyle.top = `-${scrollY}px`
    bodyStyle.width = "100%"
    bodyStyle.overflow = "hidden"
    bodyStyle.touchAction = "none"
    htmlStyle.overflow = "hidden"
    htmlStyle.touchAction = "none"

    const closeDrawer = () => {
      if (openTimerRef.current !== null) {
        window.cancelAnimationFrame(openTimerRef.current)
        openTimerRef.current = null
      }

      setIsMenuOpen(false)
      setIsDrawerOpen(false)

      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }

      closeTimerRef.current = window.setTimeout(() => {
        setIsDrawerRendered(false)
        closeTimerRef.current = null
      }, 240)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer()
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      const previousBodyStyle = previousBodyStyleRef.current
      if (previousBodyStyle) {
        bodyStyle.position = previousBodyStyle.position
        bodyStyle.top = previousBodyStyle.top
        bodyStyle.width = previousBodyStyle.width
        bodyStyle.overflow = previousBodyStyle.overflow
        bodyStyle.touchAction = previousBodyStyle.touchAction
      } else {
        bodyStyle.position = ""
        bodyStyle.top = ""
        bodyStyle.width = ""
        bodyStyle.overflow = ""
        bodyStyle.touchAction = ""
      }

      htmlStyle.overflow = ""
      htmlStyle.touchAction = ""
      window.removeEventListener("keydown", onKeyDown)

      if (
        `${window.location.pathname}${window.location.search}` === openedLocation &&
        window.scrollY !== scrollYRef.current
      ) {
        window.scrollTo(0, scrollYRef.current)
      }
    }
  }, [isDrawerRendered])

  const openMenu = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    setIsMenuOpen(true)
    setIsDrawerRendered(true)

    if (openTimerRef.current !== null) {
      window.cancelAnimationFrame(openTimerRef.current)
    }

    openTimerRef.current = window.requestAnimationFrame(() => {
      setIsDrawerOpen(true)
      openTimerRef.current = null
    })
  }

  const closeMenu = () => {
    setIsMenuOpen(false)

    if (openTimerRef.current !== null) {
      window.cancelAnimationFrame(openTimerRef.current)
      openTimerRef.current = null
    }

    setIsDrawerOpen(false)

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
    }

    closeTimerRef.current = window.setTimeout(() => {
      setIsDrawerRendered(false)
      closeTimerRef.current = null
    }, 240)
  }

  const drawerSwipeHandlers = useSwipeToCloseDrawer({
    enabled: isDrawerOpen,
    onClose: closeMenu,
  })

  const clearFilters = () => {
    setSelectedFilters(createEmptyBeerFilterSelections)
  }

  const toggleFilterOption = (key: BeerFilterGroupKey, value: string) => {
    setSelectedFilters((current) => toggleBeerFilterSelection(current, key, value))
  }

  return (
    <>
      <section className="bg-background text-foreground md:hidden">
        <div className="w-full">
          <div className="fixed right-0 top-[5.25rem] z-50 w-full px-4 pt-2 pointer-events-none md:hidden">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={openMenu}
                aria-label="Open beer filters"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-beer-filter-menu"
                aria-haspopup="dialog"
                className={`pointer-events-auto relative inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full border px-4 text-[0.72rem] font-semibold uppercase tracking-[0.18em] transition ${
                  hasActiveFilters
                    ? "border-[#0f172a] bg-[#0f172a] text-white"
                    : "border-black/10 bg-white/95 text-neutral-700 hover:text-neutral-900"
                }`}
              >
                <span>Filter</span>
                <FilterIcon />
                {hasActiveFilters ? (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-semibold leading-none text-[#0f172a] shadow-sm">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-0">
            {filteredBeers.map((beer) => (
              <MobileBeerCard key={beer.id} beer={beer} />
            ))}
          </div>

          {filteredBeers.length === 0 ? (
            <p className="px-4 py-6 text-sm text-black/70">
              No beers match that filter combo. Change a filter or clear the selection.
            </p>
          ) : null}
        </div>
      </section>

      {isDrawerRendered && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[100] md:hidden">
              <button
                type="button"
                aria-label="Close beer filters"
                className={`absolute inset-0 bg-black/35 transition-opacity duration-200 ${
                  isDrawerOpen ? "opacity-100" : "opacity-0"
                }`}
                onClick={closeMenu}
              />

              <div
                id="mobile-beer-filter-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Beer filters"
                className={`absolute inset-y-0 right-0 flex h-full w-[min(22rem,88vw)] flex-col overflow-y-auto overscroll-contain border-l border-black/10 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-out touch-pan-y ${
                  isDrawerOpen ? "translate-x-0" : "translate-x-full"
                }`}
                {...drawerSwipeHandlers}
              >
                <MobileDrawerHeader
                  closeLabel="Close beer filters"
                  title="Beer Menu"
                  onClose={closeMenu}
                />

                <div className="grid gap-6 px-5 py-5 pb-10">
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                        Filters
                      </p>
                      {hasActiveFilters ? (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 transition hover:text-neutral-900"
                        >
                          Clear all
                        </button>
                      ) : null}
                    </div>

                    <div className="grid gap-4">
                      {beerFilterGroups.map((group) => {
                        const selectedValues = selectedFilters[group.key] ?? []

                        return (
                          <div key={group.key} className="grid gap-2">
                            <div className="space-y-1">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                                {group.title}
                              </p>
                              <p className="text-[11px] leading-relaxed text-neutral-500">
                                {group.description}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {group.options.map((option) => {
                                const isSelected = selectedValues.includes(option.value)

                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => toggleFilterOption(group.key, option.value)}
                                    aria-pressed={isSelected}
                                    className={`inline-flex min-h-10 items-center justify-center rounded-full border px-3.5 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f172a]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                                      isSelected
                                        ? "border-[#0f172a] bg-[#0f172a] text-white shadow-[0_12px_24px_rgba(15,23,42,0.14)]"
                                        : "border-black/10 bg-white/70 text-black hover:bg-white"
                                    }`}
                                  >
                                    {option.title}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  )
}
