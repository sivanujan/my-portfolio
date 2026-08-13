import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CustomCursor from "@/components/shared/CustomCursor";
import PageLoader from "@/components/shared/PageLoader";
import SectionIndicator from "@/components/shared/SectionIndicator";
import ScrollProgressBar from "@/components/shared/ScrollProgressBar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sivanujan (T. Sivanujan) | Full-Stack Developer & Software Engineer",
    template: "%s | Sivanujan",
  },
  description:
    "Official portfolio of Sivanujan (T. Sivanujan / Thanarasan Sivanujan) — Full-Stack Software Engineer, BSE Honours student, Crypto Algo-Trader, and Organic Farmer from Jaffna, Sri Lanka.",
  keywords: [
    "Sivanujan",
    "sivanujan",
    "T. Sivanujan",
    "T.Sivanujan",
    "Thanarasan Sivanujan",
    "Sivanujan Thanarasan",
    "sivanujan portfolio",
    "sivanujan developer",
    "sivanujan jaffna",
    "sivanujan ousl",
    "sivanujan.online",
    "Full Stack Developer Sri Lanka",
    "Crypto Algo Trader Jaffna",
    "Organic Farmer Developer",
    "BSE student portfolio",
    "Vedic Astrology Developer",
  ],
  metadataBase: new URL("https://sivanujan.online"),
  alternates: {
    canonical: "https://sivanujan.online",
  },
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Sivanujan (T. Sivanujan) | Code & Soil — Official Portfolio",
    description:
      "Official website of Sivanujan — Full-Stack Developer, Crypto Algo-Trader, and Organic Farmer from Jaffna, Sri Lanka.",
    url: "https://sivanujan.online",
    siteName: "Sivanujan Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sivanujan (T. Sivanujan) — Code & Soil Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sivanujan (T. Sivanujan) | Software Engineer & Developer",
    description:
      "Official website of Sivanujan — Full-Stack Developer, Crypto Algo-Trader, and Organic Farmer from Jaffna, Sri Lanka.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Schemas for Google Search
  const jsonLdPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://sivanujan.online/#person",
    name: "Sivanujan",
    alternateName: [
      "T. Sivanujan",
      "T.Sivanujan",
      "Thanarasan Sivanujan",
      "Sivanujan Thanarasan",
      "sivanujan",
    ],
    givenName: "Thanarasan",
    familyName: "Sivanujan",
    jobTitle: "Full-Stack Software Engineer & Algo-Trader",
    url: "https://sivanujan.online",
    image: "https://sivanujan.online/og-image.png",
    email: "contact@sivanujan.online",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jaffna",
      addressCountry: "Sri Lanka",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Open University of Sri Lanka",
    },
    sameAs: [
      "https://github.com/sivanujan",
      "https://www.linkedin.com/in/thanarasan-s-94a001122/",
      "https://sivanujan.online",
    ],
  };

  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://sivanujan.online/#website",
    url: "https://sivanujan.online",
    name: "Sivanujan | Official Portfolio",
    alternateName: ["Sivanujan Developer", "T. Sivanujan Portfolio"],
    publisher: {
      "@id": "https://sivanujan.online/#person",
    },
  };

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable} font-sans min-h-screen flex flex-col antialiased relative`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Page Load Splash Sequence */}
          <PageLoader />

          {/* Fixed Scroll Progress Bar */}
          <ScrollProgressBar />

          {/* Desktop Left-side Section Indicator */}
          <SectionIndicator />

          {/* Custom Cursor Overlay */}
          <CustomCursor />

          {/* SCANLINE effect for brutalist terminal vibe in Dev Mode */}
          <div className="scanline pointer-events-none" />

          {/* Shell Container */}
          <div className="flex flex-col min-h-screen relative z-10 terminal-flicker">
            <Navbar />
            <main className="flex-grow flex flex-col">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>

        {/* Structured Schema.org scripting */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </body>
    </html>
  );
}
