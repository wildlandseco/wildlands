import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wild Lands Ecological Services",
  description: "Science-forward habitat restoration and wildlife management across the Southeast.",
  metadataBase: new URL("https://wildlandseco.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}