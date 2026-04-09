import Image from "next/image"
import Link from "next/link"
import MobileMenu from "@/components/layout/MobileMenu"

export default function MobileHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-[4.75rem] w-full border-b border-black/10 bg-white shadow-sm md:hidden">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center px-4">
        <Link
          href="/"
          aria-label="ABCo homepage"
          className="relative z-10 flex h-full min-w-0 flex-1 items-center py-1.5 pr-3 leading-none"
          style={{ touchAction: "manipulation" }}
        >
          <Image
            src="/wide_logo.png"
            alt="ABCo"
            width={240}
            height={80}
            className="block h-[3.25rem] w-auto max-w-full"
            priority
          />
          <span className="sr-only">ABCo</span>
        </Link>

        <div className="ml-auto flex items-center">
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
