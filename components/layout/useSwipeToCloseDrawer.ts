"use client"

import { useEffect, useRef, type TouchEventHandler } from "react"

type SwipeDirection = "left" | "right" | "up" | "down"

type UseSwipeToCloseDrawerOptions = {
  enabled: boolean
  onClose: () => void
  direction?: SwipeDirection
  threshold?: number
}

type TouchPoint = {
  x: number
  y: number
}

function isInteractiveTouchTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false
  }

  return Boolean(
    target.closest(
      "a,button,input,textarea,select,label,[role='button'],[role='link'],[contenteditable='true']"
    )
  )
}

function isSwipeTowardDirection(
  deltaX: number,
  deltaY: number,
  direction: SwipeDirection,
  threshold: number,
  axisRatio = 1.15
) {
  const primaryAxisDelta =
    direction === "left" || direction === "right" ? Math.abs(deltaX) : Math.abs(deltaY)
  const secondaryAxisDelta =
    direction === "left" || direction === "right" ? Math.abs(deltaY) : Math.abs(deltaX)

  if (primaryAxisDelta < threshold) {
    return false
  }

  if (primaryAxisDelta < secondaryAxisDelta * axisRatio) {
    return false
  }

  switch (direction) {
    case "left":
      return deltaX < 0
    case "right":
      return deltaX > 0
    case "up":
      return deltaY < 0
    case "down":
      return deltaY > 0
  }
}

export function useSwipeToCloseDrawer({
  enabled,
  onClose,
  direction = "right",
  threshold = 56,
}: UseSwipeToCloseDrawerOptions) {
  const touchStartRef = useRef<TouchPoint | null>(null)

  const resetTouch = () => {
    touchStartRef.current = null
  }

  const onTouchStart: TouchEventHandler<HTMLElement> = (event) => {
    if (!enabled || event.touches.length !== 1) {
      return
    }

    const touch = event.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    }
  }

  const onTouchMove: TouchEventHandler<HTMLElement> = (event) => {
    if (!enabled || !touchStartRef.current || event.touches.length !== 1) {
      return
    }

    const touch = event.touches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y

    if (!isSwipeTowardDirection(deltaX, deltaY, direction, threshold)) {
      return
    }

    onClose()
    resetTouch()
  }

  const onTouchEnd: TouchEventHandler<HTMLElement> = () => {
    resetTouch()
  }

  const onTouchCancel: TouchEventHandler<HTMLElement> = () => {
    resetTouch()
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
  }
}

type UseSwipeToOpenDrawerFromEdgeOptions = {
  enabled: boolean
  onOpen: () => void
  edgeThreshold?: number
  direction?: SwipeDirection
  threshold?: number
  axisRatio?: number
  startFromAnywhere?: boolean
}

function useSwipeToOpenDrawer({
  enabled,
  onOpen,
  edgeThreshold = 44,
  direction = "left",
  threshold = 32,
  axisRatio = 1.05,
  startFromAnywhere = false,
}: UseSwipeToOpenDrawerFromEdgeOptions) {
  const touchStartRef = useRef<TouchPoint | null>(null)
  const onOpenRef = useRef(onOpen)

  useEffect(() => {
    onOpenRef.current = onOpen
  }, [onOpen])

  useEffect(() => {
    if (enabled || typeof window === "undefined") {
      return
    }

    const resetTouch = () => {
      touchStartRef.current = null
    }

    const isRightEdgeStart = (clientX: number) => clientX >= window.innerWidth - edgeThreshold

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1 || !window.matchMedia("(max-width: 767px)").matches) {
        return
      }

      if (isInteractiveTouchTarget(event.target)) {
        return
      }

      const touch = event.touches[0]

      if (!startFromAnywhere && !isRightEdgeStart(touch.clientX)) {
        return
      }

      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      }
    }

    const onTouchMove = (event: TouchEvent) => {
      if (!touchStartRef.current || event.touches.length !== 1) {
        return
      }

      const touch = event.touches[0]
      const deltaX = touch.clientX - touchStartRef.current.x
      const deltaY = touch.clientY - touchStartRef.current.y

      if (!isSwipeTowardDirection(deltaX, deltaY, direction, threshold, axisRatio)) {
        return
      }

      event.preventDefault()
      onOpenRef.current()
      resetTouch()
    }

    const onTouchEnd = () => {
      resetTouch()
    }

    const onTouchCancel = () => {
      resetTouch()
    }

    document.addEventListener("touchstart", onTouchStart, { passive: true })
    document.addEventListener("touchmove", onTouchMove, { passive: false })
    document.addEventListener("touchend", onTouchEnd, { passive: true })
    document.addEventListener("touchcancel", onTouchCancel, { passive: true })

    return () => {
      document.removeEventListener("touchstart", onTouchStart)
      document.removeEventListener("touchmove", onTouchMove)
      document.removeEventListener("touchend", onTouchEnd)
      document.removeEventListener("touchcancel", onTouchCancel)
    }
  }, [axisRatio, direction, edgeThreshold, enabled, startFromAnywhere, threshold])
}

export function useSwipeToOpenDrawerFromEdge({
  enabled,
  onOpen,
  edgeThreshold = 44,
  direction = "left",
  threshold = 32,
  axisRatio = 1.05,
}: UseSwipeToOpenDrawerFromEdgeOptions) {
  useSwipeToOpenDrawer({
    enabled,
    onOpen,
    edgeThreshold,
    direction,
    threshold,
    axisRatio,
    startFromAnywhere: false,
  })
}

export function useSwipeToOpenDrawerFromAnywhere({
  enabled,
  onOpen,
  direction = "left",
  threshold = 18,
  axisRatio = 1.02,
}: UseSwipeToOpenDrawerFromEdgeOptions) {
  useSwipeToOpenDrawer({
    enabled,
    onOpen,
    direction,
    threshold,
    axisRatio,
    startFromAnywhere: true,
  })
}
