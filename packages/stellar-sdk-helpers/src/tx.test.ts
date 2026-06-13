import { describe, it, expect } from "vitest";
import { toStroops, resolveProtocol } from "./tx";

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
