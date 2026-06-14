import type { StellarNetwork } from "./types";

export interface DefindexVaultConfig {
  contractId: string;
  network: StellarNetwork;
}

export async function buildDefindexDepositTx(
  _config: DefindexVaultConfig,
  _depositor: string,
  _amount: bigint
) {
  throw new Error("Not implemented. See issue #5.");
}
