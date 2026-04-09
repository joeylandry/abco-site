import JobsPageContent from "@/components/jobs/JobsPageContent"
import JobsHeader from "@/components/page-headers/JobsHeader"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Jobs",
  description: "Apply to join the ABCo team and explore current openings.",
}

export default function JobsPage() {
  return (
    <>
      <JobsHeader />

      <JobsPageContent />
    </>
  )
}
