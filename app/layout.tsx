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
  title: "Thanarasan Sivanujan | Code & Soil — Portfolio",
  description:
    "Portfolio of Thanarasan Sivanujan, a full-stack developer, BSE Honours student, crypto algo-trader, Vedic Astrologer, and traditional Organic Farmer from Jaffna, Sri Lanka.",
  keywords: [
    "Thanarasan Sivanujan",
    "thanarasan sivanujan",
    "Sivanujan",
    "sivanujan",
    "sivanujan ousl",
    "sivanujan developer",
    "siva",
    "Full Stack Developer Sri Lanka",
    "Crypto Algo Trader Jaffna",
    "Organic Farmer Developer",
    "BSE student portfolio",
    "Vedic Astrology Developer",
    "sivanujan.dev",
  ],
  metadataBase: new URL("https://sivanujan.dev"),
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Thanarasan Sivanujan | Code & Soil",
    description: "Full-Stack Developer, Crypto Algo-Trader, and Organic Farmer from Jaffna, Sri Lanka.",
    url: "https://sivanujan.dev",
    siteName: "Thanarasan Sivanujan Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Thanarasan Sivanujan — Code & Soil Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thanarasan Sivanujan | Code & Soil",
    description: "Full-Stack Developer, Crypto Algo-Trader, and Organic Farmer from Jaffna, Sri Lanka.",
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
  // JSON-LD Structured Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Thanarasan Sivanujan",
    jobTitle: "Full-Stack Developer, Crypto Algo-Trader & Organic Farmer",
    url: "https://sivanujan.dev",
    email: "contact@sivanujan.online",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jaffna",
      addressCountry: "Sri Lanka",
    },
    colleague: "BSE Honours Student",
    sameAs: [
      "https://github.com/sivanujan",
      "https://www.linkedin.com/in/thanarasan-s-94a001122/",
    ],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
