import React, { useState, useEffect } from "react";
import { WalletHeader } from "./components/WalletHeader";
import { NFTViewer } from "./components/NFTCard";
import { KardexCard } from "./components/KardexCard";
import { useWallet } from "./WalletContext";

export default function Wallet() {
  const { walletData, balance, refreshWalletData, isRefreshing } = useWallet();
  const [walletAddress, setWalletAddress] = useState("");
  const [sisCode, setSisCode] = useState("");
  const [activeTab, setActiveTab] = useState("nfts");

  useEffect(() => {
    if (walletData) {
      setWalletAddress(walletData.wallet?.address || "");
      setSisCode(walletData.sisCode || "");
    }
  }, [walletData]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copiado al portapapeles!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <WalletHeader
          walletAddress={walletAddress}
          balance={balance}
          onCopyAddress={() => copyToClipboard(walletAddress)}
        />
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b">
            <button
              className={`flex-1 py-3 px-4 font-medium transition-colors duration-200 ${
                activeTab === "nfts" ? "bg-orange-500 text-white" : "bg-gray-50 text-gray-700 hover:bg-orange-100"
              }`}
              onClick={() => setActiveTab("nfts")}
            >
              NFTs
            </button>
            <button
              className={`flex-1 py-3 px-4 font-medium transition-colors duration-200 ${
                activeTab === "kardex" ? "bg-orange-500 text-white" : "bg-gray-50 text-gray-700 hover:bg-orange-100"
              }`}
              onClick={() => setActiveTab("kardex")}
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