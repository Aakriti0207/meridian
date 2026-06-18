import { fetchPosition } from "@meridian/stellar-sdk-helpers";
import { CONTRACT_ADDRESSES, STELLAR_NETWORKS } from "@meridian/shared";

const network = STELLAR_NETWORKS.testnet;
const vaultContractId = process.env.VAULT_CONTRACT_ID ?? CONTRACT_ADDRESSES.testnet.vault;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(req: any, res: any) {
  const { publicKey } = req.query as { publicKey: string };

  if (!publicKey || publicKey.length !== 56) {
    return res.status(400).json({ error: "Invalid public key" });
  }

  try {
    const positions = await fetchPosition(network, vaultContractId, publicKey);
    res.json({ positions });
  } catch (err) {
    console.error("[positions] error:", err);
    res.json({ positions: [] });
  }
}
