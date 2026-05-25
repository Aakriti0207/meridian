import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useWalletStore } from "../store/wallet";
import { signTransaction } from "../lib/wallet";
import { api } from "../lib/api";

const NETWORK_PASSPHRASE: Record<string, string> = {
  testnet: "Test SDF Network ; September 2015",
  mainnet: "Public Global Stellar Network ; September 2015",
};

export function useVaultActions() {
  const { publicKey, network } = useWalletStore();
  const queryClient = useQueryClient();
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runTx(buildFn: () => Promise<{ xdr: string }>) {
    if (!publicKey) return;
    setError(null);
    const { xdr } = await buildFn();
    const signedXdr = await signTransaction(xdr, NETWORK_PASSPHRASE[network]);
    await api.submitTx({ xdr: signedXdr });
    // Invalidate positions so the balance refreshes automatically.
    queryClient.invalidateQueries({ queryKey: ["positions", publicKey] });
  }

  async function deposit(amount: string) {
    setIsDepositing(true);
    try {
      await runTx(() => api.buildDeposit({ caller: publicKey, amount }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deposit failed");
    } finally {
      setIsDepositing(false);
    }
  }

  async function withdraw(shares: string) {
    setIsWithdrawing(true);
    try {
      await runTx(() => api.buildWithdraw({ caller: publicKey, shares }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Withdrawal failed");
    } finally {
      setIsWithdrawing(false);
    }
  }

  return { deposit, withdraw, isDepositing, isWithdrawing, error, clearError: () => setError(null) };
}
