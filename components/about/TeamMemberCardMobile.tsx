import Image from "next/image"
import Link from "next/link"
import type { TeamMember } from "@/app/about/teamMembers"

export default function TeamMemberCardMobile({
  member,
}: {
  member: TeamMember
}) {
  return (
    <Link
      href={member.href}
      className="group block"
      aria-label={`View bio for ${member.name}`}
    >
      <article className="flex flex-col items-center text-center">
        <div className="relative h-[min(72vw,15rem)] w-[min(72vw,15rem)] overflow-hidden rounded-full border border-black/10 bg-surface shadow-sm transition-transform duration-200 group-hover:scale-[1.02] sm:h-56 sm:w-56">
          <Image
            src={member.imageSrc}
            alt={member.name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 240px, 224px"
          />
        </div>

        <div className="pt-4">
          <h3 className="font-heading text-2xl leading-tight text-foreground">
            {member.name}
          </h3>
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-foreground/65">
            {member.title}
          </p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/35 transition group-hover:text-foreground/55">
            Click for more details
          </p>
        </div>
      </article>
    </Link>
  )
}
