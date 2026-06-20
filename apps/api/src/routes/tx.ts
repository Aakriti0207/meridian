import type { FastifyPluginAsync } from "fastify";
import {
  APP_NETWORK,
  buildTxAddresses,
  DepositRequestSchema,
  WithdrawRequestSchema,
  TrustlineRequestSchema,
  SubmitRequestSchema,
  formatZodError,
} from "@meridian/shared";
import {
  buildDepositTx,
  buildWithdrawTx,
  buildAddTrustlineTx,
  submitTx,
} from "@meridian/stellar-sdk-helpers";

export const txRoute: FastifyPluginAsync = async (app) => {
  app.post("/deposit", async (req, reply) => {
    const parsed = DepositRequestSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: formatZodError(parsed.error) });

    try {
      const { walletAddress, vaultId, amount } = parsed.data;
      const result = await buildDepositTx(
        vaultId, walletAddress, amount,
        buildTxAddresses(process.env.DEFINDEX_VAULT_ID),
        APP_NETWORK
      );
      reply.send(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to build deposit transaction";
      reply.code(500).send({ error: msg });
    }
  });

  app.post("/withdraw", async (req, reply) => {
    const parsed = WithdrawRequestSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: formatZodError(parsed.error) });

    try {
      const { walletAddress, vaultId, shares } = parsed.data;
      const result = await buildWithdrawTx(
        vaultId, walletAddress, shares,
        buildTxAddresses(process.env.DEFINDEX_VAULT_ID),
        APP_NETWORK
      );
      reply.send(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to build withdraw transaction";
      reply.code(500).send({ error: msg });
    }
  });

  app.post("/add-trustline", async (req, reply) => {
    const parsed = TrustlineRequestSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: formatZodError(parsed.error) });

    try {
      const result = await buildAddTrustlineTx(parsed.data.walletAddress, APP_NETWORK);
      reply.send(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to build trustline transaction";
      reply.code(500).send({ error: msg });
    }
  });

  app.post("/submit", async (req, reply) => {
    const parsed = SubmitRequestSchema.safeParse(req.body);
    if (!parsed.success) return reply.code(400).send({ error: formatZodError(parsed.error) });

    try {
      const result = await submitTx(parsed.data.xdr, APP_NETWORK);
      reply.send(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit transaction";
      reply.code(500).send({ error: msg });
    }
  });
};
