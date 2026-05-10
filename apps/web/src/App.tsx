import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { VaultList } from "./components/dashboard/VaultList";
import { PortfolioSummary } from "./components/dashboard/PortfolioSummary";
import { WalletConnect } from "./components/onboarding/WalletConnect";
import { useWalletStore } from "./store/wallet";
import { LandingPage } from "./landing/LandingPage";

const queryClient = new QueryClient();

function Dashboard() {
  const { connected } = useWalletStore();

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-xl tracking-tight">Meridian</span>
        <WalletConnect />
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {connected && <PortfolioSummary />}
        <VaultList />
      </div>
    </main>
  );
}

export default function App() {
  const [view, setView] = useState<"landing" | "app">(() =>
    window.location.hash === "#app" ? "app" : "landing"
  );

  function launchApp() {
    window.location.hash = "app";
    setView("app");
  }

  if (view === "landing") {
    return <LandingPage onLaunchApp={launchApp} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}
