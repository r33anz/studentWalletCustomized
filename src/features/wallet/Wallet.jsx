import React, { useState } from "react";
import { WalletHeader } from "./components/WalletHeader";
import { NFTViewer } from "./components/NFTCard";
import { KardexCard } from "./components/KardexCard";
import { WalletProvider, useWallet } from "./WalletContext";
import { useToast } from "../shared/components/Toast";
import { useSessionLock } from "../shared/hooks/useSessionLock";
import { LockScreen } from "./components/LockScreen";

function WalletContent() {
  var { walletData, balance, logout } = useWallet();
  var { addToast } = useToast();
  var { isLocked, unlock } = useSessionLock();
  var [activeTab, setActiveTab] = useState("nfts");

  var walletAddress = walletData?.wallet?.address || "";

  var copyToClipboard = async function (text) {
    try {
      await navigator.clipboard.writeText(text);
      addToast("Dirección copiada al portapapeles", "success", 2000);
    } catch (err) {
      addToast("No se pudo copiar al portapapeles", "error", 2000);
    }
  };

  if (isLocked) {
    return <LockScreen onUnlock={unlock} onLogout={logout} />;
  }

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <WalletHeader
          walletAddress={walletAddress}
          balance={balance}
          onCopyAddress={function () { copyToClipboard(walletAddress); }}
          onLogout={logout}
        />
        <div className="bg-surface-card border border-border rounded-2xl overflow-hidden shadow-card">
          <div className="flex p-1 m-3 rounded-xl bg-surface border border-border">
            <button
              type="button"
              className={"flex-1 py-3 px-4 font-medium text-sm rounded-lg transition-all duration-200 " + (activeTab === "nfts" ? "bg-coral text-white shadow-card" : "text-gray-500 hover:text-gray-700")}
              onClick={function () { setActiveTab("nfts"); }}
            >
              NFTs
            </button>
            <button
              type="button"
              className={"flex-1 py-3 px-4 font-medium text-sm rounded-lg transition-all duration-200 " + (activeTab === "kardex" ? "bg-coral text-white shadow-card" : "text-gray-500 hover:text-gray-700")}
              onClick={function () { setActiveTab("kardex"); }}
            >
              Kardex
            </button>
          </div>
          {activeTab === "nfts" && <NFTViewer />}
          {activeTab === "kardex" && <KardexCard />}
        </div>
      </div>
    </div>
  );
}

export default function Wallet() {
  return (
    <WalletProvider>
      <WalletContent />
    </WalletProvider>
  );
}
