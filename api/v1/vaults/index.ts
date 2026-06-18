import { fetchAllVaults } from "@meridian/stellar-sdk-helpers";

// Cache the aggregated vault list at the Vercel CDN. APY/TVL move slowly, so a
// short fresh window keeps DeFiLlama call volume low, and the stale-while-
// revalidate window lets the edge keep serving the last good payload through a
// transient DeFiLlama outage instead of failing the whole dashboard.
const CACHE_CONTROL = "public, s-maxage=60, stale-while-revalidate=300";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(_req: any, res: any) {
  try {
    const vaults = await fetchAllVaults();
    res.setHeader("Cache-Control", CACHE_CONTROL);
    res.json({ vaults, updatedAt: new Date().toISOString(), cached: false });
  } catch (err) {
    console.error("[vaults] fetch error:", err);
    res.status(500).json({ error: "Failed to fetch vaults" });
  }
}
