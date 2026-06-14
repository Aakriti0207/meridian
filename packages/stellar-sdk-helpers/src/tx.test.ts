import { describe, it, expect } from "vitest";
import { rpc } from "@stellar/stellar-sdk";
import { toStroops, resolveProtocol, waitForTransaction } from "./tx";

const { SUCCESS, FAILED, NOT_FOUND } = rpc.Api.GetTransactionStatus;

// A getTransaction stub that replays a fixed sequence of statuses, repeating the
// last one once exhausted, and counts how many times it was polled.
function fakeReader(statuses: rpc.Api.GetTransactionStatus[]) {
  let i = 0;
  const reader = {
    calls: 0,
    async getTransaction() {
      reader.calls += 1;
      const status = statuses[Math.min(i++, statuses.length - 1)];
      return { status, ledger: 42 } as rpc.Api.GetTransactionResponse;
    },
  };
  return reader;
}

// Sleep is a no-op in tests; `now` steps forward a fixed amount on every call so
// the timeout deadline is reached deterministically without real timers.
const noopSleep = async () => {};
function steppingClock(stepMs: number) {
  let t = 0;
  return () => (t += stepMs);
}

describe("toStroops", () => {
  it("converts whole USDC amounts to 7-decimal stroops", () => {
    expect(toStroops("1")).toBe(10_000_000n);
    expect(toStroops("100")).toBe(1_000_000_000n);
    expect(toStroops("0")).toBe(0n);
  });

  it("converts fractional amounts", () => {
    expect(toStroops("1.5")).toBe(15_000_000n);
    expect(toStroops("123.45")).toBe(1_234_500_000n);
  });

  it("handles the smallest unit (1 stroop) and zero-padded fractions", () => {
    expect(toStroops("0.0000001")).toBe(1n);
    expect(toStroops("0.05")).toBe(500_000n);
  });

  it("truncates fractional precision beyond 7 decimals rather than rounding", () => {
    expect(toStroops("1.23456789")).toBe(12_345_678n);
  });

  it("treats a missing fractional part as zero", () => {
    expect(toStroops("42")).toBe(420_000_000n);
  });
});

describe("resolveProtocol", () => {
  it("maps blend vault ids to Blend", () => {
    expect(resolveProtocol("blend-usdc-fixed")).toBe("Blend");
    expect(resolveProtocol("blend-eurc-variable")).toBe("Blend");
  });

  it("maps defindex vault ids to DeFindex", () => {
    expect(resolveProtocol("defindex-usdc")).toBe("DeFindex");
  });

  it("throws for vault ids with no protocol mapping", () => {
    expect(() => resolveProtocol("ondo-usdy")).toThrow(/No protocol mapping/);
    expect(() => resolveProtocol("")).toThrow(/No protocol mapping/);
  });
});

describe("waitForTransaction", () => {
  it("resolves once the transaction reaches SUCCESS", async () => {
    const reader = fakeReader([NOT_FOUND, NOT_FOUND, SUCCESS]);
    const res = await waitForTransaction(reader, "TXHASH", { sleep: noopSleep });
    expect(res.status).toBe(SUCCESS);
    expect(res.ledger).toBe(42);
    expect(reader.calls).toBe(3);
  });

  it("polls only until the first final status, not beyond", async () => {
    const reader = fakeReader([SUCCESS]);
    await waitForTransaction(reader, "TXHASH", { sleep: noopSleep });
    expect(reader.calls).toBe(1);
  });

  it("throws when the transaction fails on-chain", async () => {
    const reader = fakeReader([NOT_FOUND, FAILED]);
    await expect(
      waitForTransaction(reader, "TXHASH", { sleep: noopSleep })
    ).rejects.toThrow(/failed on-chain/);
  });

  it("times out while the transaction stays NOT_FOUND", async () => {
    const reader = fakeReader([NOT_FOUND]);
    await expect(
      waitForTransaction(reader, "TXHASH", {
        sleep: noopSleep,
        now: steppingClock(5_000),
        timeoutMs: 10_000,
      })
    ).rejects.toThrow(/Timed out/);
  });
});
