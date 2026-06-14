import { buildWithdrawTx } from "@meridian/stellar-sdk-helpers";
import { CONTRACT_ADDRESSES, STELLAR_NETWORKS } from "@meridian/shared";

const network = STELLAR_NETWORKS.testnet;
const vaultContractId = process.env.VAULT_CONTRACT_ID ?? CONTRACT_ADDRESSES.testnet.vault;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { walletAddress, vaultId, shares } = req.body ?? {};
  if (!walletAddress || !vaultId || !shares) {
    const missing = (["walletAddress", "vaultId", "shares"] as const)
      .filter((k) => !req.body?.[k])
      .join(", ");
    return res.status(400).json({ error: `Missing required fields: ${missing}` });
  }

  try {
    const result = await buildWithdrawTx(vaultContractId, walletAddress, shares, network);
    res.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to build withdraw transaction";
    res.status(500).json({ error: msg });
  }
}
