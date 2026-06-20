import { z } from "zod";

export const DepositRequestSchema = z.object({
  walletAddress: z.string().length(56),
  vaultId: z.string(),
  amount: z.string().regex(/^\d+(\.\d{1,7})?$/),
});

export const WithdrawRequestSchema = z.object({
  walletAddress: z.string().length(56),
  vaultId: z.string(),
  // Protocol share count to burn: bToken collateral for Blend, dfToken count
  // for DeFindex. Both come from `position.shares` in the frontend.
  shares: z.string().regex(/^\d+(\.\d{1,7})?$/),
});

export const TrustlineRequestSchema = z.object({
  walletAddress: z.string().length(56),
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
