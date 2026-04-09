"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { scrollToTopInstantly } from "@/lib/scrollToTop"

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0
}

export default function ScrollToTopOnNavigation() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const search = searchParams.toString()
  const currentLocation = search ? `${pathname}?${search}` : pathname
  const previousLocationRef = useRef(currentLocation)

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual"
    }
  }, [])

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || isModifiedClick(event)) {
        return
      }

      const target = event.target
      if (!(target instanceof Element)) {
        return
      }

      const anchor = target.closest("a[href]") as HTMLAnchorElement | null
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
        return
      }

      const href = anchor.getAttribute("href")
      if (!href || href.startsWith("#")) {
        return
      }

      let url: URL
      try {
        url = new URL(anchor.href, window.location.href)
      } catch {
        return
      }

      if (url.origin !== window.location.origin) {
        return
      }

      const currentUrl = `${window.location.pathname}${window.location.search}`
      const nextUrl = `${url.pathname}${url.search}`

      if (currentUrl === nextUrl) {
        return
      }

      scrollToTopInstantly()
    }

    document.addEventListener("click", handleClick, true)

    return () => {
      document.removeEventListener("click", handleClick, true)
    }
  }, [])

  useLayoutEffect(() => {
    if (previousLocationRef.current === currentLocation) {
      return
    }

    scrollToTopInstantly()
    const animationFrame = window.requestAnimationFrame(scrollToTopInstantly)
    previousLocationRef.current = currentLocation

    return () => {
      window.cancelAnimationFrame(animationFrame)
    }
  }, [currentLocation])

  return null
}
