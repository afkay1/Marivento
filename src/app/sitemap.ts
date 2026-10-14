import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/format";
import { ROOMS } from "@/lib/data/rooms";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = ["", "/rooms", "/dining", "/spa", "/experiences", "/offers", "/our-story", "/getting-here", "/faq", "/policies", "/book"];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, lastModified: now, priority: p === "" ? 1 : 0.8 })),
    ...ROOMS.map((r) => ({ url: `${SITE_URL}/rooms/${r.slug}`, lastModified: now, priority: 0.8 })),
  ];
}
