"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { scrollToTopInstantly } from "@/lib/scrollToTop"

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
