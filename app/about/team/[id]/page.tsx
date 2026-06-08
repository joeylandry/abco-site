import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import HomeMobileBeerTeaser from "@/components/home/HomeMobileBeerTeaser"
import {
  MobileCalendarGridCard,
} from "@/components/events/mobile/MobileEventWidgets"
import {
  getTeamMemberById,
  teamMembers,
} from "@/app/about/teamMembers"
import { getEventsSnapshot } from "@/lib/events"
import { truncateToEvenLength } from "@/lib/truncateToEvenLength"

type TeamMemberDetailPageProps = {
  params: Promise<{
    id: string
  }>
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current stroke-[1.8]"
    >
      <path d="M5 12h13" />
      <path d="M13 6l5 6-5 6" />
    </svg>
  )
}

export async function generateStaticParams() {
  return teamMembers.map((member) => ({
    id: member.id,
  }))
}

export async function generateMetadata({
  params,
}: TeamMemberDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const member = getTeamMemberById(id)

  if (!member) {
    return {
      title: "Team Member Not Found",
    }
  }

  return {
    title: member.name,
    description: `${member.name}, ${member.title} at ABCo.`,
  }
}

export const dynamic = "force-dynamic"

export default async function TeamMemberDetailPage({
  params,
}: TeamMemberDetailPageProps) {
  const { id } = await params
  const member = getTeamMemberById(id)

  if (!member) {
    notFound()
  }

  const { upcomingEvents } = await getEventsSnapshot()
  const upcomingAboutEvents = truncateToEvenLength(upcomingEvents.slice(0, 8))

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden md:hidden">
        <div className="relative mx-auto max-w-3xl px-4 py-4 pb-8">
          <div className="space-y-6">
            <div className="space-y-3 text-center">
              <h1 className="font-heading text-[clamp(2.4rem,11vw,3.6rem)] leading-[0.9] tracking-[-0.08em] text-black">
                {member.name}
              </h1>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-black/55">
                {member.title}
              </p>
            </div>

            <div className="mx-auto max-w-[42rem] space-y-4 text-left text-[1rem] leading-7 text-black/85">
              {member.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className={`relative mx-auto aspect-[3/4] w-full overflow-hidden bg-gradient-to-br ${member.accentClassName}`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_36%)]" />
              <Image
                src={member.imageSrc}
                alt={member.name}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-black/6 to-white/10" />
            </div>

            <div className="flex justify-center">
              <Link
                href="/about#about-top"
                className="inline-flex items-center gap-2 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-black/80 transition hover:text-black"
              >
                <span>Back to About Us</span>
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 md:hidden">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-4 border-b border-black/10 pb-4">
            <h2 className="max-w-[8.5ch] font-heading text-[clamp(3rem,16vw,6rem)] uppercase leading-[0.84] tracking-[-0.08em] text-balance text-black">
              UPCOMING EVENTS
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {upcomingAboutEvents.map((upcomingEvent, index) => (
              <MobileCalendarGridCard
                key={upcomingEvent.id}
                event={upcomingEvent}
                accentIndex={index}
              />
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-[0.76rem] font-semibold uppercase tracking-[0.2em] text-black/80 transition hover:text-black"
            >
              <span>VIEW ALL EVENTS</span>
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <HomeMobileBeerTeaser />

      <section className="relative hidden overflow-hidden md:block">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,164,137,0.22),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(116,195,213,0.14),transparent_30%)]" />

        <div className="relative mx-auto max-w-6xl px-6 py-8 lg:py-10">
          <div className="mb-4">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-base font-semibold text-black/70 transition hover:text-black"
            >
              <span aria-hidden="true">&larr;</span>
              Back to about
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:items-stretch lg:gap-8">
            <div className="flex h-full flex-col">
              <div className={`relative h-full overflow-hidden rounded-[32px] border border-black/10 bg-gradient-to-br ${member.accentClassName} shadow-sm`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.55),transparent_36%)]" />
                <Image
                  src={member.imageSrc}
                  alt={member.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/8 to-white/10" />
                <div className="relative min-h-[420px] sm:min-h-[500px] lg:h-full lg:min-h-0" />
              </div>
            </div>

            <div className="flex h-full flex-col border border-black/10 bg-surface p-6 shadow-sm lg:p-7">
              <div className="flex w-full flex-1 flex-col">
                <h2 className="mt-3 text-center font-heading text-3xl leading-none md:text-4xl">
                  {member.name}
                </h2>
                <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-black/65 md:text-sm">
                  {member.title}
                </p>

                <div className="mt-6 space-y-5 border-t border-black/10 pt-6 text-base leading-relaxed text-black/85">
                  {member.bio.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-auto flex justify-center border-t border-black/10 pt-5">
                  <Link
                    href="/book-an-event"
                    className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-black/85"
                  >
                    Book an event
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
