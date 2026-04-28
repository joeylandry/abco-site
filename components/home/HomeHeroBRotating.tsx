"use client";

import Image from "next/image";
import Link from "next/link";
import { useCrossfadeCarousel } from "@/components/home/useCrossfadeCarousel";

const rotatingHeroImages = ["/hero/hero-1.jpg", "/hero/hero-2.jpg", "/hero/hero-3.jpg"];

export default function HomeHeroBRotating() {
  const { activeIndex, incomingIndex, incomingVisible } = useCrossfadeCarousel(rotatingHeroImages);

  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={rotatingHeroImages[activeIndex]}
          alt="ABCo hero"
          fill
          priority
          className="object-cover opacity-100 scale-100"
        />

        {incomingIndex !== null ? (
          <Image
            src={rotatingHeroImages[incomingIndex]}
            alt="ABCo hero"
            fill
            className={`object-cover transition-[opacity,transform] duration-1000 ease-in-out motion-reduce:transition-none ${
              incomingVisible ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"
            }`}
          />
        ) : null}
      </div>

      <div className="absolute inset-0 bg-black/55" />

      <div className="relative mx-auto flex min-h-[70vh] max-w-6xl items-center px-4 py-16">
        <div className="max-w-2xl text-white">
          <div className="text-sm tracking-widest uppercase text-white/80">
            ABCo
          </div>

          <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
            Taproom nights, release days, and everything in between.
          </h1>

          <p className="mt-5 text-lg text-white/90">
            Rotation is slow/subtle. Images are easy to swap in /public/hero.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
            >
              View Events
            </Link>

            <Link
              href="/visit"
              className="inline-flex items-center justify-center rounded-md border border-white/70 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Plan Your Visit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
