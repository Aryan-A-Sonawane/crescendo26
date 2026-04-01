import type { Metadata } from "next";
import { Poppins, Cinzel_Decorative, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// Crescendo'26 Theme Fonts
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://crsc.studentcouncilvitpune.in";
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CRESCENDO'26",
  alternateName: "Crescendo 2026",
  url: siteUrl,
  description:
    "Intercollege technical, cultural, and sports festival by VIT Pune.",
  inLanguage: "en-IN",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CRESCENDO'26 - Inter College Cultural Fest",
    template: "%s | CRESCENDO'26",
  },
  description:
    "The ultimate inter-college cultural fest celebrating creativity, talent, and innovation. Join us for three days of music, dance, drama, and more!",
  keywords: [
    "Crescendo 2026",
    "Crescendo VIT Pune",
    "Inter college fest",
    "Technical events",
    "Cultural events",
    "Sports competitions",
    "VIT Pune",
    "College competitions",
  ],
  openGraph: {
    type: "website",
    url: "/",
    title: "CRESCENDO'26 - Inter College Cultural Fest",
    description:
      "The ultimate inter-college cultural fest celebrating creativity, talent, and innovation. Join us for three days of music, dance, drama, and more!",
    siteName: "CRESCENDO'26",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "CRESCENDO'26 - Inter College Cultural Fest",
    description:
      "The ultimate inter-college cultural fest celebrating creativity, talent, and innovation.",
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
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nishtha:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${poppins.variable} ${cinzelDecorative.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
