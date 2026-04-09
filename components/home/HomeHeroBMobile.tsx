"use client";

import Image from "next/image";
import { useCrossfadeCarousel } from "@/components/home/useCrossfadeCarousel";
import Button from "@/components/ui/Button";

const mobileHeroImages = [
  "/homeHero/mobile/1.jpg",
  "/homeHero/mobile/2.jpg",
  "/homeHero/mobile/3.jpg",
  "/homeHero/mobile/4.jpg",
  "/homeHero/mobile/5.jpg",
  "/homeHero/mobile/6.jpg",
  "/homeHero/mobile/7.jpg",
  "/homeHero/mobile/8.jpg",
  "/homeHero/mobile/9.jpg",
];

function getMobileHeroImageClass(index: number) {
  const position = index === 8 ? "object-[68%_center]" : "object-center";

  return `object-cover ${position}`;
}

export default function HomeHeroBMobile() {
  const { activeIndex, incomingIndex, incomingVisible } = useCrossfadeCarousel(mobileHeroImages, {
    intervalMs: 10000,
    fadeMs: 1200,
  });

  return (
    <section className="md:hidden relative w-full overflow-hidden bg-[#0f172a]">
      <div className="relative h-[74svh] min-h-[520px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            key={`mobile-hero-active-${activeIndex}`}
            src={mobileHeroImages[activeIndex]}
            alt="ABCo hero background"
            fill
            priority
            sizes="100vw"
            className={`transition-opacity duration-[1200ms] ease-in-out motion-reduce:transition-none ${getMobileHeroImageClass(
              activeIndex
            )} ${incomingIndex !== null && incomingVisible ? "opacity-0" : "opacity-100"}`}
          />

          {incomingIndex !== null ? (
            <Image
              key={`mobile-hero-incoming-${incomingIndex}`}
              src={mobileHeroImages[incomingIndex]}
              alt="ABCo hero background"
              fill
              sizes="100vw"
              className={`transition-opacity duration-[1200ms] ease-in-out motion-reduce:transition-none ${getMobileHeroImageClass(
                incomingIndex
              )} ${incomingVisible ? "opacity-100" : "opacity-0"}`}
            />
          ) : null}
        </div>

        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/12 to-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_44%)]" />

        <div className="absolute inset-0 z-10 flex items-center justify-center px-5">
          <div className="relative mx-auto flex w-full max-w-md flex-col items-center text-center">
            <Image
              src="/main_logo_full.png"
              alt="ABCo"
              width={420}
              height={180}
              priority
              className="h-auto w-[255px] invert sm:w-[275px]"
            />

            <div className="mt-5 flex w-full gap-3">
              <Button
                href="/beer"
                variant="primary"
                className="flex-1 bg-white !px-4 !py-3 !text-base !leading-none !tracking-normal text-foreground shadow-none hover:opacity-95"
              >
                Explore Beers
              </Button>

              <Button
                href="/visit"
                variant="secondary"
                className="flex-1 border-white !px-4 !py-3 !text-base !leading-none !tracking-normal text-white hover:bg-white hover:text-foreground"
              >
                Visit Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
