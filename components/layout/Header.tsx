import Image from "next/image";
import Link from "next/link";
import MobileHeader from "@/components/layout/MobileHeader";
import SecondaryMenu from "@/components/layout/SecondaryMenu";
import { PRIMARY_NAV_ITEMS } from "@/config/nav";

export default function Header() {
  return (
    <>
      <MobileHeader />
      <header className="fixed inset-x-0 top-0 z-50 hidden w-full border-b border-black/10 bg-white/65 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-white/50 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-0.5">
          <Link href="/" className="flex shrink-0 items-center self-center leading-none">
            <Image
              src="/wide_logo.png"
              alt="ABCo"
              width={300}
              height={100}
              className="block h-[4.5rem] w-auto"
              priority
            />
            <span className="sr-only">ABCo</span>
          </Link>

          <div className="hidden min-w-max flex-col items-end justify-center self-center md:flex">
            <SecondaryMenu />
            <div className="w-full py-[0.375rem]">
              <div className="h-px w-full bg-neutral-700" />
            </div>
            <nav aria-label="Primary" className="flex gap-6">
              {PRIMARY_NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-neutral-700 transition hover:text-neutral-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
