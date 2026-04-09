"use client";

import { useEffect, useRef, useState } from "react";

type CrossfadeCarouselOptions = {
  intervalMs?: number;
  fadeMs?: number;
};

export function useCrossfadeCarousel(
  images: string[],
  { intervalMs = 8000, fadeMs = 1200 }: CrossfadeCarouselOptions = {}
) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [incomingVisible, setIncomingVisible] = useState(false);

  const activeIndexRef = useRef(0);
  const incomingIndexRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    incomingIndexRef.current = incomingIndex;
  }, [incomingIndex]);

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const nextIndex = (activeIndexRef.current + 1) % images.length;
    const preloader = new window.Image();
    preloader.src = images[nextIndex];
  }, [activeIndex, images]);

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    let cancelled = false;

    const startTransition = () => {
      if (cancelled || incomingIndexRef.current !== null) {
        return;
      }

      const nextIndex = (activeIndexRef.current + 1) % images.length;
      const nextSrc = images[nextIndex];
      const preloader = new window.Image();
      let didReveal = false;

      const commitNextIndex = () => {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        setIncomingIndex(null);
        setIncomingVisible(false);
      };

      if (fadeMs <= 0) {
        const revealInstantly = () => {
          if (cancelled || didReveal) {
            return;
          }

          didReveal = true;
          commitNextIndex();
        };

        preloader.onload = revealInstantly;
        preloader.onerror = revealInstantly;
        preloader.src = nextSrc;

        if (preloader.complete) {
          revealInstantly();
        }

        return;
      }

      const reveal = () => {
        if (cancelled || didReveal) {
          return;
        }

        didReveal = true;
        setIncomingIndex(nextIndex);
        setIncomingVisible(false);

        rafRef.current = window.requestAnimationFrame(() => {
          if (cancelled) {
            return;
          }

          rafRef.current = window.requestAnimationFrame(() => {
            if (cancelled) {
              return;
            }

            setIncomingVisible(true);

            transitionTimeoutRef.current = window.setTimeout(() => {
              if (cancelled) {
                return;
              }

              commitNextIndex();
            }, fadeMs);
          });
        });
      };

      preloader.onload = reveal;
      preloader.onerror = reveal;
      preloader.src = nextSrc;

      if (preloader.complete) {
        reveal();
      }
    };

    const interval = window.setInterval(startTransition, intervalMs);

    return () => {
      cancelled = true;
      window.clearInterval(interval);

      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [fadeMs, images, intervalMs]);

  return {
    activeIndex,
    incomingIndex,
    incomingVisible,
  };
}
