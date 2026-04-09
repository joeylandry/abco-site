"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { useCrossfadeCarousel } from "@/components/home/useCrossfadeCarousel";

const desktopHeroImages = [
  "/homeHero/2025.08.30_ABCBeerGarden-0026.jpg",
  "/homeHero/2025.08.30_ABCBeerGarden-0005.jpg",
  "/homeHero/2025.08.30_ABCBeerGarden-0133.jpg",
  "/homeHero/2025.08.30_ABCBeerGarden-0174.jpg",
  "/homeHero/2025.08.30_ABCBeerGarden-0253.jpg",
  "/homeHero/2025.08.30_ABCBeerGarden-0309.jpg",
  "/homeHero/2025.08.30_ABCBeerGarden-0387.jpg",
  "/homeHero/2025.08.30_ABCBeerGarden-0483.jpg",
  "/homeHero/2025.08.30_ABCBeerGarden-0608.jpg",
  "/homeHero/2025.08.30_ABCBeerGarden-0672.jpg",
  "/homeHero/2025.08.30_ABCBeerGarden-0687.jpg",
];

export default function HomeHeroB() {
  const { activeIndex } = useCrossfadeCarousel(desktopHeroImages, { fadeMs: 0 });

  return (
    <section className="relative min-h-[calc(100vh-72px)] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={desktopHeroImages[activeIndex]}
          alt="ABCo hero background"
          fill
          priority
          sizes="100vw"
          className="object-cover brightness-110 contrast-105"
        />
      </div>

      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/12 to-black/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_44%)]" />

      <div className="relative z-10 flex min-h-[calc(100vh-72px)] items-center justify-center px-6">
        <div className="relative flex max-w-3xl flex-col items-center text-center">
          <Image
            src="/main_logo_full.png"
            alt="ABCo"
            width={520}
            height={220}
            priority
            className="h-auto w-[210px] -mb-2 invert sm:w-[290px] sm:-mb-4 md:w-[350px] md:-mb-6"
          />

          <h1 className="mt-12 text-2xl font-sans font-semibold tracking-wide text-white sm:mt-14 sm:text-3xl md:mt-16 md:text-4xl">
            GREAT COMMUNITY
            <br />
            DESERVES GREAT BEER
          </h1>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/beer" variant="primary" className="bg-white text-foreground">
              Explore Beers
            </Button>

            <Button
              href="/visit"
              variant="secondary"
              className="border-white text-white hover:bg-white hover:text-foreground"
            >
              Visit Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
