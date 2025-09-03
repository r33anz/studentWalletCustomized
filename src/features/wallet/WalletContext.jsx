// WalletProvider.jsx
import React, { useState, useContext, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import provider from "../../contracts/conecction/blockchainConnection";
import abiKardexNFT from "../../contracts/abi/abiKardexNFT";

const WalletContext = React.createContext();
export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [walletData, setWalletData] = useState(null);
  const [balance, setBalance] = useState("0 ETH");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const reconstructWallet = useCallback((wallet) => {
    try {
      let reconstructedWallet;
      if (!(wallet instanceof ethers.HDNodeWallet)) {
        if (wallet.mnemonic && wallet.mnemonic.phrase) {
          reconstructedWallet = ethers.HDNodeWallet.fromPhrase(wallet.mnemonic.phrase);
        } else {
          reconstructedWallet = new ethers.HDNodeWallet(
            wallet.privateKey,
            wallet.publicKey,
            wallet.address
          );
        }
      } else {
        reconstructedWallet = wallet;
      }
      return reconstructedWallet;
    } catch (err) {
      console.error("Error reconstruyendo wallet:", err);
      throw new Error("No se pudo reconstruir la wallet");
    }
  }, []);

  const refreshWalletData = useCallback(async () => {
    if (!walletData?.wallet || !walletData?.sisCode || isRefreshing) return;

    setIsRefreshing(true);
    try {
      const wallet = reconstructWallet(walletData.wallet);
      const connectedWallet = wallet.connect(provider);

      const newBalance = await provider.getBalance(connectedWallet.address);
      const nftData = await fetchNFTData(wallet.address);

      setWalletData((prev) => ({
        ...prev,
        wallet,
        balance: ethers.formatEther(newBalance),
        nftData,
        lastRefreshed: Date.now(),
      }));

      setBalance(`${ethers.formatEther(newBalance)} ETH`);
      return { balance: ethers.formatEther(newBalance) };
    } catch (error) {
      console.error("Error refreshing wallet:", error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [walletData, reconstructWallet, isRefreshing]);

  const fetchNFTData = useCallback(async (walletAddress) => {
    try {
      const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS_KARDEX_NFT;
      const nftContract = new ethers.Contract(contractAddress, abiKardexNFT, provider);

      const hasNft = await nftContract.hasKardex(walletAddress);
      if (!hasNft) {
        return { hasNFT: false, message: "No tienes un NFT Kardex aún. Solicítalo en la sección Kardex." };
      }

        const tokenId = await nftContract.studentToToken(walletAddress);
        const [kardexInfo, tokenURI] = await Promise.all([
        nftContract.getStudentKardex(walletAddress),
        nftContract.tokenURI(tokenId),
        ]);

      let cid = tokenURI.replace(`${process.env.REACT_APP_IPFS_GATEWAY}`, "");
      if (tokenURI.startsWith("ipfs://")) cid = tokenURI.replace("ipfs://", "");

      const response = await fetch(`${process.env.REACT_APP_IPFS_GATEWAY}${cid}`);
      if (!response.ok) throw new Error("Error fetching metadata");
      const metadata = await response.json();

      return {
        hasNFT: true,
        tokenId: Number(tokenId),
        metadata,
        kardexInfo,
        loadedAt: Date.now(),
      };
    }catch (err) {
      console.error("Error fetching NFT data:", err);
      return { hasNFT: false, error: err.message };
    } 
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
        if (location.state && location.state.wallet && isMounted) {
          try {
              const wallet = reconstructWallet(location.state.wallet);
              const connectedWallet = wallet.connect(provider);
              const initialBalance = await provider.getBalance(connectedWallet.address);
              const nftData = await fetchNFTData(wallet.address);

              setWalletData({
              wallet,
              balance: ethers.formatEther(initialBalance),
              sisCode: location.state.sisCode,
              nftData,
              preloaded: location.state.preloaded || false,
              lastRefreshed: Date.now(),
              });

              setBalance(`${ethers.formatEther(initialBalance)} ETH`);
              await refreshWalletData();
            
          } catch (err) {
              console.error("Error inicializando wallet:", err);
              if (isMounted) navigate("/");
          }
        }else if (isMounted && !location.state?.wallet) {
          navigate("/");
        }
    };

    initialize();

    return () => {
        isMounted = false;
    };
    }, [location.state, navigate, reconstructWallet]);

  return (
    <WalletContext.Provider
      value={{
        walletData,
        setWalletData,
        balance,
        refreshWalletData,
        isRefreshing,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};