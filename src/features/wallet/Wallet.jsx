import React, { useState,useEffect } from "react";
import { WalletHeader } from "./components/WalletHeader";
import { IPFSCard } from "./components/IPFSCard";
import { KardexCard } from "./components/KardexCard";
import { useWallet } from "./WalletContext";
import { useLocation } from "react-router-dom";
import { ethers } from "ethers";

export default function Wallet() {
  const { walletData } = useWallet();
  const [Wallet, setWallet] = useState(null)
  const [walletAddress,setWalletAddres] = useState("");
  const [balance,setBalance] = useState("");
  const [ipfsHash,setIPFSHash] = useState("");
  const [activeTab, setActiveTab] = useState("ipfs");

  useEffect(() => {
    if (walletData) {
      setWalletAddres(walletData.wallet.address)
      setBalance(walletData.balance+" TBNB")
      if(walletData.ipfsHash){
        setIPFSHash(walletData.hashIPFS)
      }else{
        setIPFSHash("Sin hash,solicitelo en la seccion de kardex.")
      }

      if (walletData?.wallet) {
            try {
              let reconstructedWallet;
              if (!(walletData.wallet instanceof ethers.HDNodeWallet)) {
                if (walletData.wallet.mnemonic && walletData.wallet.mnemonic.phrase) {
                  reconstructedWallet = ethers.HDNodeWallet.fromPhrase(
                    walletData.wallet.mnemonic.phrase
                  );
                } else {
                  reconstructedWallet = new ethers.HDNodeWallet(
                    walletData.wallet.privateKey, 
                    walletData.wallet.publicKey, 
                    walletData.wallet.address
                  );
                }
              } else {
                reconstructedWallet = walletData.wallet;
              }
              setWallet(reconstructedWallet);
            } catch (err) {
              console.error("Error reconstruyendo wallet:", err);
              setError("No se pudo reconstruir la wallet");
            }
          }
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