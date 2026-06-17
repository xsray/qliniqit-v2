import { getDb } from "../db";
import { providerProfiles, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export type OgProviderData = {
  name: string;
  specialty: string;
  rating: string;
  reviewCount: number;
};

export async function getProviderOgData(slug: string): Promise<OgProviderData | null> {
  const db = getDb();
  const [row] = await db
    .select({
      name: users.name,
      rating: providerProfiles.ratingAvg,
      reviewCount: providerProfiles.reviewCount,
    })
    .from(providerProfiles)
    .innerJoin(users, eq(users.id, providerProfiles.userId))
    .where(eq(providerProfiles.slug, slug))
    .limit(1);

  if (!row) return null;
  return {
    name: row.name ?? "Provider",
    specialty: "Healthcare Professional",
    rating: row.rating ?? "0",
    reviewCount: row.reviewCount ?? 0,
  };
}

export async function renderProviderOgImage(data: OgProviderData): Promise<Buffer> {
  // Minimal SVG-based OG image
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#0d9488"/>
    <text x="100" y="280" font-family="sans-serif" font-size="64" font-weight="bold" fill="white">${data.name}</text>
    <text x="100" y="360" font-family="sans-serif" font-size="36" fill="rgba(255,255,255,0.85)">${data.specialty}</text>
    <text x="100" y="440" font-family="sans-serif" font-size="32" fill="rgba(255,255,255,0.7)">⭐ ${data.rating} · ${data.reviewCount} reviews</text>
    <text x="100" y="560" font-family="sans-serif" font-size="28" fill="rgba(255,255,255,0.6)">qliniqit.com</text>
  </svg>`;

  const { Resvg } = await import("@resvg/resvg-js");
  const resvg = new Resvg(svg);
  return Buffer.from(resvg.render().asPng());
}
