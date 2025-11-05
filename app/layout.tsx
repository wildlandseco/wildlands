// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

const siteName = "Wild Lands Ecological Services";
const siteUrl  = "https://wildlandseco.com";
const siteDesc =
  "Stewardship partner for native habitat restoration—coastal to uplands. Plan • Implement • Maintain.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s • ${siteName}`,
  },
  description: siteDesc,
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: siteName,
    description: siteDesc,
    images: [{ url: "/og-wildlands.jpg", width: 1200, height: 630, alt: siteName }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDesc,
    images: ["/og-wildlands.jpg"],
  },
  alternates: { canonical: siteUrl },
  category: "environment",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD: Organization */}
        <script
          type="application/ld+json"
          // NOTE: don’t interpolate user input here
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteName,
              url: siteUrl,
              logo: `${siteUrl}/logo-wildlands.png`,
              description: siteDesc,
              areaServed: "US-Southeast",
              sameAs: [],
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  email: "info@wildlandseco.com",
                  areaServed: "US",
                  availableLanguage: ["English"],
                },
              ],
            }),
          }}
        />
      </head>
      <body className="bg-neutral-50">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
