import { z } from "zod";

// Stellar G-address: starts with 'G', followed by 55 chars from the base32
// alphabet (A-Z and 2-7), totalling 56 characters. This catches all malformed
// addresses without requiring the full CRC16 checksum from the Stellar SDK.
const stellarAddress = z
  .string()
  .regex(/^G[A-Z2-7]{55}$/, "Invalid Stellar public key");

export const DepositRequestSchema = z.object({
  walletAddress: stellarAddress,
  vaultId: z.string(),
  amount: z.string().regex(/^\d+(\.\d{1,7})?$/),
});

export const WithdrawRequestSchema = z.object({
  walletAddress: stellarAddress,
  vaultId: z.string(),
  // Protocol share count to burn: bToken collateral for Blend, dfToken count
  // for DeFindex. Both come from `position.shares` in the frontend.
  shares: z.string().regex(/^\d+(\.\d{1,7})?$/),
});

export const TrustlineRequestSchema = z.object({
  walletAddress: stellarAddress,
});

export const SubmitRequestSchema = z.object({
  xdr: z.string().min(1),
});

export type DepositRequest = z.infer<typeof DepositRequestSchema>;
export type WithdrawRequest = z.infer<typeof WithdrawRequestSchema>;
export type TrustlineRequest = z.infer<typeof TrustlineRequestSchema>;
export type SubmitRequest = z.infer<typeof SubmitRequestSchema>;

export function formatZodError(err: z.ZodError): string {
  const fields = err.flatten().fieldErrors;
  return Object.entries(fields).map(([k, v]) => `${k}: ${v?.join(", ")}`).join("; ") || "Invalid request";
}
