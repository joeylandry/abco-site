import type { Metadata } from "next"
import ContactPageContent from "@/components/contact/ContactPageContent"
import ContactHeader from "@/components/page-headers/ContactHeader"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact ABCo for wholesale inquiries, community questions, and general feedback.",
}

export default function ContactPage() {
  return (
    <>
      <ContactHeader />

      <ContactPageContent />
    </>
  )
}
