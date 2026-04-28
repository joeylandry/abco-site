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

export const metadata: Metadata = {
  title: "Home",
  description: "Craft beer and community at ABCo.",
};

export default function HomePage() {
  return (
    <>
      <HomeHeroBMobile />
      <div className="hidden md:block">
        <HomeHeroB />
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
