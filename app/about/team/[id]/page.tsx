import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import TeamMemberCard from "@/components/about/TeamMemberCard"
import EventPreviewCard from "@/components/events/EventPreviewCard"
import { upcomingEvents } from "@/app/events/mockEvents"
import {
  getRelatedTeamMembers,
  getTeamMemberById,
  teamMembers,
} from "@/app/about/teamMembers"

type TeamMemberDetailPageProps = {
  params: Promise<{
    id: string
  }>
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

export default async function TeamMemberDetailPage({
  params,
}: TeamMemberDetailPageProps) {
  const { id } = await params
  const member = getTeamMemberById(id)

  if (!member) {
    notFound()
  }

  const relatedMembers = getRelatedTeamMembers(member.id, 2)
  const relatedUpcomingEvents = upcomingEvents.slice(0, 8)

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden">
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

      <section className="border-t border-black/10 bg-white/50 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
                More To Explore
              </p>
              <h2 className="mt-2 font-heading text-3xl leading-tight">You may also like</h2>
            </div>
            <Link href="/about" className="text-sm font-semibold text-black/70 transition hover:text-black">
              View full team
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {relatedMembers.map((relatedMember) => (
              <TeamMemberCard key={relatedMember.id} member={relatedMember} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-background py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/50">
                More At ABCo
              </p>
              <h2 className="mt-2 font-heading text-3xl leading-tight">Upcoming Events</h2>
            </div>
            <Link href="/events" className="text-sm font-semibold text-black/70 transition hover:text-black">
              View all events
            </Link>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4">
            {relatedUpcomingEvents.map((event, index) => (
              <div key={event.id} className="min-w-[280px] max-w-[280px] flex-none">
                <EventPreviewCard event={event} accentIndex={index} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
