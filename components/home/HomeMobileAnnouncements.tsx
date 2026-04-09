import Image from "next/image"
import Button from "@/components/ui/Button"
import { getHomeMobileAnnouncements } from "@/lib/homeAnnouncements"

function addExcitement(value: string) {
  const trimmed = value.trimEnd()
  return trimmed.endsWith("!") ? trimmed : `${trimmed}!`
}

function MobileAnnouncementCard({
  headline,
  subtitle,
  ctaLabel,
  ctaHref,
  imageUrl,
  imageAlt,
}: Awaited<ReturnType<typeof getHomeMobileAnnouncements>>[number]) {
  const displayHeadline = addExcitement(headline)
  const displaySubtitle = addExcitement(subtitle)

  return (
    <article className="relative isolate mx-auto w-full overflow-hidden rounded-[2rem] bg-black shadow-[0_24px_60px_-36px_rgba(0,0,0,0.65)]">
      <div className="relative min-h-[clamp(500px,132vw,690px)] w-full">
        <Image
          src={imageUrl ?? "/home_announcment.jpg"}
          alt={imageAlt ?? headline}
          fill
          sizes="(max-width: 767px) 100vw, 0px"
          className="object-cover object-[54%_46%] brightness-[0.78] contrast-105"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/66 via-black/1 to-black/0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_44%)]" />

        <div className="relative z-10 flex min-h-[clamp(500px,132vw,690px)] flex-col px-5 py-5 text-left text-white">
          <div className="flex flex-col items-start justify-start pt-3">
            <p className="font-heading text-[clamp(2rem,7.8vw,2.7rem)] leading-none tracking-tight whitespace-nowrap text-white">
              {displayHeadline}
            </p>
            <p className="mt-3 w-full text-[0.95rem] leading-relaxed text-white/92 sm:text-base">
              {displaySubtitle}
            </p>
          </div>

          <div className="pt-3">
            <Button
              href={ctaHref}
              variant="primary"
              className="self-start border border-white !bg-white/10 !px-6 !py-3 text-[0.82rem] uppercase tracking-[0.18em] !text-white !shadow-none hover:!bg-white hover:!text-foreground hover:!opacity-100 hover:!translate-y-0"
            >
              {ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default async function HomeMobileAnnouncements() {
  const announcements = await getHomeMobileAnnouncements()

  if (announcements.length === 0) {
    return null
  }

  return (
    <section className="bg-background pt-8 pb-4 md:hidden">
      <div className="w-full px-3">
        <div className="flex flex-col gap-4">
          {announcements.map((announcement) => (
            <MobileAnnouncementCard key={announcement._id} {...announcement} />
          ))}
        </div>
      </div>
    </section>
  )
}
