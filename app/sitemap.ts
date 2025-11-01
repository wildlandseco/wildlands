// app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://wildlandseco.com";
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/#services` },
    { url: `${base}/#ethic` },
    { url: `${base}/#approach` },
    { url: `${base}/#work` },
    { url: `${base}/#about` },
    { url: `${base}/#contact` },
    { url: `${base}/privacy` },   // add these pages when ready
    { url: `${base}/terms` },
  ];
}