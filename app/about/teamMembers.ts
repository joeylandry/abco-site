export type TeamMember = {
  id: string
  name: string
  title: string
  shortTitle: string
  imageSrc: string
  bio: string[]
  initials: string
  accentClassName: string
  href: string
}

export const teamMembers: TeamMember[] = [
  {
    id: "tom-allen",
    name: "Tom Allen",
    title: "Founder, Head Brewer",
    shortTitle: "Founder",
    imageSrc: "/team/tom_headshot.png",
    initials: "TA",
    accentClassName: "from-[#FFA489]/60 via-white to-[#74C3D5]/45",
    href: "/about/team/tom-allen",
    bio: [
      "Tom Allen is the founder and head brewer of Arlington Brewing Company, bringing together his passion for great beer and a career built on innovation and hands-on leadership. Before starting ABCo in 2021, Tom spent nearly two decades leading engineering teams at world-class technology companies including Boston Dynamics, Bevi, and Markforged, designing everything from robots to 3D printers to beverage systems.",
      "At Arlington Brewing, Tom channels that same creative energy into crafting distinctive, high-quality beers that bring people together. Since launching, he’s developed more than 30 unique recipes, including Spy-P-A, Arlington’s best-selling craft beer, and helped build a strong local following through pop-ups, beer gardens, and community events.",
      "When he’s not brewing or planning the next event, Tom enjoys spending time outdoors with his family or working on the occasional side project.",
    ],
  },
  {
    id: "peter-caradonna",
    name: "Peter Caradonna",
    title: "Director of Finance",
    shortTitle: "Finance",
    imageSrc: "/team/peter_headshot.png",
    initials: "PC",
    accentClassName: "from-[#74C3D5]/55 via-white to-[#A9C27F]/55",
    href: "/about/team/peter-caradonna",
    bio: [
      "Peter Caradonna is the Director of Finance at Arlington Brewing Company, bringing decades of experience in finance, strategic planning, and business operations. Before joining ABCo full-time, Peter held leadership roles at companies including Brown & Brown, Dentsply Sirona, and several technology startups, where he led financial planning, analysis, and reporting across multiple business units.",
      "Peter was the first person to join Arlington Brewing outside of the founding team, reaching out with enthusiasm when the brewery was just an idea and volunteering to help in any way, starting by pouring beers at early events. Today, he oversees the brewery’s financial operations, helping ABCo grow sustainably while deepening its connection to the local community.",
      "Outside of work, Peter enjoys spending time with family and singing.",
    ],
  },
  {
    id: "brendan-mclane",
    name: "Brendan McLane",
    title: "Director of Sales",
    shortTitle: "Sales",
    imageSrc: "/team/brendan_headshot.png",
    initials: "BM",
    accentClassName: "from-[#FFC658]/70 via-white to-[#FFA489]/50",
    href: "/about/team/brendan-mclane",
    bio: [
      "Brendan McLane is a seasoned sales leader with more than 15 years of experience growing and scaling beverage brands. He has led teams and driven growth at some of the country’s most respected breweries, including Stone Brewing, Oskar Blues, and most recently, Lord Hobo Brewing.",
      "Throughout his career, Brendan has built and coached high-performing sales teams, developed expansion strategies, and partnered closely with distributors and retailers to bring new products to market and strengthen brand presence across regions. His passion for craft beer and deep industry knowledge make him a perfect fit to lead Arlington Brewing Company’s sales efforts as the brewery continues to grow.",
      "Outside the brewery, Brendan is an avid mountain biker, snowboarder, and golfer. He loves traveling with his wife, their daughter, and their dog, Finn, often exploring new breweries and local food scenes along the way.",
    ],
  },
]

export function getTeamMemberById(id: string) {
  return teamMembers.find((member) => member.id === id)
}

export function getRelatedTeamMembers(id: string, limit = 2) {
  return teamMembers.filter((member) => member.id !== id).slice(0, limit)
}
