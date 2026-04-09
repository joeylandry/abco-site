import Image from "next/image";
import Button from "@/components/ui/Button";

export default function HomeHeroA() {
  return (
    <section className="relative min-h-[calc(100vh-72px)] w-full overflow-hidden">
      <Image
        src="/home-hero2.jpg"
        alt="ABCo hero background"
        fill
        priority
        className="object-cover brightness-110 contrast-105"
      />

      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10" />

      <div className="relative z-10 flex min-h-[calc(100vh-72px)] items-center justify-center px-6">
        <div className="flex max-w-3xl flex-col items-center text-center">
          <Image
            src="/main_logo_full.png"
            alt="ABCo"
            width={520}
            height={220}
            priority
            className="h-auto w-[210px] -mb-2 sm:w-[290px] sm:-mb-4 md:w-[350px] md:-mb-6 invert"
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
