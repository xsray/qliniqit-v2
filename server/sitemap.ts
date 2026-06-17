import { getDb } from "./db";
import { providerProfiles, specialties } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const BASE_URL = "https://www.qliniqit.com";

export async function generateSitemap(): Promise<string> {
  const db = getDb();

  const [providers, specs] = await Promise.all([
    db
      .select({ slug: providerProfiles.slug })
      .from(providerProfiles)
      .where(eq(providerProfiles.isActive, true)),
    db
      .select({ slug: specialties.slug })
      .from(specialties)
      .where(eq(specialties.isActive, true)),
  ]);

  const staticUrls = [
    { loc: "/", priority: "1.0", changefreq: "daily" },
    { loc: "/find-a-doctor", priority: "0.9", changefreq: "daily" },
    { loc: "/deals", priority: "0.8", changefreq: "hourly" },
    { loc: "/events", priority: "0.7", changefreq: "daily" },
    { loc: "/about", priority: "0.5", changefreq: "monthly" },
  ];

  const urls = [
    ...staticUrls.map(({ loc, priority, changefreq }) =>
      urlEntry(`${BASE_URL}${loc}`, priority, changefreq)
    ),
    ...providers
      .filter((p) => p.slug)
      .map((p) => urlEntry(`${BASE_URL}/provider/${p.slug}`, "0.8", "weekly")),
    ...specs.map((s) => urlEntry(`${BASE_URL}/specialty/${s.slug}`, "0.7", "weekly")),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

function urlEntry(loc: string, priority: string, changefreq: string): string {
  return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </url>`;
}
