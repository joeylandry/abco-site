"use client"

import Image from "next/image"
import Link from "next/link"
import { createPortal } from "react-dom"
import { useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from "react"
import { flushSync } from "react-dom"
import { PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS } from "@/config/nav"
import { useSwipeToCloseDrawer } from "@/components/layout/useSwipeToCloseDrawer"

const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/ArlingtonBrewingCompany/",
    label: "Instagram",
    icon: "instagram",
  },
  {
    href: "https://www.facebook.com/ArlingtonBrewingCompany",
    label: "Facebook",
    icon: "facebook",
  },
] as const

const DRAWER_ADDRESS = ["15 Ryder St", "Arlington, MA 02476"]
const DRAWER_HOURS = ["Opening in 2026", "Taproom hours coming soon"]
const DRAWER_PHONE = "Phone: (coming soon)"
const DRAWER_TRANSITION_MS = 350
const MOBILE_EDGE_SWIPE_TRIGGER_PX = 8
const MOBILE_EDGE_SWIPE_OPEN_THRESHOLD = 0.84

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export default function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDrawerRendered, setIsDrawerRendered] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerDragProgress, setDrawerDragProgress] = useState<number | null>(null)
  const openTimerRef = useRef<number | null>(null)
  const closeTimerRef = useRef<number | null>(null)
  const edgeSwipeRef = useRef<{
    startX: number
    startY: number
    lastX: number
    lastY: number
    active: boolean
  } | null>(null)
  const drawerDragProgressRef = useRef<number | null>(null)
  const scrollYRef = useRef(0)
  const shouldRestoreScrollRef = useRef(true)
  const previousBodyStyleRef = useRef<{
    position: string
    top: string
    width: string
    overflow: string
    touchAction: string
  } | null>(null)

  const resetSwipeState = () => {
    edgeSwipeRef.current = null
    drawerDragProgressRef.current = null
    setDrawerDragProgress(null)
  }

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

      setIsMenuOpen(false)
      setIsDrawerOpen(false)

      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }

      closeTimerRef.current = window.setTimeout(() => {
        setIsDrawerRendered(false)
        closeTimerRef.current = null
      }, DRAWER_TRANSITION_MS)
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

  const closeMenu = (immediate = false) => {
    resetSwipeState()

    if (immediate) {
      shouldRestoreScrollRef.current = false
    }

    setIsMenuOpen(false)

    if (openTimerRef.current !== null) {
      window.cancelAnimationFrame(openTimerRef.current)
      openTimerRef.current = null
    }

    setIsDrawerOpen(false)

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    if (immediate) {
      flushSync(() => {
        unlockBodyScroll()
        setIsDrawerRendered(false)
      })
      return
    }

    closeTimerRef.current = window.setTimeout(() => {
      setIsDrawerRendered(false)
      closeTimerRef.current = null
    }, DRAWER_TRANSITION_MS)
  }

  const openMenu = () => {
    resetSwipeState()
    shouldRestoreScrollRef.current = true

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

  const finishSwipeOpen = () => {
    resetSwipeState()
    shouldRestoreScrollRef.current = true

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    if (openTimerRef.current !== null) {
      window.cancelAnimationFrame(openTimerRef.current)
      openTimerRef.current = null
    }

    setIsMenuOpen(true)
    setIsDrawerRendered(true)
    setIsDrawerOpen(true)
  }

  const onEdgeTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    if (event.touches.length !== 1 || !window.matchMedia("(max-width: 767px)").matches) {
      return
    }

    const touch = event.touches[0]
    edgeSwipeRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      lastX: touch.clientX,
      lastY: touch.clientY,
      active: false,
    }
  }

  const onEdgeTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
    const swipeState = edgeSwipeRef.current

    if (!swipeState || event.touches.length !== 1) {
      return
    }

    const touch = event.touches[0]
    const deltaX = touch.clientX - swipeState.startX
    const deltaY = touch.clientY - swipeState.startY

    swipeState.lastX = touch.clientX
    swipeState.lastY = touch.clientY

    if (
      deltaX >= 0 ||
      Math.abs(deltaX) < MOBILE_EDGE_SWIPE_TRIGGER_PX ||
      Math.abs(deltaX) < Math.abs(deltaY) * 1.1
    ) {
      return
    }

    event.preventDefault()

    if (!swipeState.active) {
      swipeState.active = true
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
      }

      setIsMenuOpen(true)
      setIsDrawerRendered(true)
    }

    const drawerWidth = Math.min(window.innerWidth * 0.82, 320)
    const progress = clamp(1 + deltaX / drawerWidth, 0, 1)
    drawerDragProgressRef.current = progress
    setDrawerDragProgress(progress)
  }

  const onEdgeTouchEnd = () => {
    const swipeState = edgeSwipeRef.current
    const progress = drawerDragProgressRef.current

    edgeSwipeRef.current = null

    if (!swipeState?.active) {
      resetSwipeState()
      return
    }

    const drawerWidth = Math.min(window.innerWidth * 0.82, 320)
    const distanceDragged = swipeState.startX - swipeState.lastX
    const shouldOpen =
      (typeof progress === "number" && progress <= MOBILE_EDGE_SWIPE_OPEN_THRESHOLD) ||
      distanceDragged >= drawerWidth * 0.2

    if (shouldOpen) {
      finishSwipeOpen()
      return
    }

    closeMenu()
  }

  const onEdgeTouchCancel = () => {
    edgeSwipeRef.current = null
    resetSwipeState()
  }

  const drawerSwipeHandlers = useSwipeToCloseDrawer({
    enabled: isDrawerOpen,
    onClose: closeMenu,
  })

  const drawerTransform =
    drawerDragProgress !== null
      ? `translate3d(${drawerDragProgress * 100}%, 0, 0)`
      : isDrawerOpen
        ? "translate3d(0, 0, 0)"
        : "translate3d(100%, 0, 0)"

  const drawerBackdropOpacity =
    drawerDragProgress !== null
      ? 0.35 * (1 - drawerDragProgress)
      : isDrawerOpen
        ? 0.35
        : 0

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center gap-2.5 px-2 py-2.5 text-base font-semibold text-neutral-700 transition hover:text-neutral-900 md:hidden"
        aria-label="Open header navigation"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-navigation"
        aria-haspopup="dialog"
        onClick={openMenu}
      >
        <span>Menu</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </svg>
      </button>

      <div
        className="fixed bottom-0 right-0 top-[4.75rem] z-[40] w-7 md:hidden touch-pan-y"
        aria-hidden="true"
        onTouchStart={onEdgeTouchStart}
        onTouchMove={onEdgeTouchMove}
        onTouchEnd={onEdgeTouchEnd}
        onTouchCancel={onEdgeTouchCancel}
      />

      {isDrawerRendered && typeof document !== "undefined"
        ? createPortal(
            <div className="fixed inset-0 z-[100] md:hidden">
              <button
                type="button"
                aria-label="Close navigation menu"
                className={`absolute inset-0 bg-black/35 transition-opacity duration-200 ${
                  isDrawerOpen || drawerDragProgress !== null ? "opacity-100" : "opacity-0"
                }`}
                style={{ opacity: drawerBackdropOpacity }}
                onClick={() => closeMenu()}
              />

              <div
                id="mobile-navigation"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className="absolute inset-y-0 right-0 flex h-full w-[min(20rem,82vw)] flex-col overflow-y-auto overscroll-contain rounded-none border-l border-black/10 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.18)] transform-gpu will-change-transform touch-pan-y"
                style={{
                  transform: drawerTransform,
                  transitionProperty: drawerDragProgress !== null ? "none" : "transform",
                  transitionDuration: drawerDragProgress !== null ? "0ms" : "300ms",
                  transitionTimingFunction: "ease-out",
                }}
                {...drawerSwipeHandlers}
              >
                <div className="flex items-center justify-center border-b border-black/8 px-4 py-3">
                  <Link
                    href="/"
                    onClick={() => closeMenu(true)}
                    className="flex items-center justify-center leading-none"
                  >
                    <Image
                      src="/wide_logo.png"
                      alt="ABCo"
                      width={380}
                      height={125}
                      className="block h-16 w-auto"
                    />
                    <span className="sr-only">ABCo</span>
                  </Link>
                  <button
                    type="button"
                    className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center text-neutral-800 transition hover:text-neutral-950"
                    aria-label="Close navigation menu"
                    onClick={() => closeMenu()}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <path d="M6 6l12 12" />
                      <path d="M18 6 6 18" />
                    </svg>
                  </button>
                </div>

                <div className="grid gap-6 px-5 py-6 pb-10">
                  <nav
                    aria-label="Mobile quick links"
                    className="mx-auto flex w-full max-w-[18rem] items-center justify-center gap-3 overflow-hidden"
                  >
                    {SECONDARY_NAV_ITEMS.map((item) =>
                      item.label === "Beer Finder" ? (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => closeMenu(true)}
                          className="inline-flex items-center gap-1.5 whitespace-nowrap text-[0.92rem] font-semibold text-neutral-700 transition hover:text-neutral-900"
                        >
                          <span>{item.label}</span>
                          <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-50" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                          </span>
                        </Link>
                      ) : (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => closeMenu(true)}
                          className="inline-flex items-center whitespace-nowrap text-[0.92rem] font-semibold text-neutral-700 transition hover:text-neutral-900"
                        >
                          {item.label}
                        </Link>
                      )
                    )}

                    {SOCIAL_LINKS.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={link.label}
                        onClick={() => closeMenu(true)}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-neutral-700 transition hover:text-neutral-900"
                      >
                        {link.icon === "instagram" ? (
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
                            <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
                            <circle cx="12" cy="12" r="4" />
                            <circle cx="16.9" cy="7.1" r="0.9" fill="currentColor" stroke="none" />
                          </svg>
                        ) : (
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill="currentColor"
                          >
                            <path d="M13.5 21v-7.1h2.4l.36-2.8H13.5V9.32c0-.82.22-1.38 1.4-1.38h1.5V5.44c-.26-.04-1.16-.11-2.2-.11-2.18 0-3.67 1.33-3.67 3.77v2.01H8v2.8h2.53V21h2.97Z" />
                          </svg>
                        )}
                      </a>
                    ))}
                  </nav>

                  <div className="border-t border-black/8 pt-6">
                    <div className="relative min-h-[clamp(20rem,52vw,26rem)] overflow-hidden">
                      <div className="pointer-events-none absolute left-1 top-1/2 h-[clamp(272px,66vw,360px)] w-[clamp(188px,50vw,248px)] -translate-y-1/2 -translate-x-1 rotate-[-8deg]">
                        <Image
                          src="/spy_p_a_cutout.png"
                          alt=""
                          fill
                          sizes="(max-width: 768px) 50vw, 248px"
                          className="object-contain"
                          priority={false}
                        />
                      </div>

                      <nav
                        aria-label="Mobile primary navigation"
                        className="relative z-10 grid w-full min-w-0 gap-2"
                      >
                        {PRIMARY_NAV_ITEMS.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => closeMenu(true)}
                            className="flex min-h-12 w-full items-center justify-end rounded-2xl px-4 py-3 text-right text-[1.05rem] font-medium text-neutral-700 transition hover:bg-black/[0.03] hover:text-neutral-900 active:bg-black/[0.05]"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </nav>
                    </div>
                  </div>

                  <div className="border-t border-black/8 pt-6">
                    <div className="grid gap-5 text-sm text-neutral-700">
                      <div className="grid gap-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                          Hours
                        </p>
                        <div className="leading-6 text-neutral-700">
                          {DRAWER_HOURS.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                          Contact
                        </p>
                        <p>{DRAWER_PHONE}</p>
                        <Link
                          href="/contact"
                          onClick={() => closeMenu(true)}
                          className="font-medium text-neutral-700 transition hover:text-neutral-900"
                        >
                          Contact Us
                        </Link>
                      </div>

                      <div className="grid gap-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                          Address
                        </p>
                        <a
                          href="https://www.google.com/maps/search/?api=1&query=15+Ryder+St+Arlington+MA+02476"
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => closeMenu(true)}
                          className="leading-6 text-neutral-700 transition hover:text-neutral-900"
                        >
                          {DRAWER_ADDRESS.map((line) => (
                            <span key={line} className="block">
                              {line}
                            </span>
                          ))}
                        </a>
                      </div>
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
