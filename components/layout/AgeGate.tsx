"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

const EXIT_DURATION_MS = 700;
const AGE_VERIFIED_COOKIE = "abco-age-verified";
const AGE_VERIFIED_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 10;

function setHtmlVerified(isVerified: boolean) {
  document.documentElement.dataset.abcoAgeVerified = isVerified ? "true" : "false";
}

function setAgeVerifiedPersistence(rememberMe: boolean) {
  if (rememberMe) {
    document.cookie = `${AGE_VERIFIED_COOKIE}=true; path=/; max-age=${AGE_VERIFIED_COOKIE_MAX_AGE}; samesite=lax`;
    try {
      window.localStorage.setItem(AGE_VERIFIED_COOKIE, "true");
    } catch {
      // Ignore browsers or privacy modes that block storage access.
    }
    return;
  }

  document.cookie = `${AGE_VERIFIED_COOKIE}=; path=/; max-age=0; samesite=lax`;
  try {
    window.localStorage.removeItem(AGE_VERIFIED_COOKIE);
  } catch {
    // Ignore browsers or privacy modes that block storage access.
  }
}

function prefersReducedMotion() {
  try {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  } catch {
    return false;
  }
}

export default function AgeGate() {
  const [isOpen, setIsOpen] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const exitTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setHtmlVerified(false);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      const confirmButtonId = window.matchMedia("(min-width: 768px)").matches
        ? "abco-age-gate-confirm-desktop"
        : "abco-age-gate-confirm-mobile";

      (document.getElementById(confirmButtonId) as HTMLButtonElement | null)?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current !== null) {
        window.clearTimeout(exitTimeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) {
    return null;
  }

  function finishExit() {
    setHtmlVerified(true);
    setAgeVerifiedPersistence(rememberMe);
    setIsOpen(false);
    setIsExiting(false);
  }

  function handleConfirm() {
    if (prefersReducedMotion()) {
      finishExit();
      return;
    }

    setIsExiting(true);
    exitTimeoutRef.current = window.setTimeout(finishExit, EXIT_DURATION_MS);
  }

  function handleDecline() {
    window.location.assign("https://www.google.com");
  }

  return (
    <div
      className={[
        "abco-age-gate fixed inset-0 z-[9999] flex items-center justify-center p-6",
        "transition-opacity duration-700 ease-out motion-reduce:transition-none",
        isExiting ? "opacity-0" : "opacity-100",
      ].join(" ")}
    >
      <div className="absolute inset-0 bg-black/90" />

      <h2 id="abco-age-gate-title" className="sr-only">
        are you 21+?
      </h2>

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="abco-age-gate-title"
        className={[
          "relative w-full max-w-md overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-2xl md:max-w-5xl",
          "transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none",
          isExiting ? "translate-y-1 scale-[0.98] opacity-0" : "translate-y-0 scale-100 opacity-100",
        ].join(" ")}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="hidden min-h-[320px] md:flex">
          <div className="relative flex w-[42%] items-center justify-center overflow-hidden border-r border-black/10">
            <Image
              src="/tom_gate.jpg"
              alt="ABCo age gate background"
              fill
              priority
              sizes="42vw"
              className="object-cover brightness-110 contrast-105"
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/15" />
            <Image
              src="/main_logo_full.png"
              alt="ABCo"
              width={520}
              height={220}
              priority
              className="relative z-10 h-auto w-full max-w-[360px] invert"
            />
          </div>

          <div className="flex flex-1 items-center p-10">
            <div className="w-full max-w-2xl">
              <h2 className="text-4xl font-semibold tracking-tight text-black">
                Are you 21+?
              </h2>

              <div className="mt-8 flex w-full gap-3">
                <Button
                  type="button"
                  onClick={handleDecline}
                  className="flex-1 border border-black bg-white !px-4 !py-3 !text-base !leading-none !tracking-normal text-black shadow-none hover:bg-black hover:text-white hover:!translate-y-0"
                >
                  No
                </Button>
                <Button
                  id="abco-age-gate-confirm-desktop"
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 bg-black !px-4 !py-3 !text-base !leading-none !tracking-normal text-white shadow-none hover:opacity-95 hover:!translate-y-0"
                >
                  Yes
                </Button>
              </div>

              <label className="mt-4 flex select-none items-center justify-center gap-2 text-sm text-black/70">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-black/40 text-black focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                />
                Remember me
              </label>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:hidden">
          <div className="relative flex h-[220px] w-full items-center justify-center overflow-hidden">
            <Image
              src="/tom_gate.jpg"
              alt="ABCo age gate background"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center brightness-110 contrast-105"
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/15" />
            <Image
              src="/main_logo_full.png"
              alt="ABCo"
              width={420}
              height={180}
              priority
              className="relative z-10 h-auto w-[260px] invert sm:w-[290px]"
            />
          </div>

          <div className="flex flex-col items-center justify-center px-5 py-8">
            <div className="flex w-full max-w-md flex-col items-center text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
                Are you 21+?
              </h2>

              <div className="mt-8 flex w-full gap-3">
                <Button
                  type="button"
                  onClick={handleDecline}
                  className="flex-1 border border-black bg-white !px-4 !py-3 !text-base !leading-none !tracking-normal text-black shadow-none hover:bg-black hover:text-white hover:!translate-y-0"
                >
                  No
                </Button>
                <Button
                  id="abco-age-gate-confirm-mobile"
                  type="button"
                  onClick={handleConfirm}
                  className="flex-1 bg-black !px-4 !py-3 !text-base !leading-none !tracking-normal text-white shadow-none hover:opacity-95 hover:!translate-y-0"
                >
                  Yes
                </Button>
              </div>

              <label className="mt-4 flex select-none items-center justify-center gap-2 text-sm text-black/70">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-black/40 text-black focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                />
                Remember me
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
