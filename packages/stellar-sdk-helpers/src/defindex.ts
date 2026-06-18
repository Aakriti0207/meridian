import {
  Address,
  Contract,
  Networks,
  TransactionBuilder,
  nativeToScVal,
  rpc,
  xdr,
} from "@stellar/stellar-sdk";
import type { StellarNetwork } from "./types";

const BASE_FEE = "100";

export interface DefindexVaultConfig {
  // DeFindex vault contract (C...) the request targets.
  vaultId: string;
  network: StellarNetwork;
}

function passphraseFor(network: StellarNetwork): string {
  return network.network === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;
}

function i128(value: bigint): xdr.ScVal {
  return nativeToScVal(value, { type: "i128" });
}

async function prepareVaultTx(
  config: DefindexVaultConfig,
  caller: string,
  method: string,
  args: xdr.ScVal[]
): Promise<{ xdr: string; fee: string }> {
  const passphrase = passphraseFor(config.network);
  const server = new rpc.Server(config.network.rpcUrl);
  const account = await server.getAccount(caller);
  const contract = new Contract(config.vaultId);

  const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase: passphrase })
    .addOperation(contract.call(method, ...args))
    .setTimeout(300)
    .build();

  const sim = await server.simulateTransaction(tx);
  if (rpc.Api.isSimulationError(sim)) throw new Error(`Simulation failed: ${sim.error}`);

  const prepared = rpc.assembleTransaction(tx, sim).build();
  return { xdr: prepared.toEnvelope().toXDR("base64"), fee: sim.minResourceFee };
}

/**
 * Build an unsigned transaction that deposits `amount` (in stroops) of the
 * vault's single underlying asset into a DeFindex vault on behalf of `depositor`,
 * auto-investing into the vault's strategies. The user signs and submits the
 * returned XDR and holds the resulting dfToken shares directly — non-custodial.
 *
 * Contract ABI: deposit(amounts_desired: Vec<i128>, amounts_min: Vec<i128>,
 * from: Address, invest: bool). Single-asset vault, so each Vec has one element
 * and amounts_min equals amounts_desired (no slippage for a 1:1 deposit).
 */
export async function buildDefindexDepositTx(
  config: DefindexVaultConfig,
  depositor: string,
  amount: bigint
): Promise<{ xdr: string; fee: string }> {
  if (amount <= 0n) throw new Error("amount must be positive");
  return prepareVaultTx(config, depositor, "deposit", [
    xdr.ScVal.scvVec([i128(amount)]),
    xdr.ScVal.scvVec([i128(amount)]),
    Address.fromString(depositor).toScVal(),
    xdr.ScVal.scvBool(true),
  ]);
}

/**
 * Build an unsigned transaction that burns `shares` (dfTokens, in stroops) to
 * withdraw the proportional underlying back to `withdrawer`.
 *
 * Contract ABI: withdraw(withdraw_shares: i128, min_amounts_out: Vec<i128>,
 * from: Address). min_amounts_out is [0] — slippage protection is deferred to a
 * later pass that quotes the expected out amount.
 */
export async function buildDefindexWithdrawTx(
  config: DefindexVaultConfig,
  withdrawer: string,
  shares: bigint
): Promise<{ xdr: string; fee: string }> {
  if (shares <= 0n) throw new Error("shares must be positive");
  return prepareVaultTx(config, withdrawer, "withdraw", [
    i128(shares),
    xdr.ScVal.scvVec([i128(0n)]),
    Address.fromString(withdrawer).toScVal(),
  ]);
}
