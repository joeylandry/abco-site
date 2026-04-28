import Image from "next/image"
import Button from "@/components/ui/Button"
import { getHomeDesktopAnnouncement } from "@/lib/homeAnnouncements"

function addExcitement(value: string) {
  const trimmed = value.trimEnd()
  return trimmed.endsWith("!") ? trimmed : `${trimmed}!`
}

function DesktopAnnouncementCard({
  headline,
  subtitle,
  ctaLabel,
  ctaHref,
  imageUrl,
  imageAlt,
}: Awaited<ReturnType<typeof getHomeDesktopAnnouncement>>[number]) {
  const displayHeadline = addExcitement(headline)
  const displaySubtitle = addExcitement(subtitle)

  return (
    <article className="relative isolate overflow-hidden rounded-[2rem] border border-black/15 bg-white shadow-sm">
      <div className="relative min-h-[clamp(320px,42vw,460px)] w-full">
        <Image
          src={imageUrl ?? "/home_announcment.jpg"}
          alt={imageAlt ?? headline}
          fill
          sizes="(min-width: 768px) 100vw, 100vw"
          className="origin-center object-cover object-[54%_58%] brightness-[0.85] contrast-105"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/66 via-black/34 to-black/12" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_40%)]" />

        <div className="relative z-10 flex min-h-[clamp(320px,42vw,460px)] flex-col justify-start px-5 py-6 text-left text-white sm:px-6 sm:py-7 md:px-8 md:py-9">
          <div className="flex w-full max-w-[24rem] flex-col">
            <h2 className="mt-1 flex h-[3rem] w-full items-center text-[clamp(1.85rem,7vw,2.55rem)] font-bold leading-none tracking-tight text-balance text-white">
              {displayHeadline}
            </h2>
            <p className="mt-4 text-[clamp(1.05rem,1.35vw,1.35rem)] font-medium leading-relaxed text-white sm:text-base">
              {displaySubtitle}
            </p>
          </div>

          <div className="mt-5">
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

export default async function HomeDesktopAnnouncement() {
  const announcements = await getHomeDesktopAnnouncement()

  if (announcements.length === 0) {
    return null
  }

  return (
    <section className="hidden bg-background py-12 md:block">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4">
          {announcements.map((announcement) => (
            <DesktopAnnouncementCard key={announcement._id} {...announcement} />
          ))}
        </div>
      </div>
    </section>
  )
}
