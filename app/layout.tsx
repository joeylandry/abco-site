import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AgeGate from "@/components/layout/AgeGate";
import ScrollToTopOnNavigation from "@/components/layout/ScrollToTopOnNavigation";
import localFont from "next/font/local";
import type { Metadata } from "next";
import Script from "next/script";
import { cookies } from "next/headers";
import { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.arlingtonbeerco.com"),
  title: {
    default: "ABCo",
    template: "%s | ABCo",
  },
  description:
    "ABCo serves craft beer, community events, and taproom experiences in Arlington, MA.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ABCo",
    title: "ABCo",
    description:
      "ABCo serves craft beer, community events, and taproom experiences in Arlington, MA.",
  },
  twitter: {
    card: "summary",
    title: "ABCo",
    description:
      "ABCo serves craft beer, community events, and taproom experiences in Arlington, MA.",
  },
};

/* =====================
   FONT DEFINITIONS
===================== */

const konTiki = localFont({
  src: [
    {
      path: "../public/fonts/kon-tiki/KonTikiAlohaJF-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-display",
  display: "swap",
});

const montserrat = localFont({
  src: [
    {
      path: "../public/fonts/montserrat/Montserrat-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/montserrat/Montserrat-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/montserrat/Montserrat-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-title",
  display: "swap",
});

const manrope = localFont({
  src: [
    {
      path: "../public/fonts/manrope/Manrope-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/manrope/Manrope-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/manrope/Manrope-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/manrope/Manrope-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

/* =====================
   ROOT LAYOUT
===================== */

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const ageVerified = cookieStore.get("abco-age-verified")?.value === "true";

  return (
    <html
      lang="en"
      className={`${konTiki.variable} ${montserrat.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen overflow-x-hidden font-sans">
        <Script id="abco-age-gate-init" strategy="beforeInteractive">
          {`(() => {
  document.documentElement.dataset.abcoAgeVerified = "${ageVerified ? "true" : "false"}";
})();`}
        </Script>
        <Suspense fallback={null}>
          <ScrollToTopOnNavigation />
        </Suspense>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {!ageVerified ? <AgeGate /> : null}
        <div className="flex min-h-screen flex-col">
          <Header />
          <main id="main-content" className="flex-1 bg-white pt-[4.75rem] md:pt-[4.75rem]">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
