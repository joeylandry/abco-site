import Link from "next/link";
import { SECONDARY_NAV_ITEMS } from "@/config/nav";

export default function SecondaryMenu() {
  return (
    <div className="flex items-center gap-5">
      {SECONDARY_NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="relative top-px text-sm font-medium text-neutral-700 transition hover:text-neutral-900"
        >
          {item.label}
        </Link>
      ))}

      <div className="flex items-center gap-1">
        <a
          href="https://www.instagram.com/ArlingtonBrewingCompany/"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="relative top-px text-neutral-700 transition hover:text-neutral-900"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="16.9" cy="7.1" r="0.9" fill="currentColor" stroke="none" />
          </svg>
        </a>

        <a
          href="https://www.facebook.com/ArlingtonBrewingCompany"
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
          className="relative top-px text-neutral-700 transition hover:text-neutral-900"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="currentColor"
          >
            <path d="M13.5 21v-7.1h2.4l.36-2.8H13.5V9.32c0-.82.22-1.38 1.4-1.38h1.5V5.44c-.26-.04-1.16-.11-2.2-.11-2.18 0-3.67 1.33-3.67 3.77v2.01H8v2.8h2.53V21h2.97Z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
