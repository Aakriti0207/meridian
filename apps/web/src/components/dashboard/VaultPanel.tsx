import { useState } from "react";
import { useVaults } from "../../hooks/useVaults";
import { usePositions } from "../../hooks/usePositions";
import { useVaultActions } from "../../hooks/useVaultActions";
import { useWalletStore } from "../../store/wallet";
import { useWalletConnect } from "../../hooks/useWalletConnect";

const PROTOCOL_LABEL: Record<string, string> = {
  blend: "Blend Capital",
  defindex: "DeFindex",
  ondo: "Ondo",
};

function formatUsd(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wider text-gray-500">{label}</span>
      <span className="text-lg font-bold text-white">{value}</span>
    </div>
  );
}

type Tab = "deposit" | "withdraw";

export function VaultPanel() {
  const { data: vaults, isLoading: vaultsLoading } = useVaults();
  const { connected, publicKey } = useWalletStore();
  const { handleConnect, status: connectStatus, error: connectError } = useWalletConnect();
  const { data: positions = [] } = usePositions(publicKey);
  const { deposit, withdraw, isDepositing, isWithdrawing, error: actionError, clearError } = useVaultActions();

  const [tab, setTab] = useState<Tab>("deposit");
  const [amount, setAmount] = useState("");

  // Pick the vault with the best APY as the active route.
  const bestVault = vaults?.reduce((best, v) => (v.apy > best.apy ? v : best), vaults[0]);

  const position = positions[0];
  const hasPosition = position && position.deposited > 0;

  async function handleDeposit() {
    if (!amount) return;
    await deposit(amount);
    setAmount("");
  }

  async function handleWithdraw() {
    if (!amount) return;
    await withdraw(amount);
    setAmount("");
  }

  function handleTabChange(next: Tab) {
    setTab(next);
    setAmount("");
    clearError();
  }

  return (
    <div className="rounded-2xl border border-gray-800 bg-[#161b22] overflow-hidden">
      {/* Stats bar */}
      <div className="px-6 py-5 border-b border-gray-800">
        <h2 className="text-base font-semibold text-white mb-4">Meridian Vault</h2>
        {vaultsLoading ? (
          <div className="flex gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 w-10 bg-gray-800 rounded animate-pulse" />
                <div className="h-6 w-16 bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : bestVault ? (
          <div className="flex gap-8">
            <StatCell label="Best APY" value={`${bestVault.apy.toFixed(2)}%`} />
            <StatCell
              label="TVL"
              value={
                bestVault.tvl >= 1_000_000
                  ? `$${(bestVault.tvl / 1_000_000).toFixed(1)}M`
                  : `$${(bestVault.tvl / 1_000).toFixed(0)}K`
              }
            />
            <StatCell label="Route" value={PROTOCOL_LABEL[bestVault.protocol] ?? bestVault.protocol} />
          </div>
        ) : (
          <p className="text-sm text-gray-500">No live rate data available.</p>
        )}
      </div>

      {/* Position summary */}
      {connected && hasPosition && (
        <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/40 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Your position</p>
            <p className="text-sm font-semibold text-white">{formatUsd(position.deposited)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-0.5">Earned</p>
            <p className="text-sm font-semibold text-emerald-400">+{formatUsd(position.earned)}</p>
          </div>
        </div>
      )}

      {/* Tab bar */}
      {connected && (
        <div className="flex border-b border-gray-800">
          {(["deposit", "withdraw"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => handleTabChange(t)}
              className={`flex-1 py-3 text-sm font-medium transition-colors duration-150 ${
                tab === t
                  ? "text-white border-b-2 border-emerald-500"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Action area */}
      <div className="px-6 py-5">
        {!connected ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-400 leading-relaxed">
              Connect your Freighter wallet to deposit USDC and start earning yield.
            </p>
            {connectStatus === "no-extension" ? (
              <a
                href="https://freighter.app"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center rounded-lg border border-amber-800 bg-transparent hover:border-amber-600 text-amber-400 hover:text-amber-300 text-sm font-medium py-2.5 transition-colors duration-150"
              >
                Install Freighter
              </a>
            ) : (
              <button
                onClick={handleConnect}
                disabled={connectStatus === "connecting"}
                className="w-full rounded-lg border border-gray-700 bg-transparent hover:border-gray-500 hover:text-white text-gray-300 text-sm font-medium py-2.5 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connectStatus === "connecting" ? "Connecting..." : "Connect Wallet"}
              </button>
            )}
            {connectError && <p className="text-xs text-red-400">{connectError}</p>}
          </div>
        ) : tab === "deposit" ? (
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs text-gray-500 mb-1.5 block">Amount</span>
              <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2.5 focus-within:border-gray-500 transition-colors duration-150">
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-xs font-medium text-gray-500 shrink-0">USDC</span>
              </div>
            </label>
            {actionError && <p className="text-xs text-red-400">{actionError}</p>}
            <button
              onClick={handleDeposit}
              disabled={!amount || isDepositing}
              className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-900 disabled:text-emerald-700 text-white text-sm font-medium py-2.5 transition-colors duration-150 disabled:cursor-not-allowed"
            >
              {isDepositing ? "Waiting for signature..." : "Deposit"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {!hasPosition ? (
              <p className="text-sm text-gray-500">You have no active position to withdraw from.</p>
            ) : (
              <>
                <label className="block">
                  <span className="text-xs text-gray-500 mb-1.5 block">Shares</span>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2.5 focus-within:border-gray-500 transition-colors duration-150">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() => setAmount(String(position.deposited))}
                      className="text-xs font-medium text-emerald-500 hover:text-emerald-400 shrink-0 transition-colors duration-150"
                    >
                      Max
                    </button>
                    <span className="text-xs font-medium text-gray-500 shrink-0">mUSDC</span>
                  </div>
                </label>
                {actionError && <p className="text-xs text-red-400">{actionError}</p>}
                <button
                  onClick={handleWithdraw}
                  disabled={!amount || isWithdrawing}
                  className="w-full rounded-lg border border-gray-700 bg-transparent hover:border-gray-500 hover:text-white text-gray-300 text-sm font-medium py-2.5 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isWithdrawing ? "Waiting for signature..." : "Withdraw"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
