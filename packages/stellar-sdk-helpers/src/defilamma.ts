export interface DefiLlamaPool {
  pool: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  poolMeta: string | null;
  stablecoin: boolean;
  chain: string;
}

const POOLS_URL = "https://yields.llama.fi/pools";
const MIN_TVL_USD = 1_000;
const MIN_APY = 0.01;

export async function getStellarStablecoinPools(): Promise<DefiLlamaPool[]> {
  const res = await fetch(POOLS_URL, { signal: AbortSignal.timeout(8_000) });
  if (!res.ok) throw new Error(`DeFiLlama /pools HTTP ${res.status}`);
  const json = (await res.json()) as { data: DefiLlamaPool[] };
  return json.data.filter(
    (p) => p.chain === "Stellar" && p.stablecoin && p.apy >= MIN_APY && p.tvlUsd >= MIN_TVL_USD
  );
}
