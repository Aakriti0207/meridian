import { describe, it, expect } from "vitest";
import { buildDefindexDepositTx, buildDefindexWithdrawTx } from "./defindex";
import type { StellarNetwork } from "./types";

const network: StellarNetwork = {
  network: "testnet",
  rpcUrl: "https://soroban-testnet.stellar.org",
  passphrase: "Test SDF Network ; September 2015",
};
const config = { vaultId: "CVAULT", network };
const ADDR = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";

// The positive-amount guards run before any network access, so they are
// unit-testable without an RPC server.
describe("buildDefindexDepositTx", () => {
  it("rejects a non-positive amount", async () => {
    await expect(buildDefindexDepositTx(config, ADDR, 0n)).rejects.toThrow(/positive/);
    await expect(buildDefindexDepositTx(config, ADDR, -1n)).rejects.toThrow(/positive/);
  });
});

describe("buildDefindexWithdrawTx", () => {
  it("rejects non-positive shares", async () => {
    await expect(buildDefindexWithdrawTx(config, ADDR, 0n)).rejects.toThrow(/positive/);
  });
});
