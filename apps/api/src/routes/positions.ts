import type { FastifyPluginAsync } from "fastify";
import { CONTRACT_ADDRESSES, STELLAR_NETWORKS } from "@meridian/shared";
import { fetchPosition } from "@meridian/stellar-sdk-helpers";

const network = STELLAR_NETWORKS.testnet;
const vaultContractId = process.env.VAULT_CONTRACT_ID ?? CONTRACT_ADDRESSES.testnet.vault;

export const positionsRoute: FastifyPluginAsync = async (app) => {
  app.get("/:publicKey", async (req, reply) => {
    const { publicKey } = req.params as { publicKey: string };

    if (!publicKey || publicKey.length !== 56) {
      return reply.code(400).send({ error: "Invalid public key" });
    }

    try {
      const positions = await fetchPosition(network, vaultContractId, publicKey);
      reply.send({ positions });
    } catch (err) {
      app.log.error(err, "[positions] read failed");
      reply.send({ positions: [] });
    }
  });
};
