import Image from "next/image";
import Button from "@/components/ui/Button";

export default function HomeHeroMobile() {
  return (
    <section className="md:hidden relative w-full overflow-hidden bg-[#0f172a]">
      <div className="relative h-[74svh] min-h-[520px] w-full overflow-hidden">
        <Image
          src="/home-hero2.jpg"
          alt="ABCo hero background"
          fill
          priority
          className="object-cover object-center brightness-110 contrast-105"
        />

        <div className="absolute inset-0 bg-black/28" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" />

        <div className="absolute inset-0 z-10 flex items-center justify-center px-5">
          <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
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
