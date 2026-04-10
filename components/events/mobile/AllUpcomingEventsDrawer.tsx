"use client"

import { createPortal } from "react-dom"
import { flushSync } from "react-dom"
import { useEffect, useRef, useState } from "react"
import clsx from "clsx"
import { upcomingEvents } from "@/app/events/mockEvents"
import { useSwipeToCloseDrawer } from "@/components/layout/useSwipeToCloseDrawer"
import MobileDrawerHeader from "@/components/layout/MobileDrawerHeader"
import { MobileCalendarGridCard } from "@/components/events/mobile/MobileEventWidgets"
import { scrollToTopInstantly } from "@/lib/scrollToTop"

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

type AllUpcomingEventsDrawerProps = {
  className?: string
  triggerLabel?: string
}

export default function AllUpcomingEventsDrawer({
  className,
  triggerLabel = "View all events",
}: AllUpcomingEventsDrawerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDrawerRendered, setIsDrawerRendered] = useState(false)
  const openTimerRef = useRef<number | null>(null)
  const closeTimerRef = useRef<number | null>(null)
  const scrollYRef = useRef(0)
  const shouldRestoreScrollRef = useRef(true)
  const previousBodyStyleRef = useRef<{
    position: string
    top: string
    width: string
    overflow: string
    touchAction: string
  } | null>(null)

  const unlockBodyScroll = () => {
    const previousBodyStyle = previousBodyStyleRef.current
    const bodyStyle = document.body.style
    const htmlStyle = document.documentElement.style

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
  }

  useEffect(() => {
    if (!isDrawerRendered) {
      return
    }

    const bodyStyle = document.body.style
    const htmlStyle = document.documentElement.style
    const scrollY = window.scrollY
    const openedLocation = `${window.location.pathname}${window.location.search}`

    shouldRestoreScrollRef.current = true
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
      unlockBodyScroll()
      window.removeEventListener("keydown", onKeyDown)

      if (
        shouldRestoreScrollRef.current &&
        `${window.location.pathname}${window.location.search}` === openedLocation &&
        window.scrollY !== scrollYRef.current
      ) {
        window.scrollTo(0, scrollYRef.current)
      }

      shouldRestoreScrollRef.current = true
    }
  }, [isDrawerRendered])

  const openDrawer = () => {
    shouldRestoreScrollRef.current = true

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    setIsDrawerRendered(true)

    if (openTimerRef.current !== null) {
      window.cancelAnimationFrame(openTimerRef.current)
    }

    openTimerRef.current = window.requestAnimationFrame(() => {
      setIsDrawerOpen(true)
      openTimerRef.current = null
    })
  }

  const closeDrawer = (immediate = false) => {
    if (immediate) {
      shouldRestoreScrollRef.current = false
    }

    setIsDrawerOpen(false)

    if (openTimerRef.current !== null) {
      window.cancelAnimationFrame(openTimerRef.current)
      openTimerRef.current = null
    }

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    if (immediate) {
      flushSync(() => {
        unlockBodyScroll()
        setIsDrawerRendered(false)
        scrollToTopInstantly()
      })
      return
    }

    closeTimerRef.current = window.setTimeout(() => {
      setIsDrawerRendered(false)
      closeTimerRef.current = null
    }, 240)
  }

  const drawerSwipeHandlers = useSwipeToCloseDrawer({
    enabled: isDrawerOpen,
    onClose: closeDrawer,
  })

  return (
    <>
      <div className={clsx("flex justify-center", className)}>
        <button
          type="button"
          onClick={openDrawer}
          aria-label={triggerLabel}
          aria-haspopup="dialog"
          aria-expanded={isDrawerOpen}
          aria-controls="mobile-events-drawer"
          className="inline-flex items-center gap-2 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-current opacity-80 transition hover:text-current hover:opacity-100"
        >
          <span>{triggerLabel}</span>
          <ArrowIcon />
        </button>
      </div>

      {isDrawerRendered && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[100] md:hidden">
              <button
                type="button"
                aria-label="Close all events"
                className={`absolute inset-0 bg-black/35 transition-opacity duration-200 ${
                  isDrawerOpen ? "opacity-100" : "opacity-0"
                }`}
                onClick={() => closeDrawer()}
              />

              <div
                id="mobile-events-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Upcoming events calendar"
                className={`absolute inset-y-0 right-0 flex h-full w-[min(24rem,90vw)] flex-col overflow-y-auto overscroll-contain border-l border-black/10 bg-background shadow-[0_28px_80px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-out touch-pan-y ${
                  isDrawerOpen ? "translate-x-0" : "translate-x-full"
                }`}
                {...drawerSwipeHandlers}
              >
                <MobileDrawerHeader
                  closeLabel="Close all events"
                  title="All Upcoming Events"
                  onClose={() => closeDrawer()}
                />

                <div className="px-4 pb-6 pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    {upcomingEvents.map((event, index) => (
                      <MobileCalendarGridCard
                        key={event.id}
                        event={event}
                        accentIndex={index}
                        onNavigate={() => closeDrawer(true)}
                      />
                    ))}
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
