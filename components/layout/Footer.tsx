"use client";

import Image from "next/image";
import Link from "next/link";

type Rgb = { r: number; g: number; b: number };

const BRAND_BLUE = "#74C3D5";
const FOOTER_TINT_BASE = "#fbf6ef";

function hexToRgb(hex: string): Rgb | null {
  const normalized = hex.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return null;
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function clampChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function rgbToHex({ r, g, b }: Rgb) {
  return `#${[r, g, b]
    .map((channel) => clampChannel(channel).toString(16).padStart(2, "0"))
    .join("")}`;
}

function mixHex(baseHex: string, targetHex: string, weight: number) {
  const base = hexToRgb(baseHex);
  const target = hexToRgb(targetHex);
  if (!base || !target) {
    return targetHex;
  }

  const mixChannel = (baseChannel: number, targetChannel: number) =>
    baseChannel + (targetChannel - baseChannel) * weight;

  return rgbToHex({
    r: mixChannel(base.r, target.r),
    g: mixChannel(base.g, target.g),
    b: mixChannel(base.b, target.b),
  });
}

function hexToRgba(hex: string, alpha: number) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return `rgba(0, 0, 0, ${alpha})`;
  }
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export default function Footer() {
  const year = new Date().getFullYear();
  const addressLine1 = "15 Ryder St";
  const addressLine2 = "Arlington, MA 02476";
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=15+Ryder+St+Arlington+MA+02476";
  const instagramUrl = "https://www.instagram.com/ArlingtonBrewingCompany/";
  const facebookUrl = "https://www.facebook.com/ArlingtonBrewingCompany";
  const xUrl = "https://x.com";
  const accent = BRAND_BLUE;

  const footerBaseColor = mixHex(accent, FOOTER_TINT_BASE, 0.88);
  const footerBackdrop = [
    `radial-gradient(circle at top left, ${hexToRgba(accent, 0.24)} 0%, transparent 36%)`,
    `radial-gradient(circle at bottom right, ${hexToRgba(accent, 0.18)} 0%, transparent 38%)`,
    `linear-gradient(180deg, ${hexToRgba(accent, 0.08)} 0%, transparent 52%)`,
  ].join(", ");

  return (
    <footer
      className="relative overflow-hidden border-t border-black/10 text-black"
      style={{ backgroundColor: footerBaseColor }}
    >
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{ backgroundImage: footerBackdrop }}
      />
      <div className="relative mx-auto max-w-7xl px-5 pt-6 pb-4 sm:px-6 md:pt-8">
        <div className="grid grid-cols-2 gap-x-5 gap-y-5 sm:gap-6 lg:grid-cols-5 lg:gap-12">
          {/* Logo + Brand */}
          <div className="col-span-2 space-y-3 lg:col-span-1">
            <Link href="/" aria-label="Arlington Brewing Company homepage" className="inline-block">
              <Image
                src="/monogram_logo.png"
                alt="Arlington Brewing Company Monogram"
                width={70}
                height={70}
                className="h-auto w-auto opacity-90"
              />
            </Link>
            <div className="space-y-1.5 text-sm leading-6 text-black/80">
              <address className="not-italic leading-relaxed">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="transition hover:text-black"
                >
                  {addressLine1}
                  <br />
                  {addressLine2}
                </a>
              </address>
              <p>Phone coming soon</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-2 text-sm">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-black">
              Explore
            </h2>
            <nav aria-label="Footer explore links" className="flex flex-col gap-1.5 text-black/80">
              <Link href="/about" className="transition hover:text-black">
                About Us
              </Link>
              <Link href="/beer" className="transition hover:text-black">
                Our Beer
              </Link>
              <Link href="/beer-finder" className="transition hover:text-black">
                Beer Finder
              </Link>
              <Link href="/jobs" className="transition hover:text-black">
                Jobs
              </Link>
            </nav>
          </div>

          {/* Visit Us */}
          <div className="space-y-2 text-sm">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-black">
              <Link href="/visit" className="transition hover:text-black">
                Visit Us
              </Link>
            </h2>
            <nav aria-label="Footer visit links" className="flex flex-col gap-1.5 text-black/80">
              <Link href="/events" className="transition hover:text-black">
                Events
              </Link>
              <Link href="/book-an-event" className="transition hover:text-black">
                Book an Event
              </Link>
              <Link href="/contact" className="transition hover:text-black">
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Hours */}
          <div className="space-y-2 text-sm">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-black">Hours</h2>
            <div className="text-black/80">
              <p>Opening in 2026</p>
              <p>Taproom hours coming soon</p>
            </div>
          </div>

          {/* Social */}
          <div className="space-y-2 text-sm">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-black">
              Connect
            </h2>
            <nav aria-label="Footer connect links" className="flex flex-col gap-1.5 text-black/80">
              <a
                href={instagramUrl}
                className="transition hover:text-black"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
              <a
                href={facebookUrl}
                className="transition hover:text-black"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
              <a
                href={xUrl}
                className="transition hover:text-black"
                target="_blank"
                rel="noreferrer"
              >
                X
              </a>
            </nav>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-5 flex flex-col gap-1 border-t border-black/10 pt-4 text-xs text-black/80 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
          <p>© {year} Arlington Brewing Company</p>
          <p>Drink responsibly.</p>
        </div>
      </div>
    </footer>
  );
}
