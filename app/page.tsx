import HomeHeroB from "@/components/home/HomeHeroB";
import HomeHeroBMobile from "@/components/home/HomeHeroBMobile";
import HomeMobileAnnouncements from "@/components/home/HomeMobileAnnouncements";
import HomeMobileBeerFinder from "@/components/home/HomeMobileBeerFinder";
import HomeMobileNextEvent from "@/components/home/HomeMobileNextEvent";
import HomeMobileBeerTeaser from "@/components/home/HomeMobileBeerTeaser";
import HomeNextEvent from "@/components/home/HomeNextEvent";
import HomeFeaturedBeers from "@/components/home/HomeFeaturedBeers";
import type { Metadata } from "next";
import HomeDesktopAnnouncement from "@/components/home/HomeDesktopAnnouncement";
import { getHomeHeroImages } from "@/lib/homeHeroImages";

export const metadata: Metadata = {
  title: "Home",
  description: "Craft beer and community at ABCo.",
};

const homeHeroImages = getHomeHeroImages();

export default function HomePage() {
  return (
    <>
      <HomeHeroBMobile images={homeHeroImages} />
      <div className="hidden md:block">
        <HomeHeroB images={homeHeroImages} />
      </div>
      <HomeDesktopAnnouncement />
      <HomeMobileAnnouncements />
      <HomeMobileBeerFinder />
      <HomeMobileNextEvent />
      <HomeMobileBeerTeaser />
      <HomeNextEvent />
      <div className="hidden md:block">
        <HomeFeaturedBeers />
      </div>
    </>
  );
}
