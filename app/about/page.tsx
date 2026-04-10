import HomeMission from "@/components/home/HomeMission"
import TeamMemberCard from "@/components/about/TeamMemberCard"
import TeamMemberCardMobile from "@/components/about/TeamMemberCardMobile"
import AboutHeader from "@/components/page-headers/AboutHeader"
import { teamMembers } from "@/app/about/teamMembers"
import type { Metadata } from "next"

const docuseriesEpisodes = [
  {
    title: "Episode 1 - The Founders",
    description:
      "An introduction to the founders of Arlington Brewing Company and the motivations behind the project.",
    embedUrl: "https://www.youtube.com/embed/o9B3EcZpNYM",
    videoUrl: "https://www.youtube.com/watch?v=o9B3EcZpNYM",
  },
  {
    title: "Episode 2 - The Res",
    description:
      "The founders search in vain for a taproom space, and find an unexpected opportunity.",
    embedUrl: "https://www.youtube.com/embed/oce98rBznTM?start=1",
    videoUrl: "https://www.youtube.com/watch?v=oce98rBznTM&t=1s",
  },
  {
    title: "Episode 3 - Pivot #2",
    description:
      "Tom and Matt react to an evolving commercial and partnership landscape.",
    embedUrl: "https://www.youtube.com/embed/scBL8DZ9y0g",
    videoUrl: "https://www.youtube.com/watch?v=scBL8DZ9y0g",
  },
  {
    title: "Episode 4 - The site",
    description:
      "The future site of the brewery and taproom takes center stage as the team prepares for approval to move forward.",
    embedUrl: "https://www.youtube.com/embed/8wE8KXVo964",
    videoUrl: "https://www.youtube.com/watch?v=8wE8KXVo964",
  },
] as const

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about ABCo and what drives our brewery.",
}

export default function AboutPage() {
  return (
    <>
      <div id="about-top">
        <AboutHeader />
        <HomeMission />
      </div>

      <section className="border-t border-black/10 bg-background">
        <div className="mx-auto max-w-6xl px-6 pb-14 pt-4 sm:pb-16 sm:pt-6">
          <div className="mb-10 text-center">
            <p className="text-lg font-semibold uppercase tracking-[0.28em] text-black/50 sm:text-xl md:text-2xl">
              Our Team
            </p>
          </div>

          <div className="grid gap-x-8 gap-y-10 md:hidden">
            {teamMembers.map((member) => (
              <TeamMemberCardMobile key={member.id} member={member} />
            ))}
          </div>

          <div className="hidden gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 md:grid">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-background py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-lg font-semibold uppercase tracking-[0.28em] text-black/50 sm:text-xl md:text-2xl">
              What Goes Into That Pint Glass?
            </p>
            <p className="mt-4 font-heading text-xl leading-tight text-black sm:text-2xl md:text-3xl">
              Follow along the journey of building the brewery with a docuseries
              by local film maker Andy Takats.
            </p>
            <p className="mt-3 text-base leading-7 text-black/70 sm:text-lg">
              New episodes monthly.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {docuseriesEpisodes.map((episode) => (
              <article
                key={episode.videoUrl}
                className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
              >
                <div className="aspect-video w-full bg-black">
                  <iframe
                    className="h-full w-full"
                    src={episode.embedUrl}
                    title={episode.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>

                <div className="px-6 py-5">
                  <h2 className="font-heading text-2xl leading-tight text-black">
                    {episode.title}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-black/70">
                    {episode.description}
                  </p>
                  <a
                    href={episode.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:opacity-65"
                  >
                    Watch on YouTube
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
