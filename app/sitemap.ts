import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://matchedgefc.com";
  const root = base.replace(/\/$/, "");
  return [
    { url: root, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${root}/success`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];
}
