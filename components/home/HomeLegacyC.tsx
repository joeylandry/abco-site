import Link from "next/link";

export default function HomeLegacyC() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="mx-auto inline-flex items-center justify-center rounded-full border border-black px-4 py-2 text-xs uppercase tracking-widest">
          ABCo
        </div>

        <h1 className="mt-6 text-4xl font-bold text-black sm:text-5xl">
          ABCo
        </h1>

        <p className="mt-5 text-lg text-gray-800">
          Legacy-style centered layout (simple, classic, responsive). We can make
          this mirror the current site feel more closely once you share the exact elements.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/beer"
            className="inline-flex items-center justify-center rounded-md bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90"
          >
            Our Beer
          </Link>
          <Link
            href="/visit"
            className="inline-flex items-center justify-center rounded-md border border-black px-5 py-3 text-sm font-semibold text-black hover:bg-black/5"
          >
            Visit
          </Link>
        </div>

        {/* simple “current site vibe” blocks */}
        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-black/10 p-5 text-left">
            <div className="text-sm font-semibold">Hours</div>
            <div className="mt-2 text-sm text-gray-700">Placeholder</div>
          </div>
          <div className="rounded-lg border border-black/10 p-5 text-left">
            <div className="text-sm font-semibold">Location</div>
            <div className="mt-2 text-sm text-gray-700">Placeholder</div>
          </div>
          <div className="rounded-lg border border-black/10 p-5 text-left">
            <div className="text-sm font-semibold">Latest Release</div>
            <div className="mt-2 text-sm text-gray-700">Placeholder</div>
          </div>
        </div>
      </div>
    </section>
  );
}
