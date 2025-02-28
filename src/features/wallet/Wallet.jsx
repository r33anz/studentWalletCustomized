import React, { useState } from "react";
import { WalletHeader } from "./components/WalletHeader";
import { IPFSCard } from "./components/IPFSCard";
import { KardexCard } from "./components/KardexCard";

export default function Wallet() {
  const [walletAddress] = useState("0x1234...5678");
  const [balance] = useState("100 TBNB");
  const [ipfsHash] = useState("QmX...abc");
  const [activeTab, setActiveTab] = useState("ipfs");

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
                activeTab === "ipfs" ? "bg-orange-500 text-white" : "bg-gray-50 text-gray-700 hover:bg-orange-100"
              }`}
              onClick={() => setActiveTab("ipfs")}
            >
              IPFS Hash
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
          {activeTab === "ipfs" && <IPFSCard ipfsHash={ipfsHash} onCopy={() => copyToClipboard(ipfsHash)} />}
          {activeTab === "kardex" && <KardexCard />}
        </div>
      </div>
    </div>
  )
}